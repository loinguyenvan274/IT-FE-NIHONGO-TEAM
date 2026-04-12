import { useEffect, useMemo, useState } from 'react';
import './Header.css';

const ROLE_OPTIONS = [
  { value: 'guest', label: 'Khách' },
  { value: 'candidate', label: 'Ứng viên' },
  { value: 'employer', label: 'Nhà tuyển dụng' },
];

const NAV_BY_ROLE = {
  guest: ['Danh sách công việc', 'Tìm việc'],
  candidate: ['Việc làm / Tìm việc', 'Matching', 'Lịch sử công việc'],
  employer: ['Dashboard / Quản lý việc làm', 'Quản lý ứng viên', 'Tìm ứng viên / Matching'],
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
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    setShowRegisterMenu(false);
    setShowAccountMenu(false);
  }, [role]);

  const navItems = useMemo(() => NAV_BY_ROLE[role] ?? NAV_BY_ROLE.guest, [role]);
  const roleTitle = TITLE_BY_ROLE[role] ?? TITLE_BY_ROLE.guest;

  const accountMenuItems =
    role === 'candidate'
      ? ['Hồ sơ của tôi', 'Điều chỉnh thông tin cá nhân', 'Đăng xuất']
      : ['Hồ sơ công ty', 'Chỉnh sửa thông tin', 'Đăng xuất'];

  return (
    <header className="app-header">
      <div className="header-inner">
        <button type="button" className="logo-button">
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
            onChange={(event) => onRoleChange(event.target.value)}
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
            <button key={item} type="button" className="nav-item-button">
              {item}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          {role === 'guest' ? (
            <>
              <button type="button" className="ghost-action-button">
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
                    <button type="button" className="dropdown-item">
                      Đăng ký Ứng viên
                    </button>
                    <button type="button" className="dropdown-item">
                      Đăng ký Nhà tuyển dụng
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              {role === 'employer' ? (
                <button type="button" className="cta-button">
                  + Đăng tin tuyển dụng
                </button>
              ) : null}

              <button type="button" className="icon-button" aria-label="Tin nhắn">
                <ChatIcon />
              </button>
              <button type="button" className="icon-button" aria-label="Thông báo">
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
                      <button key={item} type="button" className="dropdown-item">
                        {item}
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
