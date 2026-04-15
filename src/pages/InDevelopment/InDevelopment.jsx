import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES, buildInDevelopmentPath } from '../../constants/routes';
import styles from './InDevelopment.module.css';

const FEATURE_LABELS = {
  '404': 'Trang bạn tìm không tồn tại trong demo hiện tại.',
  login: 'Tính năng đăng nhập đang được phát triển.',
  register: 'Tính năng đăng ký đang được phát triển.',
  chat: 'Màn hình chat đang được phát triển.',
  notifications: 'Trung tâm thông báo đang được phát triển.',
  profile: 'Trang hồ sơ đang được phát triển.',
  settings: 'Trang cài đặt đang được phát triển.',
  'job-history': 'Lịch sử công việc đang được phát triển.',
  companies: 'Danh sách doanh nghiệp đang được phát triển.',
  about: 'Trang giới thiệu đang được phát triển.',
  'privacy-policy': 'Trang chính sách bảo mật đang được phát triển.',
  terms: 'Trang điều khoản dịch vụ đang được phát triển.',
  contact: 'Trang liên hệ đang được phát triển.',
  cookies: 'Trang cài đặt cookie đang được phát triển.',
  'create-profile': 'Luồng tạo hồ sơ ứng viên đang được phát triển.',
  'learn-more': 'Nội dung giới thiệu thêm đang được phát triển.',
  'job-edit': 'Tính năng chỉnh sửa tin tuyển dụng đang được phát triển.',
  'job-delete': 'Tính năng xóa tin tuyển dụng đang được phát triển.',
  'candidate-contact': 'Tính năng liên hệ ứng viên đang được phát triển.',
  'candidate-cv': 'Tính năng tải CV đang được phát triển.',
};

function InDevelopment() {
  const location = useLocation();

  const featureName = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('feature') || '';
  }, [location.search]);

  const message = FEATURE_LABELS[featureName] || 'Chức năng này đang trong quá trình phát triển cho bản demo MVC.';

  return (
    <main className={styles['in-development-page']}>
      <section className={styles['in-development-card']}>
        <p className={styles['in-development-eyebrow']}>IN DEVELOPMENT</p>
        <h1>Tính năng chưa sẵn sàng</h1>
        <p>{message}</p>

        <div className={styles['in-development-actions']}>
          <Link to={ROUTES.JOB_SEARCH} className={`${styles['in-dev-button']} ${styles['primary']}`}>
            Về trang tìm việc
          </Link>
          <Link to={ROUTES.RECRUITMENT_LIST} className={styles['in-dev-button']}>
            Danh sách tuyển dụng
          </Link>
          <Link to={ROUTES.CANDIDATES} className={styles['in-dev-button']}>
            Quản lý ứng viên
          </Link>
          <Link to={buildInDevelopmentPath('404')} className={`${styles['in-dev-button']} ${styles['ghost']}`}>
            Xem thông báo 404 demo
          </Link>
        </div>
      </section>
    </main>
  );
}

export default InDevelopment;
