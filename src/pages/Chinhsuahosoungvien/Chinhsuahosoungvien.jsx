import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildInDevelopmentPath } from '../../constants/routes';
import styles from './Chinhsuahosoungvien.module.css';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=360&q=80';

const MOCK_PROFILE = {
  candidate_id: 1024,
  full_name: 'Nguyễn Văn An',
  avatar_url: DEFAULT_AVATAR,
  phone_number: '+84 90 123 4567',
  location: 'Hồ Chí Minh, Việt Nam',
  headline: 'Senior Software Engineer',
  overview:
    'Là một Senior Software Engineer với hơn 5 năm kinh nghiệm trong việc thiết kế và phát triển các ứng dụng web có quy mô lớn. Tôi đam mê xây dựng các giải pháp tối ưu, chú trọng vào hiệu suất và trải nghiệm người dùng.',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Teamwork', 'Communication', 'Problem Solving'],
  education: [
    {
      id: 1,
      title: 'Gốc nhân Công nghệ Thông tin',
      school: 'Đại học Khoa học Tự nhiên TP.HCM',
      year: '2018',
    },
  ],
  certifications: [
    {
      id: 1,
      title: 'AWS Certified Solutions Architect - Associat',
      issuer: 'Amazon Web Services (AWS)',
      year: '2021',
    },
  ],
  languages: [
    {
      id: 1,
      language: 'Tiếng Anh',
      proficiency: 'IELTS 7.5',
    },
    {
      id: 2,
      language: 'Tiếng Nhật',
      proficiency: 'JLPT N2',
    },
  ],
};

