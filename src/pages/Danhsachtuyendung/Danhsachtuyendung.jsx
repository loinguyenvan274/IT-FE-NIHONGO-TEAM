import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { recruitmentPosts } from '../../data';
import { ROUTES } from '../../constants/routes';
import styles from './Danhsachtuyendung.module.css';

function SearchIcon() {
  return (
    <svg aria-hidden="true" className={styles['recruitment-icon']} viewBox="0 0 24 24">
      <path
        d="M15.5 15h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79L20 21.49 21.49 20 15.5 15Zm-6 0A4.5 4.5 0 1 1 14 10.5 4.5 4.5 0 0 1 9.5 15Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" className={styles['recruitment-icon']} viewBox="0 0 24 24">
      <path
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Danhsachtuyendung() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const incomingJobs = Array.isArray(routerLocation.state?.jobs) ? routerLocation.state.jobs : null;
  const sourcePosts = incomingJobs !== null ? incomingJobs : recruitmentPosts;

  const [keyword, setKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Tất cả');

  const locations = useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(sourcePosts.map((post) => post.location).filter(Boolean)),
    );
    return ['Tất cả', ...uniqueLocations];
  }, [sourcePosts]);

  const filteredPosts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return sourcePosts.filter((post) => {
      const matchTitle = String(post.title || '').toLowerCase().includes(normalizedKeyword);
      const matchLocation = selectedLocation === 'Tất cả' || post.location === selectedLocation;
      return matchTitle && matchLocation;
    });
  }, [keyword, selectedLocation, sourcePosts]);

  return (
    <section className={styles['recruitment-page']}>
      <div className={styles['recruitment-shell']}>
        <header className={styles['recruitment-header']}>
          <p className={styles['recruitment-kicker']}>Hệ thống tuyển dụng</p>
          <h1 className={styles['recruitment-title']}>Danh sách thông tin tuyển dụng</h1>

          <div className={styles['recruitment-toolbar']}>
            <div className={styles['recruitment-search-wrap']}>
              <SearchIcon />
              <input
                className={styles['recruitment-search']}
                type="text"
                placeholder="Tìm kiếm công việc"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>

            <div className={styles['recruitment-select-wrap']}>
              <LocationIcon />
              <select
                className={styles['recruitment-location-filter']}
                value={selectedLocation}
                onChange={(event) => setSelectedLocation(event.target.value)}
              >
                {locations.map((locationOption) => (
                  <option key={locationOption} value={locationOption}>
                    {locationOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className={styles['recruitment-table-head']}>
          <span>#</span>
          <span>Tên công việc</span>
          <span>Số vị trí</span>
          <span>Địa điểm</span>
          <span>Thao tác</span>
        </div>

        <div className={styles['recruitment-list']}>
          {filteredPosts.length === 0 ? (
            <p className={styles['recruitment-empty-state']}>Không có tin tuyển dụng phù hợp.</p>
          ) : (
            filteredPosts.map((post, index) => (
              <article
                key={post.id}
                className={`${styles['recruitment-row']} ${index % 2 === 0 ? styles['is-light'] : styles['is-low']}`}
              >
                <span className={styles['recruitment-index']}>{index + 1}</span>
                <div className={styles['recruitment-role']}>
                  <h2>{post.title}</h2>
                  <p>{post.summary}</p>
                </div>
                <span className={styles['recruitment-openings']}>{post.openings}</span>
                <div className={styles['recruitment-location']}>
                  <span>{post.location}</span>
                </div>
                <button
                  className={styles['recruitment-apply-btn']}
                  type="button"
                  onClick={() => {
                    navigate(ROUTES.JOB_DETAIL, {
                      state: {
                        recruitmentData: {
                          id: post.id,
                          title: post.title,
                          jobName: post.title,
                          companyName: post.companyName || 'Doanh nghiệp tuyển dụng',
                          salary: post.salary || 'Thỏa thuận',
                          location: post.location || 'Chưa cập nhật',
                          employmentType: post.employmentType || 'Toàn thời gian',
                          deadline: post.deadline || 'Chưa cập nhật',
                          description: post.summary || post.description || '',
                          requirements: post.requirements || 'Trao đổi trong quá trình phỏng vấn.',
                          benefits: post.benefits || 'Theo chính sách công ty.',
                        },
                      },
                    });
                  }}
                >
                  Xem chi tiết
                </button>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Danhsachtuyendung;
