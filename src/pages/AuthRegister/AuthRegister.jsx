import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { REGISTER_ROLES, ROUTES } from '../../constants/routes';
import {
  createCandidateProfile,
  createCompanyProfile,
  fetchCurrentUser,
  loginUser,
  mapBeRoleToFeRole,
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

      await registerUser({
        email: registerEmail,
        password: registerPassword,
        role,
      });

      await loginUser({
        email: registerEmail,
        password: registerPassword,
      });

      const me = await fetchCurrentUser();

      if (activeRole === REGISTER_ROLES.CANDIDATE) {
        await createCandidateProfile({
          ho_ten: candidateData.fullName.trim(),
          so_dien_thoai: candidateData.phone.trim(),
          ky_nang: candidateSkills.join(', '),
          location: candidateData.location.trim(),
          vi_tri_mong_muon: candidateSkills[0] || null,
        });
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
