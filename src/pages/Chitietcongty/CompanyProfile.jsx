import React, { useState } from 'react';
import './CompanyProfile.css';

const CompanyProfile = () => {
  // State quản lý việc thu gọn Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // State quản lý chế độ chỉnh sửa thông tin cơ bản
  const [isEditing, setIsEditing] = useState(false);

  // Dữ liệu mẫu (mock data)
  const [companyData, setCompanyData] = useState({
    name: 'Công ty Cổ phần Công nghệ Baito',
    industry: 'Phần mềm & Công nghệ Thông tin (IT)',
    location: 'Quận Hải Châu, TP. Đà Nẵng',
    avatar: 'https://via.placeholder.com/120?text=Baito',
    foundedYear: '2020',
    employees: '50 - 100 nhân viên',
    headquarters: 'Tòa nhà Software Park, Đà Nẵng',
    taxCode: '0402123456',
    website: 'https://baito.vn',
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="baito-cp-layout">
      {/* 3. THANH SIDEBAR TÙY CHỌN */}
      <aside className={`baito-cp-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="baito-cp-sidebar-header">
          {!isSidebarCollapsed && <h2 className="baito-cp-logo">Baito<span>Link</span></h2>}
          <button className="baito-cp-toggle-btn" onClick={toggleSidebar} title="Thu gọn/Mở rộng">
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="baito-cp-nav">
          <a href="#" className="baito-cp-nav-item active">
            <span className="baito-cp-icon">📊</span>
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </a>
          <a href="#" className="baito-cp-nav-item">
            <span className="baito-cp-icon">👥</span>
            {!isSidebarCollapsed && <span>Team Management</span>}
          </a>
          <a href="#" className="baito-cp-nav-item">
            <span className="baito-cp-icon">🏢</span>
            {!isSidebarCollapsed && <span>Department</span>}
          </a>
        </nav>
      </aside>

      <div className="baito-cp-main-wrapper">
        {/* 2. HEADER ĐIỀU HƯỚNG */}
        <header className="baito-cp-header">
          <div className="baito-cp-search-bar">
            <span className="baito-cp-search-icon">🔍</span>
            <input type="text" placeholder="Tìm kiếm ứng viên, tin tuyển dụng..." />
          </div>
          <div className="baito-cp-header-actions">
            <button className="baito-cp-icon-btn" title="Thông báo">🔔<span className="baito-cp-badge">3</span></button>
            <button className="baito-cp-profile-btn" title="Hồ sơ cá nhân">
              <img src="https://via.placeholder.com/40" alt="Admin" />
            </button>
          </div>
        </header>

        {/* NỘI DUNG CHÍNH (MAIN CONTENT) */}
        <main className="baito-cp-content">
          <div className="baito-cp-page-title">
            <h1>Hồ sơ Công ty</h1>
            <button className="baito-cp-primary-btn" onClick={handleEditToggle}>
              {isEditing ? '💾 Lưu thay đổi' : '✏️ Chỉnh sửa hồ sơ'}
            </button>
          </div>

          <div className="baito-cp-grid">
            {/* CỘT TRÁI: THÔNG TIN CƠ BẢN VÀ CHI TIẾT */}
            <div className="baito-cp-left-col">
              {/* 1 & 4. THÔNG TIN CƠ BẢN (Basic Info) */}
              <section className="baito-cp-card baito-cp-basic-info">
                <div className="baito-cp-avatar-section">
                  <img src={companyData.avatar} alt="Company Avatar" className="baito-cp-avatar" />
                  {isEditing && <button className="baito-cp-change-avt-btn">Đổi Avatar</button>}
                </div>
                <div className="baito-cp-info-form">
                  <div className="baito-cp-form-group">
                    <label>Tên công ty</label>
                    {isEditing ? (
                      <input type="text" name="name" value={companyData.name} onChange={handleChange} />
                    ) : (
                      <h3>{companyData.name}</h3>
                    )}
                  </div>
                  <div className="baito-cp-form-group">
                    <label>Lĩnh vực hoạt động</label>
                    {isEditing ? (
                      <input type="text" name="industry" value={companyData.industry} onChange={handleChange} />
                    ) : (
                      <p>{companyData.industry}</p>
                    )}
                  </div>
                  <div className="baito-cp-form-group">
                    <label>Địa điểm</label>
                    {isEditing ? (
                      <input type="text" name="location" value={companyData.location} onChange={handleChange} />
                    ) : (
                      <p>📍 {companyData.location}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* 5. THÔNG TIN CHI TIẾT (Overview) */}
              <section className="baito-cp-card">
                <h3 className="baito-cp-card-title">Tổng quan doanh nghiệp</h3>
                <ul className="baito-cp-detail-list">
                  <li>
                    <span className="baito-cp-label">Năm thành lập:</span>
                    <span className="baito-cp-value">{companyData.foundedYear}</span>
                  </li>
                  <li>
                    <span className="baito-cp-label">Quy mô nhân sự:</span>
                    <span className="baito-cp-value">{companyData.employees}</span>
                  </li>
                  <li>
                    <span className="baito-cp-label">Trụ sở chính:</span>
                    <span className="baito-cp-value">{companyData.headquarters}</span>
                  </li>
                  <li>
                    <span className="baito-cp-label">Mã số thuế:</span>
                    <span className="baito-cp-value">{companyData.taxCode}</span>
                  </li>
                  <li>
                    <span className="baito-cp-label">Website:</span>
                    <span className="baito-cp-value"><a href={companyData.website} target="_blank" rel="noreferrer">{companyData.website}</a></span>
                  </li>
                </ul>
              </section>
            </div>

            {/* CỘT PHẢI: DỰ ÁN VÀ LIÊN HỆ */}
            <div className="baito-cp-right-col">
              {/* 6. KEY CONTACT (Người liên hệ chính) */}
              <section className="baito-cp-card baito-cp-contact-card">
                <h3 className="baito-cp-card-title">Key Contact (Đại diện)</h3>
                <div className="baito-cp-contact-user">
                  <div className="baito-cp-contact-avt">CEO</div>
                  <div className="baito-cp-contact-info">
                    <h4>Nguyễn Văn A</h4>
                    <p>Giám đốc điều hành (CEO)</p>
                    <p className="baito-cp-email">✉️ a.nguyen@baito.vn</p>
                  </div>
                </div>
              </section>

              {/* 6. DỰ ÁN / SẢN PHẨM TIÊU BIỂU */}
              <section className="baito-cp-card">
                <div className="baito-cp-card-header-flex">
                  <h3 className="baito-cp-card-title">Dự án & Sản phẩm</h3>
                  {isEditing && <button className="baito-cp-text-btn">+ Thêm mới</button>}
                </div>
                <div className="baito-cp-project-list">
                  <div className="baito-cp-project-item">
                    <div className="baito-cp-project-icon">🚀</div>
                    <div className="baito-cp-project-detail">
                      <h4>Hệ thống Baito Link</h4>
                      <p>Nền tảng kết nối nhà tuyển dụng và ứng viên IT.</p>
                    </div>
                  </div>
                  <div className="baito-cp-project-item">
                    <div className="baito-cp-project-icon">🛒</div>
                    <div className="baito-cp-project-detail">
                      <h4>E-Commerce Dashboard</h4>
                      <p>Hệ thống quản lý bán hàng đa kênh cho doanh nghiệp.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyProfile;