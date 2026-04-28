import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { REGISTER_ROLES, ROUTES } from '../../constants/routes';
import {
  createCompanyProfile,
  fetchCurrentUser,
  fetchMyCandidateProfiles,
  loginUser,
  mapBeRoleToFeRole,
  updateCandidateProfile,
  registerUser,
  setStoredUserRole,
} from '../../services/api';
import styles from './AuthRegister.module.css';

const CANDIDATE_DEFAULTS = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  location: '',
  skillInput: '',
  gioi_thieu: '',
  educationInput: '',
  certificationInput: '',
  languageInput: '',
  projectInput: '',
};

const EMPLOYER_DEFAULTS = {
  companyName: '',
  email: '',
  password: '',
  confirmPassword: '',
  industry: '',
  representative: '',
  address: '',
};

const LOCATION_OPTIONS = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng'];
const INDUSTRY_OPTIONS = ['Công nghệ thông tin', 'Tài chính - Ngân hàng', 'Sản xuất - Công nghiệp', 'Thương mại điện tử'];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9\s+()-]{9,15}$/.test(phone.trim());
}

export default function AuthRegister({ onAuthSuccess = () => {} }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [candidateData, setCandidateData] = useState(CANDIDATE_DEFAULTS);
  const [candidateSkills, setCandidateSkills] = useState(['Chiến lược sản phẩm', 'React.js']);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employerData, setEmployerData] = useState(EMPLOYER_DEFAULTS);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const activeRole = useMemo(() => {
    return searchParams.get('role') === REGISTER_ROLES.EMPLOYER ? REGISTER_ROLES.EMPLOYER : REGISTER_ROLES.CANDIDATE;
  }, [searchParams]);

  function switchRole(role) {
    setSearchParams({ role }, { replace: true });
    setErrors({});
  }

  function onCandidateChange(event) {
    const { name, value } = event.target;
    setCandidateData((prev) => ({ ...prev, [name]: value }));
    setSubmitError('');
    setErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function onEmployerChange(event) {
    const { name, value } = event.target;
    setEmployerData((prev) => ({ ...prev, [name]: value }));
    setSubmitError('');
    setErrors((prev) => {
      if (!prev[name]) {
        return prev;
      }
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function addSkill() {
    const normalizedSkill = candidateData.skillInput.trim();
    if (!normalizedSkill) {
      return;
    }

    if (candidateSkills.includes(normalizedSkill)) {
      return;
    }

    setCandidateSkills((prev) => [...prev, normalizedSkill]);
    setCandidateData((prev) => ({ ...prev, skillInput: '' }));
  }

  function removeSkill(skill) {
    setCandidateSkills((prev) => prev.filter((item) => item !== skill));
  }

  function addEducation() {
    if (candidateData.educationInput.trim()) {
      setEducation((prev) => [...prev, { id: Date.now(), truong: '', nganh: candidateData.educationInput.trim(), nam_tot_nghiep: new Date().getFullYear() }]);
      setCandidateData((prev) => ({ ...prev, educationInput: '' }));
    }
  }

  function updateEducation(index, field, value) {
    setEducation((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeEducation(index) {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  }

  function addCertification() {
    if (candidateData.certificationInput.trim()) {
      setCertifications((prev) => [...prev, { id: Date.now(), ten_chung_chi: candidateData.certificationInput.trim(), nha_cap: '', nam_cap: new Date().getFullYear() }]);
      setCandidateData((prev) => ({ ...prev, certificationInput: '' }));
    }
  }

  function updateCertification(index, field, value) {
    setCertifications((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeCertification(index) {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  }

  function addLanguage() {
    if (candidateData.languageInput.trim()) {
      setLanguages((prev) => [...prev, { id: Date.now(), ten_ngoai_ngu: candidateData.languageInput.trim(), tro_cap: '' }]);
      setCandidateData((prev) => ({ ...prev, languageInput: '' }));
    }
  }

  function updateLanguage(index, field, value) {
    setLanguages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeLanguage(index) {
    setLanguages((prev) => prev.filter((_, i) => i !== index));
  }

  function addProject() {
    if (candidateData.projectInput.trim()) {
      setProjects((prev) => [...prev, { id: Date.now(), ten_du_an: candidateData.projectInput.trim(), mo_ta: '', cong_nghe: '' }]);
      setCandidateData((prev) => ({ ...prev, projectInput: '' }));
    }
  }

  function updateProject(index, field, value) {
    setProjects((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeProject(index) {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  }

  function validateCandidate() {
    const nextErrors = {};

    if (!candidateData.fullName.trim()) {
      nextErrors.fullName = 'Vui lòng nhập họ và tên.';
    }

    if (!candidateData.email.trim()) {
      nextErrors.email = 'Vui lòng nhập email.';
    } else if (!isValidEmail(candidateData.email.trim())) {
      nextErrors.email = 'Email chưa đúng định dạng.';
    }

    if (!candidateData.phone.trim()) {
      nextErrors.phone = 'Vui lòng nhập số điện thoại.';
    } else if (!isValidPhone(candidateData.phone)) {
      nextErrors.phone = 'Số điện thoại chưa đúng định dạng.';
    }

    if (!candidateData.password.trim()) {
      nextErrors.password = 'Vui lòng nhập mật khẩu.';
    } else if (candidateData.password.trim().length < 6) {
      nextErrors.password = 'Mật khẩu cần tối thiểu 6 ký tự.';
    }

    if (!candidateData.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Vui lòng nhập xác nhận mật khẩu.';
    } else if (candidateData.confirmPassword !== candidateData.password) {
      nextErrors.confirmPassword = 'Mật khẩu xác nhận chưa trùng khớp.';
    }

    if (!candidateData.location.trim()) {
      nextErrors.location = 'Vui lòng chọn địa điểm.';
    }

    if (candidateSkills.length === 0) {
      nextErrors.skills = 'Vui lòng thêm ít nhất một kỹ năng.';
    }

    return nextErrors;
  }

  function validateEmployer() {
    const nextErrors = {};

    if (!employerData.companyName.trim()) {
      nextErrors.companyName = 'Vui lòng nhập tên công ty.';
    }

    if (!employerData.email.trim()) {
      nextErrors.email = 'Vui lòng nhập email đăng ký.';
    } else if (!isValidEmail(employerData.email.trim())) {
      nextErrors.email = 'Email chưa đúng định dạng.';
    }

    if (!employerData.password.trim()) {
      nextErrors.password = 'Vui lòng nhập mật khẩu.';
    } else if (employerData.password.trim().length < 6) {
      nextErrors.password = 'Mật khẩu cần tối thiểu 6 ký tự.';
    }

    if (!employerData.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Vui lòng nhập xác nhận mật khẩu.';
    } else if (employerData.confirmPassword !== employerData.password) {
      nextErrors.confirmPassword = 'Mật khẩu xác nhận chưa trùng khớp.';
    }

    if (!employerData.industry.trim()) {
      nextErrors.industry = 'Vui lòng chọn lĩnh vực kinh doanh.';
    }

    if (!employerData.representative.trim()) {
      nextErrors.representative = 'Vui lòng nhập người đại diện.';
    }

    if (!employerData.address.trim()) {
      nextErrors.address = 'Vui lòng nhập địa chỉ trụ sở.';
    }

    return nextErrors;
  }

  async function onSubmit(event) {
    event.preventDefault();

    const nextErrors =
      activeRole === REGISTER_ROLES.CANDIDATE ? validateCandidate() : validateEmployer();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const role = activeRole === REGISTER_ROLES.CANDIDATE ? 'candidate' : 'employer';
      const registerEmail =
        activeRole === REGISTER_ROLES.CANDIDATE ? candidateData.email.trim() : employerData.email.trim();
      const registerPassword =
        activeRole === REGISTER_ROLES.CANDIDATE ? candidateData.password : employerData.password;

      const profileData = activeRole === REGISTER_ROLES.CANDIDATE ? {
        ho_ten: candidateData.fullName.trim(),
        gioi_thieu: candidateData.gioi_thieu.trim(),
        hoc_van: education.map(e => ({ truong: e.truong, nganh: e.nganh, nam_tot_nghiep: parseInt(e.nam_tot_nghiep) })),
        chung_chi: certifications.map(c => ({ ten_chung_chi: c.ten_chung_chi, nha_cap: c.nha_cap, nam_cap: parseInt(c.nam_cap) })),
        ngoai_ngu: languages.map(l => ({ ten_ngoai_ngu: l.ten_ngoai_ngu, tro_cap: l.tro_cap })),
        du_an: projects.map(p => ({ ten_du_an: p.ten_du_an, mo_ta: p.mo_ta, cong_nghe: p.cong_nghe })),
      } : {};

      await registerUser({
        email: registerEmail,
        password: registerPassword,
        role,
        ...(activeRole === REGISTER_ROLES.CANDIDATE && { profileData }),
      });

      await loginUser({
        email: registerEmail,
        password: registerPassword,
      });

      const me = await fetchCurrentUser();

      if (activeRole === REGISTER_ROLES.CANDIDATE) {
        const candidateProfiles = await fetchMyCandidateProfiles();
        const candidateProfileId = candidateProfiles[0]?.ung_vien;

        if (candidateProfileId) {
          await updateCandidateProfile(candidateProfileId, {
            so_dien_thoai: candidateData.phone.trim(),
            ky_nang: candidateSkills.join(', '),
            location: candidateData.location.trim(),
            vi_tri_mong_muon: candidateSkills[0] || '',
          });
        }
      } else {
        await createCompanyProfile({
          ten_cong_ty: employerData.companyName.trim(),
          linh_vuc: employerData.industry.trim(),
          lien_he: employerData.representative.trim(),
          dia_chi: employerData.address.trim(),
        });
      }

      const nextRole = mapBeRoleToFeRole(me?.vai_tro);
      setStoredUserRole(nextRole);
      onAuthSuccess(nextRole);

      navigate(ROUTES.JOB_SEARCH);
    } catch (error) {
      setSubmitError(error?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.card}>
          <div className={styles.tabSwitch}>
            <button
              type="button"
              className={activeRole === REGISTER_ROLES.CANDIDATE ? styles.tabActive : ''}
              onClick={() => switchRole(REGISTER_ROLES.CANDIDATE)}
            >
              Ứng viên
            </button>
            <button
              type="button"
              className={activeRole === REGISTER_ROLES.EMPLOYER ? styles.tabActive : ''}
              onClick={() => switchRole(REGISTER_ROLES.EMPLOYER)}
            >
              Doanh nghiệp
            </button>
          </div>

          <h1>
            {activeRole === REGISTER_ROLES.CANDIDATE ? 'Gia nhập TalentFlow' : 'Đăng ký Doanh nghiệp'}
          </h1>
          <p className={styles.subtitle}>
            {activeRole === REGISTER_ROLES.CANDIDATE
              ? 'Bắt đầu hành trình sự nghiệp chuyên nghiệp với công nghệ AI kết nối hàng đầu.'
              : 'Khám phá nguồn nhân lực chất lượng cao cho tổ chức của bạn.'}
          </p>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            {activeRole === REGISTER_ROLES.CANDIDATE ? (
              <>
                <h2>01 Thông tin liên hệ</h2>
                <label>
                  Họ và tên
                  <input name="fullName" value={candidateData.fullName} onChange={onCandidateChange} placeholder="Nguyễn Văn A" />
                  {errors.fullName ? <span className={styles.error}>{errors.fullName}</span> : null}
                </label>

                <div className={styles.twoCols}>
                  <label>
                    Email
                    <input name="email" value={candidateData.email} onChange={onCandidateChange} placeholder="vidu@email.com" />
                    {errors.email ? <span className={styles.error}>{errors.email}</span> : null}
                  </label>

                  <label>
                    Số điện thoại
                    <input name="phone" value={candidateData.phone} onChange={onCandidateChange} placeholder="090 000 0000" />
                    {errors.phone ? <span className={styles.error}>{errors.phone}</span> : null}
                  </label>
                </div>

                <h2>02 Bảo mật tài khoản</h2>
                <div className={styles.twoCols}>
                  <label>
                    Mật khẩu
                    <input
                      type="password"
                      name="password"
                      value={candidateData.password}
                      onChange={onCandidateChange}
                      placeholder="••••••••"
                    />
                    {errors.password ? <span className={styles.error}>{errors.password}</span> : null}
                  </label>

                  <label>
                    Xác nhận mật khẩu
                    <input
                      type="password"
                      name="confirmPassword"
                      value={candidateData.confirmPassword}
                      onChange={onCandidateChange}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword ? <span className={styles.error}>{errors.confirmPassword}</span> : null}
                  </label>
                </div>

                <h2>03 Chi tiết chuyên môn</h2>
                <label>
                  Địa điểm
                  <select name="location" value={candidateData.location} onChange={onCandidateChange}>
                    <option value="">Chọn thành phố hoặc tỉnh thành</option>
                    {LOCATION_OPTIONS.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  {errors.location ? <span className={styles.error}>{errors.location}</span> : null}
                </label>

                <label>
                  Kỹ năng chuyên môn
                  <div className={styles.skillRow}>
                    <input
                      name="skillInput"
                      value={candidateData.skillInput}
                      onChange={onCandidateChange}
                      placeholder="vd: UX Design"
                    />
                    <button type="button" className={styles.addSkillButton} onClick={addSkill}>
                      Thêm
                    </button>
                  </div>
                </label>

                <div className={styles.skillChips}>
                  {candidateSkills.map((skill) => (
                    <button key={skill} type="button" className={styles.skillChip} onClick={() => removeSkill(skill)}>
                      {skill} ×
                    </button>
                  ))}
                </div>
                {errors.skills ? <span className={styles.error}>{errors.skills}</span> : null}

                <h2>04 Thông tin chuyên môn nâng cao (Tùy chọn)</h2>

                <label>
                  Giới thiệu về bạn
                  <textarea
                    name="gioi_thieu"
                    value={candidateData.gioi_thieu}
                    onChange={onCandidateChange}
                    placeholder="Mô tả về kinh nghiệm và sở thích làm việc của bạn..."
                    rows="3"
                  />
                </label>

                <label>
                  Học vấn
                  <div className={styles.skillRow}>
                    <input
                      name="educationInput"
                      value={candidateData.educationInput}
                      onChange={onCandidateChange}
                      placeholder="vd: Đại học Bách Khoa"
                    />
                    <button type="button" className={styles.addSkillButton} onClick={addEducation}>
                      Thêm
                    </button>
                  </div>
                </label>
                {education.length > 0 && (
                  <div className={styles.itemsList}>
                    {education.map((edu, index) => (
                      <div key={edu.id} className={styles.itemCard}>
                        <input
                          type="text"
                          placeholder="Tên trường"
                          value={edu.truong}
                          onChange={(e) => updateEducation(index, 'truong', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Ngành học"
                          value={edu.nganh}
                          onChange={(e) => updateEducation(index, 'nganh', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Năm tốt nghiệp"
                          value={edu.nam_tot_nghiep}
                          onChange={(e) => updateEducation(index, 'nam_tot_nghiep', e.target.value)}
                        />
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeEducation(index)}
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label>
                  Chứng chỉ
                  <div className={styles.skillRow}>
                    <input
                      name="certificationInput"
                      value={candidateData.certificationInput}
                      onChange={onCandidateChange}
                      placeholder="vd: AWS Certified Solutions Architect"
                    />
                    <button type="button" className={styles.addSkillButton} onClick={addCertification}>
                      Thêm
                    </button>
                  </div>
                </label>
                {certifications.length > 0 && (
                  <div className={styles.itemsList}>
                    {certifications.map((cert, index) => (
                      <div key={cert.id} className={styles.itemCard}>
                        <input
                          type="text"
                          placeholder="Tên chứng chỉ"
                          value={cert.ten_chung_chi}
                          onChange={(e) => updateCertification(index, 'ten_chung_chi', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Nhà cấp"
                          value={cert.nha_cap}
                          onChange={(e) => updateCertification(index, 'nha_cap', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Năm cấp"
                          value={cert.nam_cap}
                          onChange={(e) => updateCertification(index, 'nam_cap', e.target.value)}
                        />
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeCertification(index)}
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label>
                  Ngoại ngữ
                  <div className={styles.skillRow}>
                    <input
                      name="languageInput"
                      value={candidateData.languageInput}
                      onChange={onCandidateChange}
                      placeholder="vd: Tiếng Anh"
                    />
                    <button type="button" className={styles.addSkillButton} onClick={addLanguage}>
                      Thêm
                    </button>
                  </div>
                </label>
                {languages.length > 0 && (
                  <div className={styles.itemsList}>
                    {languages.map((lang, index) => (
                      <div key={lang.id} className={styles.itemCard}>
                        <input
                          type="text"
                          placeholder="Tên ngoại ngữ"
                          value={lang.ten_ngoai_ngu}
                          onChange={(e) => updateLanguage(index, 'ten_ngoai_ngu', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Trình độ (vd: B2, TOEIC 800)"
                          value={lang.tro_cap}
                          onChange={(e) => updateLanguage(index, 'tro_cap', e.target.value)}
                        />
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeLanguage(index)}
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label>
                  Dự án
                  <div className={styles.skillRow}>
                    <input
                      name="projectInput"
                      value={candidateData.projectInput}
                      onChange={onCandidateChange}
                      placeholder="vd: Ứng dụng quản lý bán hàng"
                    />
                    <button type="button" className={styles.addSkillButton} onClick={addProject}>
                      Thêm
                    </button>
                  </div>
                </label>
                {projects.length > 0 && (
                  <div className={styles.itemsList}>
                    {projects.map((proj, index) => (
                      <div key={proj.id} className={styles.itemCard}>
                        <input
                          type="text"
                          placeholder="Tên dự án"
                          value={proj.ten_du_an}
                          onChange={(e) => updateProject(index, 'ten_du_an', e.target.value)}
                        />
                        <textarea
                          placeholder="Mô tả dự án"
                          value={proj.mo_ta}
                          onChange={(e) => updateProject(index, 'mo_ta', e.target.value)}
                          rows="2"
                        />
                        <input
                          type="text"
                          placeholder="Công nghệ sử dụng"
                          value={proj.cong_nghe}
                          onChange={(e) => updateProject(index, 'cong_nghe', e.target.value)}
                        />
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeProject(index)}
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <label>
                  Tên công ty
                  <input
                    name="companyName"
                    value={employerData.companyName}
                    onChange={onEmployerChange}
                    placeholder="VD: TalentFlow Global JSC"
                  />
                  {errors.companyName ? <span className={styles.error}>{errors.companyName}</span> : null}
                </label>

                <div className={styles.twoCols}>
                  <label>
                    Email đăng ký
                    <input
                      name="email"
                      value={employerData.email}
                      onChange={onEmployerChange}
                      placeholder="company@email.com"
                    />
                    {errors.email ? <span className={styles.error}>{errors.email}</span> : null}
                  </label>

                  <label>
                    Mật khẩu
                    <input
                      type="password"
                      name="password"
                      value={employerData.password}
                      onChange={onEmployerChange}
                      placeholder="••••••••"
                    />
                    {errors.password ? <span className={styles.error}>{errors.password}</span> : null}
                  </label>
                </div>

                <label>
                  Xác nhận mật khẩu
                  <input
                    type="password"
                    name="confirmPassword"
                    value={employerData.confirmPassword}
                    onChange={onEmployerChange}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword ? <span className={styles.error}>{errors.confirmPassword}</span> : null}
                </label>

                <div className={styles.twoCols}>
                  <label>
                    Lĩnh vực kinh doanh
                    <select name="industry" value={employerData.industry} onChange={onEmployerChange}>
                      <option value="">Chọn lĩnh vực</option>
                      {INDUSTRY_OPTIONS.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    {errors.industry ? <span className={styles.error}>{errors.industry}</span> : null}
                  </label>

                  <label>
                    Người đại diện
                    <input
                      name="representative"
                      value={employerData.representative}
                      onChange={onEmployerChange}
                      placeholder="Họ và tên"
                    />
                    {errors.representative ? <span className={styles.error}>{errors.representative}</span> : null}
                  </label>
                </div>

                <label>
                  Địa chỉ trụ sở
                  <input
                    name="address"
                    value={employerData.address}
                    onChange={onEmployerChange}
                    placeholder="Địa chỉ đầy đủ"
                  />
                  {errors.address ? <span className={styles.error}>{errors.address}</span> : null}
                </label>
              </>
            )}

            <div className={styles.actions}>
              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting
                  ? 'Đang xử lý...'
                  : activeRole === REGISTER_ROLES.CANDIDATE
                    ? 'Đăng ký tài khoản'
                    : 'Tạo Tài Khoản Doanh Nghiệp'}
              </button>
              <button type="button" className={styles.cancelButton} onClick={() => navigate(ROUTES.JOB_SEARCH)}>
                Hủy bỏ
              </button>
            </div>
            {submitError ? <span className={styles.error}>{submitError}</span> : null}
          </form>

          <p className={styles.loginText}>
            Bạn đã có tài khoản?{' '}
            <button type="button" className={styles.loginLink} onClick={() => navigate(ROUTES.AUTH_LOGIN)}>
              Đăng nhập ngay
            </button>
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© 2024 TalentFlow Modern. Bảo lưu mọi quyền.</span>
        <div className={styles.footerLinks}>
          <button type="button">Chính sách Bảo mật</button>
          <button type="button">Điều khoản Dịch vụ</button>
          <button type="button">An ninh</button>
          <button type="button">Cài đặt Cookie</button>
        </div>
      </footer>
    </div>
  );
}
