import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildInDevelopmentPath, ROUTES } from '../../constants/routes';
import { fetchMyCandidateProfiles } from '../../services/api';
import styles from './Chitiethosoungvien.module.css';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=360&q=80';

const EMPTY_PROFILE = {
  candidate_id: null,
  full_name: '',
  avatar_url: DEFAULT_AVATAR,
  phone_number: '',
  email: '',
  location: '',
  headline: 'Ứng viên',
  overview: '',
  skills: [],
  languages: [],
  projects: [],
  education_timeline: [],
  matched_employers: [],
};

function safeSplitByComma(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeLanguageItems(payload) {
  if (Array.isArray(payload.ngoai_ngu)) {
    return payload.ngoai_ngu.map((item) => ({
      name: item?.ten_ngoai_ngu || item?.name || 'Ngoại ngữ',
      level: item?.tro_cap || item?.level || 'Chưa cập nhật',
    }));
  }

  if (Array.isArray(payload.languages)) {
    return payload.languages.map((item) => ({
      name: item?.name || item?.ten_ngoai_ngu || 'Ngoại ngữ',
      level: item?.level || item?.tro_cap || 'Chưa cập nhật',
    }));
  }

  return [];
}

function normalizeProjectItems(payload) {
  const source = Array.isArray(payload.du_an)
    ? payload.du_an
    : Array.isArray(payload.projects)
      ? payload.projects
      : [];

  return source.map((item) => {
    const rawTechnologies = item?.cong_nghe || item?.technologies || item?.tags || '';
    const tags = Array.isArray(rawTechnologies) ? rawTechnologies.filter(Boolean) : safeSplitByComma(rawTechnologies);

    return {
      title: item?.ten_du_an || item?.title || 'Dự án',
      description: item?.mo_ta || item?.description || 'Chưa có mô tả.',
      tags,
      link: item?.link || item?.url || '',
    };
  });
}

function normalizeEducationTimeline(payload) {
  const educationEntries = Array.isArray(payload.hoc_van) ? payload.hoc_van : [];
  const certificateEntries = Array.isArray(payload.chung_chi) ? payload.chung_chi : [];

  const mappedEducation = educationEntries.map((item, index) => ({
    id: `education-${index}`,
    title: item?.truong || 'Trường học',
    subtitle: item?.nganh || '',
    period: item?.nam_tot_nghiep ? `Tốt nghiệp: ${item.nam_tot_nghiep}` : '',
    description: '',
    certificates: [],
  }));

  const mappedCertificates = certificateEntries.map((item) => ({
    name: item?.ten_chung_chi || 'Chứng chỉ',
    year: item?.nam_cap || 'N/A',
  }));

  if (mappedEducation.length > 0 && mappedCertificates.length > 0) {
    mappedEducation[0].certificates = mappedCertificates;
    return mappedEducation;
  }

  if (mappedCertificates.length > 0) {
    return [
      {
        id: 'certificates-only',
        title: 'Chứng chỉ',
        subtitle: '',
        period: '',
        description: '',
        certificates: mappedCertificates,
      },
    ];
  }

  return mappedEducation;
}

function normalizeCandidateProfile(payload) {
  if (!payload || typeof payload !== 'object') {
    return EMPTY_PROFILE;
  }

  return {
    ...EMPTY_PROFILE,
    candidate_id: payload.candidate_id || payload.ung_vien_id || payload.ung_vien || EMPTY_PROFILE.candidate_id,
    full_name: payload.full_name || payload.ho_ten || payload.name || EMPTY_PROFILE.full_name,
    avatar_url: payload.avatar_url || payload.avatar || EMPTY_PROFILE.avatar_url,
    phone_number: payload.phone_number || payload.so_dien_thoai || EMPTY_PROFILE.phone_number,
    email: payload.email || payload.thu_dien_tu || payload.gmail || EMPTY_PROFILE.email,
    location: payload.location || payload.vi_tri_mong_muon || EMPTY_PROFILE.location,
    headline: payload.headline || payload.vi_tri_mong_muon || EMPTY_PROFILE.headline,
    skills: Array.isArray(payload.skills)
      ? payload.skills
      : payload.ky_nang
        ? safeSplitByComma(payload.ky_nang)
        : EMPTY_PROFILE.skills,
    overview: payload.overview || payload.gioi_thieu || EMPTY_PROFILE.overview,
    languages: normalizeLanguageItems(payload),
    projects: normalizeProjectItems(payload),
    education_timeline: normalizeEducationTimeline(payload),
  };
}

function Chitiethosoungvien() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profiles = await fetchMyCandidateProfiles();
        const profileData = profiles.length > 0 ? profiles[0] : null;

        if (!profileData) {
          throw new Error('Không tìm thấy hồ sơ');
        }

        const normalizedProfile = normalizeCandidateProfile(profileData);
        setProfile(normalizedProfile);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải hồ sơ:', err);
        setError(err?.message || 'Không thể tải hồ sơ. Vui lòng đăng nhập lại.');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <section className={styles['candidate-profile-page']}>
        <div className={styles['candidate-profile-shell']}>
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
            Đang tải hồ sơ...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles['candidate-profile-page']}>
        <div className={styles['candidate-profile-shell']}>
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#b42318' }}>
            {error}
          </div>
        </div>
      </section>
    );
  }

  const displayProfile = profile;

  return (
    <section className={styles['candidate-profile-page']}>
      <div className={styles['candidate-profile-shell']}>
        <div className={styles['candidate-layout']}>
          <aside className={styles['left-column']}>
            <article className={styles['profile-card']}>
              <div className={styles['avatar-wrap']}>
                <img src={displayProfile.avatar_url || DEFAULT_AVATAR} alt={displayProfile.full_name || 'Candidate avatar'} />
                <span className={styles['online-dot']} />
              </div>

              <h1>{displayProfile.full_name}</h1>
              <p>{displayProfile.headline}</p>

              <div className={styles['section-title']}>Thông tin liên hệ</div>
              <ul className={styles['info-list']}>
                <li>
                  <span>☎</span>
                  <strong>{displayProfile.phone_number}</strong>
                </li>
                <li>
                  <span>✉</span>
                  <strong>{displayProfile.email}</strong>
                </li>
                <li>
                  <span>⌖</span>
                  <strong>{displayProfile.location}</strong>
                </li>
              </ul>
            </article>

            <article className={styles['side-card']}>
              <h3>Kỹ năng</h3>
              <div className={styles['chips']}>
                {displayProfile.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>

            <article className={styles['side-card']}>
              <h3>Ngôn ngữ</h3>
              {displayProfile.languages.length > 0 ? (
                <ul className={styles['language-list']}>
                  {displayProfile.languages.map((language, index) => (
                    <li key={`${language.name}-${index}`}>
                      <span>{language.name}</span>
                      <strong>{language.level}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles['empty-note']}>Chưa cập nhật ngoại ngữ.</p>
              )}
            </article>
          </aside>

          <main className={styles['middle-column']}>
            <article className={styles['main-card']}>
              <div className={styles['card-head']}>
                <h2>Giới thiệu bản thân</h2>
                <div className={styles['card-actions']}>
                  <button
                    type="button"
                    className={styles['ghost-button']}
                    onClick={() => navigate(ROUTES.CANDIDATE_EDIT)}
                  >
                    Chỉnh sửa HS
                  </button>
                  <button
                    type="button"
                    className={styles['primary-button']}
                    onClick={() => navigate(buildInDevelopmentPath('candidate-profile-viewer'))}
                  >
                    Tải hồ sơ
                  </button>
                </div>
              </div>
              <p className={styles['intro-text']}>{displayProfile.overview || 'Ứng viên chưa cập nhật phần giới thiệu.'}</p>
            </article>

            <article className={styles['main-card']}>
              <div className={styles['card-head']}>
                <h2>Project nổi bật</h2>
                <button
                  type="button"
                  className={styles['link-button']}
                  onClick={() => navigate(buildInDevelopmentPath('candidate-projects'))}
                >
                  Xem tất cả
                </button>
              </div>

              {displayProfile.projects.length > 0 ? (
                <div className={styles['project-grid']}>
                  {displayProfile.projects.map((project, index) => (
                    <article key={`${project.title}-${index}`} className={styles['project-item']}>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      {project.tags.length > 0 ? (
                        <div className={styles['project-tags']}>
                          {project.tags.map((tag, tagIndex) => (
                            <span key={`${project.title}-${tag}-${tagIndex}`}>{tag}</span>
                          ))}
                        </div>
                      ) : null}
                      {project.link ? (
                        <a href={project.link} target="_blank" rel="noreferrer" className={styles['project-link']}>
                          Xem dự án
                        </a>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : (
                <p className={styles['empty-note']}>Chưa có dự án nào được cập nhật.</p>
              )}
            </article>

            <article className={styles['main-card']}>
              <h2>Trình độ học vấn</h2>
              {displayProfile.education_timeline.length > 0 ? (
                <div className={styles['timeline']}>
                  {displayProfile.education_timeline.map((item, index) => (
                    <article key={item.id || `${item.title}-${index}`} className={styles['timeline-item']}>
                      <span className={styles['timeline-dot']} />
                      <div>
                        <h3>{item.title}</h3>
                        {item.subtitle ? <p className={styles['timeline-subtitle']}>{item.subtitle}</p> : null}
                        {item.period ? <p className={styles['timeline-period']}>{item.period}</p> : null}
                        {item.description ? <p>{item.description}</p> : null}

                        {Array.isArray(item.certificates) && item.certificates.length > 0 ? (
                          <div className={styles['certificate-list']}>
                            {item.certificates.map((certificate, certIndex) => (
                              <div key={`${certificate.name}-${certIndex}`} className={styles['certificate-item']}>
                                <span>{certificate.name}</span>
                                <strong>{certificate.year}</strong>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className={styles['empty-note']}>Chưa cập nhật học vấn hoặc chứng chỉ.</p>
              )}
            </article>
          </main>

          <aside className={styles['right-column']}>
            <article className={styles['right-card']}>
              <h3>Nhà tuyển dụng phù hợp</h3>
              <div className={styles['employer-list']}>
                {displayProfile.matched_employers.map((employer, index) => (
                  <article key={`${employer.company}-${index}`} className={styles['employer-item']}>
                    <span className={styles['employer-logo']}>{employer.company.charAt(0)}</span>
                    <div>
                      <h4>{employer.company}</h4>
                      <p>{employer.role}</p>
                      <small>{employer.score}</small>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className={styles['suggestion-button']}
                onClick={() => navigate(buildInDevelopmentPath('matched-employers'))}
              >
                Xem tất cả gợi ý
              </button>
            </article>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Chitiethosoungvien;
