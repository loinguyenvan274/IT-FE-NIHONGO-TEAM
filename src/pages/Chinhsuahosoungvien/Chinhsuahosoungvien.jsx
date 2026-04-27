import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyCandidateProfiles, updateCandidateProfile, uploadCandidateAvatar } from '../../services/api';
import styles from './Chinhsuahosoungvien.module.css';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=360&q=80';
const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024;

const DEFAULT_FORM_DATA = {
  avatar_url: DEFAULT_AVATAR,
  full_name: '',
  email: '',
  phone_number: '',
  location: '',
  overview: '',
  skills: [],
  education: [],
  certifications: [],
  languages: [],
  projects: [],
};

function Chinhsuahosoungvien() {
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy data từ API khi component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const profiles = await fetchMyCandidateProfiles();
        const profileData = profiles.length > 0 ? profiles[0] : null;

        if (!profileData) {
          throw new Error('Không tìm thấy hồ sơ');
        }

        // Store profile ID for later use in save
        setProfileId(profileData.ung_vien);

        // Map backend response to form data structure
        const mappedEducation = Array.isArray(profileData.hoc_van)
          ? profileData.hoc_van.map((item, idx) => ({
              id: `edu_${idx}`,
              title: item.nganh || '',
              school: item.truong || '',
              year: String(item.nam_tot_nghiep || new Date().getFullYear()),
            }))
          : [];

        const mappedCertifications = Array.isArray(profileData.chung_chi)
          ? profileData.chung_chi.map((item, idx) => ({
              id: `cert_${idx}`,
              title: item.ten_chung_chi || '',
              issuer: item.nha_cap || '',
              year: String(item.nam_cap || new Date().getFullYear()),
            }))
          : [];

        const mappedLanguages = Array.isArray(profileData.ngoai_ngu)
          ? profileData.ngoai_ngu.map((item, idx) => ({
              id: `lang_${idx}`,
              language: item.ten_ngoai_ngu || '',
              proficiency: item.tro_cap || '',
            }))
          : [];

        const mappedProjects = Array.isArray(profileData.du_an)
          ? profileData.du_an.map((item, idx) => ({
              id: `proj_${idx}`,
              name: item.ten_du_an || '',
              description: item.mo_ta || '',
              technologies: item.cong_nghe || '',
              link: item.link || '',
            }))
          : [];

        // Normalize backend response to form data
        setFormData((prev) => ({
          ...prev,
          full_name: profileData.ho_ten || prev.full_name,
          email: profileData.email || prev.email,
          phone_number: profileData.so_dien_thoai || prev.phone_number,
          location: profileData.location || profileData.vi_tri_mong_muon || prev.location,
          overview: profileData.gioi_thieu || prev.overview,
          skills: profileData.ky_nang
            ? String(profileData.ky_nang)
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
            : prev.skills,
          avatar_url: profileData.avatar || profileData.avatar_url || prev.avatar_url,
          education: mappedEducation,
          certifications: mappedCertifications,
          languages: mappedLanguages,
          projects: mappedProjects,
        }));
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải hồ sơ:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (formData.avatar_url && String(formData.avatar_url).startsWith('blob:')) {
        URL.revokeObjectURL(formData.avatar_url);
      }
    };
  }, [formData.avatar_url]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) {
      setError(null);
    }
  };

  const handleOpenAvatarPicker = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleAvatarFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh hợp lệ (jpg, png, webp...).');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_FILE_SIZE) {
      setError('Ảnh đại diện cần nhỏ hơn hoặc bằng 2MB.');
      event.target.value = '';
      return;
    }

    if (formData.avatar_url && String(formData.avatar_url).startsWith('blob:')) {
      URL.revokeObjectURL(formData.avatar_url);
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      avatar_url: localPreviewUrl,
    }));
    setAvatarFile(file);
    setError(null);
    event.target.value = '';
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

  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now(),
          name: '',
          description: '',
          technologies: '',
          link: '',
        },
      ],
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setFormData((prev) => {
      const newProjects = [...prev.projects];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return { ...prev, projects: newProjects };
    });
  };

  const handleRemoveEducation = (id) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  };

  const handleRemoveCertification = (id) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item.id !== id),
    }));
  };

  const handleRemoveLanguage = (id) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((item) => item.id !== id),
    }));
  };

  const handleRemoveProject = (id) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
  };

  const buildBackendPayload = (data) => {
    return {
      ho_ten: data.full_name,
      so_dien_thoai: data.phone_number,
      location: data.location,
      gioi_thieu: data.overview,
      ky_nang: data.skills.join(', '),
      avatar: data.avatar_url,
      hoc_van: data.education.map((edu) => ({
        truong: edu.school,
        nganh: edu.title,
        nam_tot_nghiep: parseInt(edu.year, 10) || new Date().getFullYear(),
      })),
      chung_chi: data.certifications.map((cert) => ({
        ten_chung_chi: cert.title,
        nha_cap: cert.issuer,
        nam_cap: parseInt(cert.year, 10) || new Date().getFullYear(),
      })),
      ngoai_ngu: data.languages.map((lang) => ({
        ten_ngoai_ngu: lang.language,
        tro_cap: lang.proficiency,
      })),
      du_an: data.projects.map((proj) => ({
        ten_du_an: proj.name,
        mo_ta: proj.description,
        cong_nghe: proj.technologies,
        link: proj.link,
      })),
    };
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Use the stored profile ID or fetch it again
      let id = profileId;
      if (!id) {
        const profiles = await fetchMyCandidateProfiles();
        id = Array.isArray(profiles) && profiles.length > 0 ? profiles[0].ung_vien : null;
      }

      if (!id) {
        throw new Error('Không tìm thấy ID hồ sơ');
      }

      let avatarUrlToPersist = formData.avatar_url;
      if (avatarFile) {
        const uploadResponse = await uploadCandidateAvatar(avatarFile);
        avatarUrlToPersist = uploadResponse.avatar_url || avatarUrlToPersist;
      }

      const updatePayload = buildBackendPayload({
        ...formData,
        avatar_url: avatarUrlToPersist,
      });
      await updateCandidateProfile(id, updatePayload);

      if (avatarFile) {
        setAvatarFile(null);
        if (formData.avatar_url && String(formData.avatar_url).startsWith('blob:')) {
          URL.revokeObjectURL(formData.avatar_url);
        }
        setFormData((prev) => ({
          ...prev,
          avatar_url: avatarUrlToPersist,
        }));
      }

      console.log('Profile updated successfully');
      // Quay lại trang profile
      setTimeout(() => {
        setIsSaving(false);
        navigate(-1);
      }, 500);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message);
      setIsSaving(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <section className={styles['edit-profile-page']}>
        <div className={styles['edit-profile-shell']}>
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
            Đang tải hồ sơ...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles['edit-profile-page']}>
      <div className={styles['edit-profile-shell']}>
        {error ? (
          <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', background: '#fef3f2', color: '#b42318' }}>
            {error}
          </div>
        ) : null}

        <div className={styles['page-header']}>
          <div>
            <p className={styles['breadcrumb']}>Hồ sơ của tôi &gt; Chỉnh sửa hồ sơ</p>
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
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className={styles['avatar-file-input']}
                onChange={handleAvatarFileChange}
                aria-label="Chọn ảnh đại diện"
              />
              <button
                type="button"
                className={styles['btn-change-avatar']}
                onClick={handleOpenAvatarPicker}
              >
                Thay đổi ảnh
              </button>
              <p className={styles['avatar-hint']}>Hỗ trợ JPG/PNG/WEBP, tối đa 2MB.</p>
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
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="nguyen.van.a@example.com"
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
                  <button
                    type="button"
                    className={styles['btn-remove']}
                    onClick={() => handleRemoveEducation(edu.id)}
                  >
                    Xóa
                  </button>
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
                  <button
                    type="button"
                    className={styles['btn-remove']}
                    onClick={() => handleRemoveCertification(cert.id)}
                  >
                    Xóa
                  </button>
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
                  <button
                    type="button"
                    className={styles['btn-remove']}
                    onClick={() => handleRemoveLanguage(lang.id)}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>

            <div className={styles['form-card']}>
              <div className={styles['form-card-head']}>
                <h2>Dự án</h2>
                <button
                  type="button"
                  className={styles['btn-add']}
                  onClick={handleAddProject}
                >
                  + Thêm
                </button>
              </div>

              {formData.projects.map((proj, index) => (
                <div key={proj.id} className={styles['form-grid-2col']}>
                  <div className={styles['form-group']}>
                    <label>Tên dự án</label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) =>
                        handleProjectChange(index, 'name', e.target.value)
                      }
                      placeholder="E-commerce Platform"
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <label>Công nghệ sử dụng</label>
                    <input
                      type="text"
                      value={proj.technologies}
                      onChange={(e) =>
                        handleProjectChange(index, 'technologies', e.target.value)
                      }
                      placeholder="Django, React, PostgreSQL"
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <label>Mô tả</label>
                    <textarea
                      value={proj.description}
                      onChange={(e) =>
                        handleProjectChange(index, 'description', e.target.value)
                      }
                      placeholder="Mô tả ngắn về dự án"
                      rows={3}
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <label>Link (GitHub/Demo)</label>
                    <input
                      type="url"
                      value={proj.link}
                      onChange={(e) =>
                        handleProjectChange(index, 'link', e.target.value)
                      }
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                  <button
                    type="button"
                    className={styles['btn-remove']}
                    onClick={() => handleRemoveProject(proj.id)}
                  >
                    Xóa
                  </button>
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
