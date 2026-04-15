import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchCandidates, fetchMatchedCandidates } from '../../services/api';
import { buildCandidateDetailPath, buildInDevelopmentPath } from '../../constants/routes';
import styles from './Quanlyungvien.module.css';

const TAB_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'new', label: 'Mới' },
  { value: 'viewed', label: 'Đã xem' },
  { value: 'matched', label: 'Phù hợp' },
];

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80';

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

function formatRelativeDate(isoString) {
  if (!isoString) {
    return 'Không rõ';
  }

  const parsedDate = new Date(isoString);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Không rõ';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
}

function isRecentlyUpdated(isoString, thresholdDays = 7) {
  if (!isoString) {
    return false;
  }

  const parsedDate = new Date(isoString);
  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const elapsedDays = (Date.now() - parsedDate.getTime()) / (1000 * 60 * 60 * 24);
  return elapsedDays <= thresholdDays;
}

function parseAvailabilitySlots(inputValue) {
  return String(inputValue || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function Quanlyungvien() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const jobId = searchParams.get('job_id') || '';

  const [activeTab, setActiveTab] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('q') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'matching_desc');
  const [salaryMin, setSalaryMin] = useState(searchParams.get('salary_min') || '');
  const [salaryMax, setSalaryMax] = useState(searchParams.get('salary_max') || '');
  const [availabilityInput, setAvailabilityInput] = useState('');

  const [appliedFilters, setAppliedFilters] = useState(() => ({
    q: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    sort: searchParams.get('sort') || 'matching_desc',
    salary_min: searchParams.get('salary_min') || '',
    salary_max: searchParams.get('salary_max') || '',
    availability_slots: [],
  }));

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [candidatesPayload, setCandidatesPayload] = useState({ page: 1, limit: 20, total: 0, results: [] });

  useEffect(() => {
    let isActive = true;

    async function loadCandidates() {
      setIsLoading(true);
      setErrorMessage('');

      const requestParams = {
        page,
        limit,
        sort: appliedFilters.sort,
        q: appliedFilters.q,
        location: appliedFilters.location,
        salary_min: appliedFilters.salary_min,
        salary_max: appliedFilters.salary_max,
        availability_slots: appliedFilters.availability_slots,
      };

      try {
        const payload = jobId
          ? await fetchMatchedCandidates(jobId, requestParams)
          : await fetchCandidates(requestParams);

        if (!isActive) {
          return;
        }

        setCandidatesPayload({
          page: payload?.page ?? page,
          limit: payload?.limit ?? limit,
          total: payload?.total ?? 0,
          results: Array.isArray(payload?.results) ? payload.results : [],
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setCandidatesPayload({ page, limit, total: 0, results: [] });
        setErrorMessage(error?.message || 'Không tải được danh sách ứng viên.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadCandidates();

    return () => {
      isActive = false;
    };
  }, [appliedFilters, jobId, limit, page]);

  const displayCandidates = useMemo(() => {
    const sourceCandidates = Array.isArray(candidatesPayload.results) ? candidatesPayload.results : [];

    if (activeTab === 'new') {
      return sourceCandidates.filter((candidate) => isRecentlyUpdated(candidate.updated_at));
    }

    if (activeTab === 'matched') {
      return sourceCandidates.filter((candidate) => Number(candidate.matching_score) >= 70);
    }

    if (activeTab === 'viewed') {
      return sourceCandidates;
    }

    return sourceCandidates;
  }, [activeTab, candidatesPayload.results]);

  const totalPages = useMemo(() => {
    if (!candidatesPayload.total || !candidatesPayload.limit) {
      return 1;
    }
    return Math.max(1, Math.ceil(candidatesPayload.total / candidatesPayload.limit));
  }, [candidatesPayload.limit, candidatesPayload.total]);

  function handleApplyFilters() {
    const availabilitySlots = parseAvailabilitySlots(availabilityInput);
    const nextFilters = {
      q: searchKeyword.trim(),
      location: locationFilter.trim(),
      sort: sortBy,
      salary_min: salaryMin.trim(),
      salary_max: salaryMax.trim(),
      availability_slots: availabilitySlots,
    };

    setAppliedFilters(nextFilters);
    setPage(1);

    const nextSearchParams = new URLSearchParams();
    if (jobId) {
      nextSearchParams.set('job_id', jobId);
    }
    if (nextFilters.q) {
      nextSearchParams.set('q', nextFilters.q);
    }
    if (nextFilters.location) {
      nextSearchParams.set('location', nextFilters.location);
    }
    if (nextFilters.sort) {
      nextSearchParams.set('sort', nextFilters.sort);
    }
    if (nextFilters.salary_min) {
      nextSearchParams.set('salary_min', nextFilters.salary_min);
    }
    if (nextFilters.salary_max) {
      nextSearchParams.set('salary_max', nextFilters.salary_max);
    }

    setSearchParams(nextSearchParams);
  }

  function handleClearFilters() {
    setSearchKeyword('');
    setLocationFilter('');
    setSortBy('matching_desc');
    setSalaryMin('');
    setSalaryMax('');
    setAvailabilityInput('');

    setAppliedFilters({
      q: '',
      location: '',
      sort: 'matching_desc',
      salary_min: '',
      salary_max: '',
      availability_slots: [],
    });

    setPage(1);

    const nextSearchParams = new URLSearchParams();
    if (jobId) {
      nextSearchParams.set('job_id', jobId);
    }
    setSearchParams(nextSearchParams);
  }

  return (
    <section className={styles['candidate-management-page']}>
      <div className={styles['candidate-management-shell']}>
        <header className={styles['candidate-management-header']}>
          <h1>Màn hình quản lý ứng viên</h1>
          <p>
            {jobId
              ? `Đang hiển thị danh sách ứng viên phù hợp theo tin tuyển dụng #${jobId}.`
              : 'Danh sách ứng viên tổng quát theo bộ lọc tìm kiếm.'}
          </p>

          <div className={styles['candidate-management-search-wrap']}>
            <input
              type="search"
              placeholder="Tìm kiếm ứng viên theo tên hoặc kỹ năng..."
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
            <button type="button" onClick={handleApplyFilters}>
              Tìm kiếm
            </button>
          </div>
        </header>

        <div className={styles['candidate-management-content']}>
          <div className={styles['candidate-list-column']}>
            <div className={styles['candidate-tabs']} role="tablist" aria-label="Candidate tabs">
              {TAB_OPTIONS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  className={activeTab === tab.value ? 'is-active' : ''}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {isLoading ? <p className={styles['candidate-list-feedback']}>Đang tải dữ liệu ứng viên...</p> : null}
            {!isLoading && errorMessage ? <p className={styles['candidate-list-feedback error']}>{errorMessage}</p> : null}
            {!isLoading && !errorMessage && displayCandidates.length === 0 ? (
              <p className={styles['candidate-list-feedback']}>Không tìm thấy ứng viên phù hợp.</p>
            ) : null}

            <div className={styles['candidate-list-cards']}>
              {displayCandidates.map((candidate) => (
                <article key={candidate.candidate_id} className={styles['candidate-card']}>
                  <img
                    className={styles['candidate-avatar']}
                    src={candidate.avatar_url || DEFAULT_AVATAR}
                    alt={candidate.full_name || 'Candidate'}
                  />

                  <div className={styles['candidate-main-content']}>
                    <div className={styles['candidate-card-head']}>
                      <h2>{candidate.full_name || 'Ứng viên'}</h2>
                      {Number(candidate.matching_score) >= 80 ? <span>TOP TALENT</span> : null}
                    </div>

                    <p className={styles['candidate-subtitle']}>
                      {candidate.location || 'Không rõ địa điểm'} • Matching {candidate.matching_score ?? 0}%
                    </p>

                    <div className={styles['candidate-skills']}>
                      {(candidate.primary_skills || []).map((skill) => (
                        <span key={`${candidate.candidate_id}-${skill}`}>{skill}</span>
                      ))}
                    </div>

                    <div className={styles['candidate-meta']}>
                      <span>Lương mong muốn: {formatSalary(candidate.expected_salary)}</span>
                      <span>Cập nhật: {formatRelativeDate(candidate.updated_at)}</span>
                    </div>

                    <div className={styles['candidate-actions']}>
                      <button
                        type="button"
                        onClick={() => navigate(buildInDevelopmentPath('candidate-contact'))}
                      >
                        Liên hệ
                      </button>
                      <button
                        type="button"
                        className={styles['secondary']}
                        onClick={() => {
                          const nextSearch = routeLocation.search || '';
                          navigate(`${buildCandidateDetailPath(candidate.candidate_id)}${nextSearch}`, {
                            state: { fromPath: routeLocation.pathname, fromSearch: routeLocation.search },
                          });
                        }}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <footer className={styles['candidate-pagination']}>
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || isLoading}
              >
                Trước
              </button>
              <span>
                Trang {page}/{totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages || isLoading}
              >
                Sau
              </button>
            </footer>
          </div>

          <aside className={styles['candidate-filter-column']}>
            <h3>Bộ lọc nâng cao</h3>

            <label htmlFor="candidate-sort">Sắp xếp theo</label>
            <select id="candidate-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="matching_desc">Phù hợp cao nhất</option>
              <option value="updated_desc">Mới cập nhật</option>
            </select>

            <label htmlFor="candidate-location">Địa điểm</label>
            <input
              id="candidate-location"
              type="text"
              placeholder="VD: TP. Hồ Chí Minh"
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
            />

            <label>Mức lương mong muốn</label>
            <div className={styles['candidate-salary-range']}>
              <input
                type="number"
                placeholder="Min"
                value={salaryMin}
                onChange={(event) => setSalaryMin(event.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={salaryMax}
                onChange={(event) => setSalaryMax(event.target.value)}
              />
            </div>

            <label htmlFor="candidate-slot">Availability slots</label>
            <input
              id="candidate-slot"
              type="text"
              placeholder="Mon-AM,Tue-PM"
              value={availabilityInput}
              onChange={(event) => setAvailabilityInput(event.target.value)}
            />

            <button type="button" className={styles['apply-filter']} onClick={handleApplyFilters}>
              Áp dụng bộ lọc
            </button>
            <button type="button" className={styles['clear-filter']} onClick={handleClearFilters}>
              Xóa tất cả
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Quanlyungvien;