function Chinhsuahosoungvien() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: MOCK_PROFILE.full_name,
    phone_number: MOCK_PROFILE.phone_number,
    location: MOCK_PROFILE.location,
    overview: MOCK_PROFILE.overview,
    skills: MOCK_PROFILE.skills,
    education: MOCK_PROFILE.education,
    certifications: MOCK_PROFILE.certifications,
    languages: MOCK_PROFILE.languages,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target;
      const newSkill = input.value.trim();

      if (newSkill && !formData.skills.includes(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }));
        input.value = '';
      }
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return { ...prev, education: newEducation };
    });
  };

  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          title: '',
          school: '',
          year: new Date().getFullYear().toString(),
        },
      ],
    }));
  };

  const handleAddCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: Date.now(),
          title: '',
          issuer: '',
          year: new Date().getFullYear().toString(),
        },
      ],
    }));
  };

  const handleAddLanguage = () => {
    setFormData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        {
          id: Date.now(),
          language: '',
          proficiency: '',
        },
      ],
    }));
  };

  const handleCertificationChange = (index, field, value) => {
    setFormData((prev) => {
      const newCertifications = [...prev.certifications];
      newCertifications[index] = { ...newCertifications[index], [field]: value };
      return { ...prev, certifications: newCertifications };
    });
  };

  const handleLanguageChange = (index, field, value) => {
    setFormData((prev) => {
      const newLanguages = [...prev.languages];
      newLanguages[index] = { ...newLanguages[index], [field]: value };
      return { ...prev, languages: newLanguages };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('Saving profile data:', formData);
      // Ghi chú: API call sẽ được thêm sau khi backend xong
      // const response = await updateCandidateProfile(formData);
      setTimeout(() => {
        setIsSaving(false);
        navigate(-1);
      }, 1000);
    } catch (error) {
      console.error('Save error:', error);
      setIsSaving(false);
    }
  };

  return (
    <section className={styles['edit-profile-page']}>
      <div className={styles['edit-profile-shell']}>
        <div className={styles['page-header']}>
          <div>
            <p className={styles['breadcrumb']}>Hộ sơ của tôi &gt; Chỉnh sửa hồ sơ</p>
            <h1>Chỉnh sửa hồ sơ</h1>
          </div>
          <div className={styles['header-actions']}>
            <button
              type="button"
              className={styles['btn-cancel']}
              onClick={() => navigate(-1)}
              disabled={isSaving}
            >
              Hủy
            </button>
            <button
              type="button"
              className={styles['btn-save']}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        <div className={styles['edit-layout']}>
          <aside className={styles['left-column']}>
            <div className={styles['avatar-section']}>
              <img
                src={formData.avatar_url || DEFAULT_AVATAR}
                alt={formData.full_name}
                className={styles['avatar']}
              />
              <button type="button" className={styles['btn-change-avatar']}>
                Thay đổi ảnh
              </button>
            </div>

            <div className={styles['info-section']}>
              <h3>Thông tin cơ bản</h3>

              <div className={styles['form-group']}>
                <label htmlFor="full-name">Họ và Tên</label>
                <input
                  id="full-name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="location">Địa điểm</label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Hồ Chí Minh, Việt Nam"
                />
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="+84 90 123 4567"
                />
              </div>
            </div>
          </aside>

          <main className={styles['right-column']}>
            <div className={styles['form-card']}>
              <div className={styles['form-card-head']}>
                <h2>Giới thiệu bản thân</h2>
              </div>

              <div className={styles['editor-toolbar']}>
                <button type="button" title="Bold">
                  <strong>B</strong>
                </button>
                <button type="button" title="Italic">
                  <em>I</em>
                </button>
                <button type="button" title="Underline">
                  <u>U</u>
                </button>
                <div className={styles['divider']} />
                <button type="button" title="Numbered list">
                  1#
                </button>
                <button type="button" title="Bulleted list">
                  •#
                </button>
                <button type="button" title="Insert link">
                  🔗
                </button>
              </div>

              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleInputChange}
                className={styles['textarea']}
                placeholder="Đắm mình vào tiều sử công nghệ web từ việc thiết kế và phát triển các ứng dụng web lớn..."
                rows={8}
              />
            </div>

            <div className={styles['form-card']}>
              <div className={styles['form-card-head']}>
                <h2>Kỹ năng</h2>
                <button type="button" className={styles['btn-add']}>
                  +
                </button>
              </div>

              <div className={styles['skill-input-wrapper']}>
                <input
                  type="text"
                  placeholder="Thêm kỹ năng cần thiết (VD: React, Giao dục...)"
                  className={styles['skill-input']}
                  onKeyPress={handleSkillAdd}
                />
              </div>

              <div className={styles['skill-tags']}>
                {formData.skills.map((skill) => (
                  <div key={skill} className={styles['skill-tag']}>
                    <span>{skill}</span>
                    <button
                      type="button"
                      className={styles['tag-close']}
                      onClick={() => handleSkillRemove(skill)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles['form-card']}>
              <div className={styles['form-card-head']}>
                <h2>Trình độ học vấn</h2>
                <button
                  type="button"
                  className={styles['btn-add']}
                  onClick={handleAddEducation}
                >
                  + Thêm
                </button>
              </div>

              {formData.education.map((edu, index) => (
                <div key={edu.id} className={styles['form-grid-2col']}>
                  <div className={styles['form-group']}>
                    <label>Bằng cấp / Chuyên ngành</label>
                    <input
                      type="text"
                      value={edu.title}
                      onChange={(e) =>
                        handleEducationChange(index, 'title', e.target.value)
                      }
                      placeholder="Cử nhân Công nghệ Thông tin"
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <label>Trường</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) =>
                        handleEducationChange(index, 'school', e.target.value)
                      }
                      placeholder="Đại học Khoa học Tự nhiên TP.HCM"
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <label>Năm kết thúc</label>
                    <input
                      type="number"
                      value={edu.year}
                      onChange={(e) =>
                        handleEducationChange(index, 'year', e.target.value)
                      }
                      placeholder="2018"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles['form-card']}>
              <div className={styles['form-card-head']}>
                <h2>Chứng chỉ / Chứng chỉ quốc tế</h2>
                <button
                  type="button"
                  className={styles['btn-add']}
                  onClick={handleAddCertification}
                >
                  + Thêm
                </button>
              </div>

              {formData.certifications.map((cert, index) => (
                <div key={cert.id} className={styles['form-grid-2col']}>
                  <div className={styles['form-group']}>
                    <label>Tên chứng chỉ</label>
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) =>
                        handleCertificationChange(index, 'title', e.target.value)
                      }
                      placeholder="AWS Certified Solutions Architect - Associat"
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <label>Tổ chức cấp</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) =>
                        handleCertificationChange(index, 'issuer', e.target.value)
                      }
                      placeholder="Amazon Web Services (AWS)"
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <label>Năm cấp</label>
                    <input
                      type="number"
                      value={cert.year}
                      onChange={(e) =>
                        handleCertificationChange(index, 'year', e.target.value)
                      }
                      placeholder="2022"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles['form-card']}>
              <div className={styles['form-card-head']}>
                <h2>Ngoại ngữ</h2>
                <button
                  type="button"
                  className={styles['btn-add']}
                  onClick={handleAddLanguage}
                >
                  + Thêm
                </button>
              </div>

              {formData.languages.map((lang, index) => (
                <div key={lang.id} className={styles['form-grid-2col']}>
                  <div className={styles['form-group']}>
                    <label>Ngôn ngữ</label>
                    <input
                      type="text"
                      value={lang.language}
                      onChange={(e) =>
                        handleLanguageChange(index, 'language', e.target.value)
                      }
                      placeholder="Tiếng Anh"
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <label>Chứng chỉ / Trình độ</label>
                    <input
                      type="text"
                      value={lang.proficiency}
                      onChange={(e) =>
                        handleLanguageChange(index, 'proficiency', e.target.value)
                      }
                      placeholder="IELTS 7.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

export default Chinhsuahosoungvien;
