import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchCandidateDetail } from '../../services/api';
import { ROUTES, buildInDevelopmentPath } from '../../constants/routes';
import styles from './Chitiethosoungvien.module.css';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=320&q=80';

function formatSalary(value) {
  if (value === null || value === undefined || value === '') {
    return 'Thỏa thuận';
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return `${new Intl.NumberFormat('vi-VN').format(numericValue)} VND`;
}

function formatDate(value) {
  if (!value) {
    return 'Không rõ';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Không rõ';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
}

function Chitiethosoungvien() {
  const { id } = useParams();
  const navigate = useNavigate();
  const routeLocation = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [candidateDetail, setCandidateDetail] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function loadCandidateDetail() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const payload = await fetchCandidateDetail(id);
        if (!isActive) {
          return;
        }
        setCandidateDetail(payload);
      } catch (error) {
        if (!isActive) {
          return;
        }
        setErrorMessage(error?.message || 'Không tải được thông tin ứng viên.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    if (id) {
      loadCandidateDetail();
    }

    return () => {
      isActive = false;
    };
  }, [id]);

  const reviewSummary = useMemo(
    () => candidateDetail?.review_summary || { avg_rating: 0, total_reviews: 0 },
    [candidateDetail],
  );

  const reviews = useMemo(() => candidateDetail?.reviews || [], [candidateDetail]);
  const skills = useMemo(() => candidateDetail?.skills || [], [candidateDetail]);
  const certifications = useMemo(() => candidateDetail?.certifications || [], [candidateDetail]);
  const experience = useMemo(() => candidateDetail?.experience || [], [candidateDetail]);

  return (
    <section className={styles['candidate-detail-page']}>
      <div className={styles['candidate-detail-shell']}>
        <button
          type="button"
          className={styles['candidate-back-button']}
          onClick={() => {
            if (routeLocation.state?.fromPath) {
              navigate(`${routeLocation.state.fromPath}${routeLocation.state.fromSearch || ''}`);
              return;
            }
            navigate(ROUTES.CANDIDATES);
          }}
        >
          Quay lại danh sách ứng viên
        </button>

        {isLoading ? <p className={styles['candidate-detail-feedback']}>Đang tải chi tiết ứng viên...</p> : null}
        {!isLoading && errorMessage ? <p className={`${styles['candidate-detail-feedback']} ${styles['error']}`}>{errorMessage}</p> : null}

        {!isLoading && !errorMessage && candidateDetail ? (
          <div className={styles['candidate-detail-grid']}>
            <div className={styles['candidate-detail-main']}>
              <section className={styles['candidate-profile-card']}>
                <img
                  src={candidateDetail.avatar_url || DEFAULT_AVATAR}
                  alt={candidateDetail.full_name || 'Candidate avatar'}
                />
                <div>
                  <div className={styles['candidate-profile-title']}>
                    <h1>{candidateDetail.full_name || 'Ứng viên'}</h1>
                    <span>PHÙ HỢP</span>
                  </div>

                  <p className={styles['candidate-profile-subtitle']}>Ứng viên tiềm năng cho vị trí phù hợp</p>

                  <div className={styles['candidate-profile-actions']}>
                    <button type="button" onClick={() => navigate(buildInDevelopmentPath('candidate-contact'))}>
                      Liên hệ ngay
                    </button>
                    <button
                      type="button"
                      className={styles['secondary']}
                      onClick={() => navigate(buildInDevelopmentPath('candidate-cv'))}
                    >
                      Tải CV
                    </button>
                  </div>
                </div>
              </section>

              <section className={styles['candidate-section-card']}>
                <h2>Giới thiệu bản thân</h2>
                <p>
                  Ứng viên hiện đang ở {candidateDetail.location || 'địa điểm chưa cập nhật'} với bộ kỹ năng
                  trọng tâm gồm {skills.slice(0, 4).join(', ') || 'chưa cập nhật'}.
                </p>
              </section>

              <section className={styles['candidate-section-card']}>
                <h2>Kinh nghiệm làm việc</h2>
                {experience.length === 0 ? (
                  <p className={styles['empty']}>Chưa có dữ liệu kinh nghiệm làm việc.</p>
                ) : (
                  <div className={styles['experience-list']}>
                    {experience.map((item, index) => (
                      <article key={`${item.title || 'exp'}-${index}`} className={styles['experience-item']}>
                        <div className={styles['experience-dot']} />
                        <div>
                          <h3>{item.title || 'Vị trí chưa cập nhật'}</h3>
                          <p>{item.company || 'Công ty chưa cập nhật'}</p>
                          <p>
                            {item.start_date || '---'} - {item.end_date || 'Hiện tại'}
                          </p>
                          {item.description ? <p>{item.description}</p> : null}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className={styles['candidate-section-card']}>
                <h2>Đánh giá gần đây</h2>
                <p>
                  Điểm trung bình: <strong>{reviewSummary.avg_rating}</strong> ({reviewSummary.total_reviews} đánh
                  giá)
                </p>
                {reviews.length === 0 ? (
                  <p className={styles['empty']}>Chưa có nhận xét chi tiết.</p>
                ) : (
                  <div className={styles['reviews-list']}>
                    {reviews.map((review, index) => (
                      <article key={`${review.created_at || 'review'}-${index}`}>
                        <h4>{review.rating}/5</h4>
                        <p>{review.comment || 'Không có nội dung nhận xét.'}</p>
                        <span>{formatDate(review.created_at)}</span>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <aside className={styles['candidate-detail-sidebar']}>
              <section className={styles['candidate-side-card']}>
                <h3>Thông tin liên hệ</h3>
                <ul>
                  <li>
                    <span>Địa điểm</span>
                    <strong>{candidateDetail.location || 'Chưa cập nhật'}</strong>
                  </li>
                  <li>
                    <span>Candidate ID</span>
                    <strong>#{candidateDetail.candidate_id}</strong>
                  </li>
                </ul>
              </section>

              <section className={styles['candidate-side-card']}>
                <h3>Thông tin tuyển dụng</h3>
                <ul>
                  <li>
                    <span>Mức lương mong muốn</span>
                    <strong>{formatSalary(candidateDetail.expected_salary)}</strong>
                  </li>
                  <li>
                    <span>Availability slots</span>
                    <strong>{candidateDetail.availability_slots?.join(', ') || 'Chưa cập nhật'}</strong>
                  </li>
                  <li>
                    <span>Tổng số review</span>
                    <strong>{reviewSummary.total_reviews}</strong>
                  </li>
                </ul>
              </section>

              <section className={styles['candidate-side-card']}>
                <h3>Kỹ năng chuyên môn</h3>
                {skills.length === 0 ? (
                  <p className={styles['empty']}>Chưa có dữ liệu kỹ năng.</p>
                ) : (
                  <div className={styles['skill-tags']}>
                    {skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                )}
              </section>

              <section className={styles['candidate-side-card']}>
                <h3>Chứng chỉ</h3>
                {certifications.length === 0 ? (
                  <p className={styles['empty']}>Chưa có dữ liệu chứng chỉ.</p>
                ) : (
                  <ul className={styles['cert-list']}>
                    {certifications.map((certificate, index) => (
                      <li key={`${certificate.name || 'cert'}-${index}`}>
                        <strong>{certificate.name || 'Chứng chỉ'}</strong>
                        <span>{certificate.issuer || ''}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </aside>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Chitiethosoungvien;
