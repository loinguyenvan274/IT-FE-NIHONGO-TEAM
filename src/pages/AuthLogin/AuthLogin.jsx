import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES, buildRegisterPath } from '../../constants/routes';
import { fetchCurrentUser, loginUser, mapBeRoleToFeRole, setStoredUserRole } from '../../services/api';
import styles from './AuthLogin.module.css';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AuthLogin({ onAuthSuccess = () => {} }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function onChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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

  function validate() {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Vui lòng nhập email đăng nhập.';
    } else if (!isValidEmail(formData.email.trim())) {
      nextErrors.email = 'Email chưa đúng định dạng.';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Vui lòng nhập mật khẩu.';
    } else if (formData.password.trim().length < 6) {
      nextErrors.password = 'Mật khẩu cần tối thiểu 6 ký tự.';
    }

    return nextErrors;
  }

  async function onSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      const me = await fetchCurrentUser();
      const nextRole = mapBeRoleToFeRole(me?.vai_tro);
      setStoredUserRole(nextRole);
      onAuthSuccess(nextRole);

      navigate(ROUTES.JOB_SEARCH);
    } catch (error) {
      setSubmitError(error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.panel}>
          <div className={styles.headingBlock}>
            <h1>Chào mừng trở lại</h1>
            <p>Tiếp tục hành trình xây dựng sự nghiệp mơ ước của bạn cùng TalentFlow.</p>
          </div>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <label className={styles.fieldLabel} htmlFor="login-email">
              Email đăng nhập
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={onChange}
              placeholder="email@example.com"
              className={errors.email ? styles.inputError : ''}
            />
            {errors.email ? <p className={styles.error}>{errors.email}</p> : null}

            <label className={styles.fieldLabel} htmlFor="login-password">
              Mật khẩu
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={onChange}
              placeholder="••••••••"
              className={errors.password ? styles.inputError : ''}
            />
            {errors.password ? <p className={styles.error}>{errors.password}</p> : null}

            <div className={styles.inlineActions}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={onChange}
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <button type="button" className={styles.linkButton}>
                Quên mật khẩu?
              </button>
            </div>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            {submitError ? <p className={styles.error}>{submitError}</p> : null}
          </form>

          <div className={styles.registerLine}>
            <span>Chưa có tài khoản?</span>
            <button type="button" className={styles.linkButton} onClick={() => navigate(buildRegisterPath())}>
              Đăng ký ngay
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
