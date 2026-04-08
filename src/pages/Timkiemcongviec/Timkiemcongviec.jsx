const navItems = ['Việc làm', 'Doanh nghiệp', 'Về chúng tôi'];

const jobSuggestions = [
  {
    title: 'Giám đốc Chiến lược Cấp cao',
    description:
      'Dẫn dắt tầm nhìn sản phẩm và phối hợp với các nhóm để mở rộng tác động kinh doanh trong toàn tổ chức.',
    salary: '$180k - $240k',
    badges: ['Toàn thời gian', 'Từ xa'],
    status: 'Sắp hết hạn',
  },
  {
    title: 'Trưởng phòng Vận hành Sáng tạo',
    description:
      'Điều phối các nhóm sáng tạo, tối ưu quy trình và giữ nhịp vận hành cho các chiến dịch lớn.',
    salary: '$140k - $190k',
    badges: ['Toàn thời gian'],
    status: null,
  },
  {
    title: 'Phó Chủ tịch Đổi mới Sản phẩm',
    description:
      'Tạo các hướng đi mới cho sản phẩm, kết nối kỹ thuật và chiến lược để tăng tốc tăng trưởng.',
    salary: '$300k+ cố định',
    badges: ['Hợp đồng', 'Linh hoạt'],
    status: 'Mới',
  },
];

const quickFilters = ['Tìm kiếm việc làm, công ty...', 'Địa điểm mong muốn', 'Mức lương mong muốn'];

const footerLinks = ['Chính sách bảo mật', 'Điều khoản dịch vụ', 'Liên hệ', 'Cài đặt Cookie'];

function JobCard({ job }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="job-avatar" aria-hidden="true">
          <span>◻</span>
        </div>
        {job.status ? <span className={`job-status ${job.status === 'Mới' ? 'is-new' : ''}`}>{job.status}</span> : null}
      </div>

      <h3>{job.title}</h3>
      <p>{job.description}</p>

      <div className="job-tags">
        {job.badges.map((badge) => (
          <span key={badge}>{badge}</span>
        ))}
      </div>

      <div className="job-meta">
        <strong>{job.salary}</strong>
      </div>
    </article>
  );
}

function Timkiemcongviec() {
  return (
    <div className="job-search-page">
      <header className="job-topbar">
        <div className="job-brand">
          <strong>Executive Curator</strong>
        </div>

        <nav className="job-nav" aria-label="Điều hướng chính">
          {navItems.map((item, index) => (
            <a className={`job-nav-link ${index === 0 ? 'is-active' : ''}`} href="#" key={item}>
              {item}
            </a>
          ))}
        </nav>

        <div className="job-actions">
          <div className="job-lang" aria-label="Chọn ngôn ngữ">
            <button type="button">EN</button>
            <button className="is-active" type="button">
              VN
            </button>
            <button type="button">JP</button>
          </div>
          <a className="job-login" href="#">
            Đăng nhập
          </a>
        </div>
      </header>

      <main className="job-page">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Dành riêng cho bạn</p>
            <h1>Định hình bước tiến sự nghiệp tiếp theo của bạn</h1>
            <p className="hero-text">
              Tiếp cận những cơ hội đặc quyền tại các công ty dẫn đầu ngành, được tuyển chọn kỹ lưỡng
              dành cho các chuyên gia ưu tú.
            </p>

            <div className="search-panel" aria-label="Thanh tìm kiếm việc làm">
              <div className="search-inputs">
                {quickFilters.map((filter, index) => (
                  <label className="search-field" key={filter}>
                    <span className="search-icon" aria-hidden="true">
                      {index === 0 ? '⌕' : index === 1 ? '⌖' : '◫'}
                    </span>
                    <input type="text" defaultValue={index === 0 ? '' : filter} placeholder={index === 0 ? filter : ''} />
                  </label>
                ))}
              </div>

              <div className="search-actions">
                <button className="clear-link" type="button">
                  Xóa
                </button>
                <button className="search-button" type="button">
                  <span aria-hidden="true">⌕</span>
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual-overlay" />
          </div>
        </section>

        <section className="job-section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Dành riêng cho bạn</p>
              <h2>Gợi ý công việc</h2>
            </div>
            <a className="view-all-link" href="#">
              Xem tất cả danh sách <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="job-grid">
            {jobSuggestions.map((job) => (
              <JobCard job={job} key={job.title} />
            ))}
          </div>
        </section>

        <section className="cta-band">
          <p className="eyebrow cta-eyebrow">Trải nghiệm sự hỗ trợ cá nhân hóa</p>
          <h2>Tham gia mạng lưới tài năng của chúng tôi</h2>
          <p>
            Tham gia mạng lưới tài năng của chúng tôi để nhận các gợi ý việc làm phù hợp với định
            hướng nghề nghiệp của bạn.
          </p>

          <div className="cta-actions">
            <button className="primary-pill" type="button">
              Tạo hồ sơ
            </button>
            <button className="secondary-pill" type="button">
              Tìm hiểu thêm
            </button>
          </div>
        </section>
      </main>

      <footer className="job-footer">
        <div>
          <strong>Executive Curator</strong>
          <span>© 2024 Tuyển dụng Executive Curator. Bảo lưu mọi quyền.</span>
        </div>

        <nav className="footer-links" aria-label="Liên kết chân trang">
          {footerLinks.map((item) => (
            <a href="#" key={item}>
              {item}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}

export default Timkiemcongviec;