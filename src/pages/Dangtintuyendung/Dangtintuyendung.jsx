import './Dangtintuyendung.css';

const overviewStats = [
  { value: '12', label: 'vị trí có thể tạo trong một quy trình', note: 'Tối ưu cho team tuyển dụng' },
  { value: '3 phút', label: 'để hoàn thiện bản nháp đầu tiên', note: 'Tập trung vào phần cốt lõi' },
  { value: '100%', label: 'nội dung bằng tiếng Việt', note: 'Dễ bàn giao cho người mới' },
];

const steps = [
  'Thông tin cơ bản',
  'Mô tả công việc',
  'Yêu cầu ứng viên',
  'Quyền lợi & địa điểm',
];

const skills = ['ReactJS', 'TypeScript', 'UI/UX', 'API'];

const benefits = ['Lương cạnh tranh', 'Làm việc linh hoạt', 'Đào tạo nội bộ', 'Bảo hiểm đầy đủ'];

function SectionTitle({ index, title, subtitle }) {
  return (
    <div className="section-heading">
      <div className="section-index">0{index}</div>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">IT</div>
          <div>
            <strong>IT-FE</strong>
            <span>Dự án ReactJS khởi tạo</span>
          </div>
        </div>

        <nav className="topnav" aria-label="Điều hướng chính">
          <a className="topnav-link is-active" href="#tong-quan">
            Tổng quan
          </a>
          <a className="topnav-link" href="#noi-dung">
            Nội dung
          </a>
          <a className="topnav-link" href="#xac-nhan">
            Xác nhận
          </a>
        </nav>

        <a className="ghost-link" href="#huong-dan">
          Xem hướng dẫn
        </a>
      </header>

      <main className="page">
        <section className="hero-card" id="tong-quan">
          <div className="hero-copy">
            <p className="eyebrow">Bản mặc định cho dự án</p>
            <h1>Đăng tin tuyển dụng rõ ràng, tinh gọn và đồng bộ màu sắc</h1>
            <p className="hero-text">
              Giao diện ban đầu này được dựng để người khác có thể mở lên, chỉnh sửa và chạy ngay.
              Nội dung được viết hoàn toàn bằng tiếng Việt, còn màu sắc và cảm giác thị giác tuân
              theo bộ biến trong <strong>global.css</strong>.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary" type="button">
                Tạo tin mới
              </button>
              <button className="btn btn-secondary" type="button">
                Lưu bản nháp
              </button>
            </div>

            <div className="mini-pills" aria-label="Thông tin nhanh">
              <span>ReactJS</span>
              <span>Vite</span>
              <span>Tiếng Việt</span>
            </div>
          </div>

          <aside className="hero-summary" id="xac-nhan">
            <p className="summary-label">Trạng thái</p>
            <h3>Đã sẵn sàng cho bước nhập nội dung</h3>

            <div className="summary-panel">
              <div>
                <span>Ngôn ngữ</span>
                <strong>Tiếng Việt</strong>
              </div>
              <div>
                <span>Giao diện</span>
                <strong>Trang mặc định</strong>
              </div>
              <div>
                <span>Palette</span>
                <strong>global.css</strong>
              </div>
            </div>

            <div className="summary-progress">
              <div className="summary-progress-bar" />
            </div>
            <p className="summary-note">Hoàn thiện 25% cấu trúc mẫu ban đầu.</p>
          </aside>
        </section>

        <section className="stats-grid" aria-label="Chỉ số tổng quan">
          {overviewStats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <p>{stat.note}</p>
            </article>
          ))}
        </section>

        <section className="content-grid" id="noi-dung">
          <div className="content-column">
            <article className="section-card">
              <SectionTitle
                index={1}
                title="Thông tin cơ bản"
                subtitle="Những dữ liệu nền tảng để tạo một bài đăng tuyển dụng rõ ràng ngay từ đầu."
              />

              <div className="form-grid">
                <label className="field">
                  <span>Tiêu đề vị trí</span>
                  <input type="text" defaultValue="ReactJS Front-end Developer" />
                </label>

                <label className="field">
                  <span>Phòng ban</span>
                  <select defaultValue="product">
                    <option value="product">Sản phẩm</option>
                    <option value="design">Thiết kế</option>
                    <option value="engineering">Kỹ thuật</option>
                  </select>
                </label>

                <label className="field">
                  <span>Cấp bậc</span>
                  <div className="segmented-control" role="group" aria-label="Cấp bậc vị trí">
                    <button className="segment" type="button">
                      Junior
                    </button>
                    <button className="segment is-active" type="button">
                      Middle
                    </button>
                    <button className="segment" type="button">
                      Senior
                    </button>
                  </div>
                </label>

                <label className="field">
                  <span>Số lượng tuyển</span>
                  <input type="number" defaultValue={2} min="1" />
                </label>
              </div>
            </article>

            <article className="section-card">
              <SectionTitle
                index={2}
                title="Mô tả công việc"
                subtitle="Viết ngắn gọn, nhấn vào tác động của vị trí thay vì liệt kê quá nhiều gạch đầu dòng."
              />

              <label className="field">
                <span>Mô tả ngắn</span>
                <textarea
                  rows="4"
                  defaultValue="Bạn sẽ tham gia xây dựng giao diện React cho sản phẩm nội bộ, phối hợp chặt với design và backend để hoàn thiện trải nghiệm người dùng."
                />
              </label>

              <div className="info-panel">
                <div>
                  <strong>Trọng tâm</strong>
                  <p>Rõ vai trò, rõ kỳ vọng, dễ đọc trên di động.</p>
                </div>
                <div>
                  <strong>Giọng văn</strong>
                  <p>Chuyên nghiệp, ngắn gọn, dùng tiếng Việt tự nhiên.</p>
                </div>
              </div>
            </article>

            <article className="section-card">
              <SectionTitle
                index={3}
                title="Yêu cầu và quyền lợi"
                subtitle="Cân bằng giữa điều kiện tuyển dụng và lý do để ứng viên muốn ứng tuyển."
              />

              <div className="dual-list">
                <div>
                  <h3>Kỹ năng cần có</h3>
                  <div className="chip-list">
                    {skills.map((skill) => (
                      <span className="chip" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3>Quyền lợi nổi bật</h3>
                  <ul className="bullet-list">
                    {benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            <article className="section-card">
              <SectionTitle
                index={4}
                title="Địa điểm và lịch làm việc"
                subtitle="Phần cuối cùng để ứng viên biết ngay môi trường và nhịp làm việc của công ty."
              />

              <div className="form-grid form-grid-2">
                <label className="field">
                  <span>Khu vực</span>
                  <input type="text" defaultValue="TP. Hồ Chí Minh" />
                </label>

                <label className="field">
                  <span>Hình thức</span>
                  <select defaultValue="hybrid">
                    <option value="onsite">Làm tại văn phòng</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Từ xa</option>
                  </select>
                </label>
              </div>

              <div className="schedule-card">
                <div>
                  <span>Thời gian làm việc</span>
                  <strong>09:00 - 18:00, Thứ 2 đến Thứ 6</strong>
                </div>
                <div>
                  <span>Chính sách</span>
                  <strong>Linh hoạt 2 ngày làm việc từ xa mỗi tháng</strong>
                </div>
              </div>
            </article>
          </div>

          <aside className="sidebar-card" id="huong-dan">
            <p className="summary-label">Hướng dẫn</p>
            <h3>Cách dùng dự án ngay từ đầu</h3>
            <ol className="steps-list">
              {steps.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>

            <div className="sidebar-footer">
              <strong>Gợi ý</strong>
              <p>
                Nếu muốn đổi màu trang, chỉ cần thay biến trong <strong>global.css</strong> mà không
                cần sửa toàn bộ component.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default HomePage;