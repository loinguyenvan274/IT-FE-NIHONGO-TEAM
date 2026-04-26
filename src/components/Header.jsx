import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, buildInDevelopmentPath, buildRegisterPath, REGISTER_ROLES } from '../constants/routes';
import { logoutUser, setStoredUserRole } from '../services/api';
import './Header.css';

const ROLE_OPTIONS = [
  { value: 'guest', label: 'Khách' },
  { value: 'candidate', label: 'Ứng viên' },
  { value: 'employer', label: 'Nhà tuyển dụng' },
];

const NAV_BY_ROLE = {
  guest: [
    { label: 'Danh sách công việc', to: ROUTES.RECRUITMENT_LIST },
    { label: 'Tìm việc', to: ROUTES.JOB_SEARCH },
  ],
  candidate: [
    { label: 'Việc làm / Tìm việc', to: ROUTES.JOB_SEARCH },
    { label: 'Matching', to: ROUTES.MATCHING },
    { label: 'Lịch sử công việc', to: buildInDevelopmentPath('job-history') },
  ],
  employer: [
    { label: 'Dashboard / Quản lý việc làm', to: ROUTES.RECRUITMENT_LIST },
    { label: 'Quản lý ứng viên', to: ROUTES.CANDIDATES },
    { label: 'Tìm ứng viên / Matching', to: ROUTES.MATCHING },
  ],
};

const TITLE_BY_ROLE = {
  guest: 'Trang chủ',
  candidate: 'Trang chủ Nhân viên',
  employer: 'Trang chủ Công ty',
};

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 4h16v10H7l-3 3V4z" fill="currentColor" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 3a5 5 0 0 0-5 5v4l-2 2v1h14v-1l-2-2V8a5 5 0 0 0-5-5zm0 18a3 3 0 0 0 2.83-2H9.17A3 3 0 0 0 12 21z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Header({ role, onRoleChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    setShowRegisterMenu(false);
    setShowAccountMenu(false);
  }, [role]);

  const navItems = useMemo(() => NAV_BY_ROLE[role] ?? NAV_BY_ROLE.guest, [role]);
  const roleTitle = TITLE_BY_ROLE[role] ?? TITLE_BY_ROLE.guest;

  async function handleLogout() {
    await logoutUser();
    setStoredUserRole('guest');
    onRoleChange('guest');
    navigate(ROUTES.JOB_SEARCH);
  }

  const accountMenuItems =
    role === 'candidate'
      ? [
          { label: 'Hồ sơ của tôi', to: ROUTES.CANDIDATE_PROFILE },
          { label: 'Điều chỉnh thông tin cá nhân', to: ROUTES.CANDIDATE_EDIT },
          { label: 'Đăng xuất', to: ROUTES.JOB_SEARCH, onClick: handleLogout },
        ]
      : [
          { label: 'Hồ sơ công ty', to: buildInDevelopmentPath('profile') },
          { label: 'Chỉnh sửa thông tin', to: buildInDevelopmentPath('settings') },
          { label: 'Đăng xuất', to: ROUTES.JOB_SEARCH, onClick: handleLogout },
        ];

  return (
    <header className="app-header">
      <div className="header-inner">
        <button type="button" className="logo-button" onClick={() => navigate(ROUTES.JOB_SEARCH)}>
          <span className="logo-mark">IT</span>
          <span className="logo-text">{roleTitle}</span>
        </button>

        <div className="role-switcher">
          <label htmlFor="role-select" className="role-label">
            Chế độ xem
          </label>
          <select
            id="role-select"
            value={role}
            onChange={(event) => {
              onRoleChange(event.target.value);
              setStoredUserRole(event.target.value);
            }}
            className="role-select"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <nav className="header-nav" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`nav-item-button ${location.pathname === item.to ? 'is-active' : ''}`}
              onClick={() => navigate(item.to)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          {role === 'guest' ? (
            <>
              <button
                type="button"
                className="ghost-action-button"
                onClick={() => navigate(ROUTES.AUTH_LOGIN)}
              >
                Đăng nhập
              </button>

              <div className="menu-container">
                <button
                  type="button"
                  className="primary-action-button"
                  onClick={() => {
                    setShowAccountMenu(false);
                    setShowRegisterMenu((prev) => !prev);
                  }}
                  aria-expanded={showRegisterMenu}
                >
                  Đăng ký
                </button>
                {showRegisterMenu ? (
                  <div className="dropdown-menu">
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setShowRegisterMenu(false);
                        navigate(buildRegisterPath(REGISTER_ROLES.CANDIDATE));
                      }}
                    >
                      Đăng ký Ứng viên
                    </button>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setShowRegisterMenu(false);
                        navigate(buildRegisterPath(REGISTER_ROLES.EMPLOYER));
                      }}
                    >
                      Đăng ký Nhà tuyển dụng
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              {role === 'employer' ? (
                <button
                  type="button"
                  className="cta-button"
                  onClick={() => navigate(ROUTES.JOB_POST)}
                >
                  + Đăng tin tuyển dụng
                </button>
              ) : null}

              <button
                type="button"
                className="icon-button"
                aria-label="Tin nhắn"
                onClick={() => navigate(ROUTES.CHAT)}
              >
                <ChatIcon />
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label="Thông báo"
                onClick={() => navigate(buildInDevelopmentPath('notifications'))}
              >
                <BellIcon />
              </button>

              <div className="menu-container">
                <button
                  type="button"
                  className="account-button"
                  onClick={() => {
                    setShowRegisterMenu(false);
                    setShowAccountMenu((prev) => !prev);
                  }}
                  aria-expanded={showAccountMenu}
                >
                  <span className="avatar-circle">{role === 'candidate' ? 'UV' : 'CT'}</span>
                  <span>{role === 'candidate' ? 'Tài khoản' : 'Công ty'}</span>
                </button>
                {showAccountMenu ? (
                  <div className="dropdown-menu account-menu">
                    {accountMenuItems.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className="dropdown-item"
                        onClick={async () => {
                          setShowAccountMenu(false);
                          if (item.onClick) {
                            await item.onClick();
                          }
                          navigate(item.to);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
