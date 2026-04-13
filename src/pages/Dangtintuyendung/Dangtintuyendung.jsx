import { useState } from 'react';
import './Dangtintuyendung.css';

const requirementTags = ['ReactJS', 'HTML/CSS', 'REST API'];

const benefitTags = ['Lương cạnh tranh', 'Thưởng hiệu suất', 'Linh hoạt', 'Bảo hiểm'];

const statusOptions = ['Nháp', 'Đăng'];

function SectionTitle({ index, title }) {
  return (
    <div className="post-section-title">
      <div className="post-section-index">{index}</div>
      <h2>{title}</h2>
    </div>
  );
}

function Field({ label, children, wide = false }) {
  return (
    <label className={`post-field${wide ? ' post-field-wide' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Dangtintuyendung() {
  const [skills, setSkills] = useState(requirementTags);

  const addSkill = () => {
    setSkills((currentSkills) => [...currentSkills, '']);
  };

  const updateSkill = (index, value) => {
    setSkills((currentSkills) => currentSkills.map((skill, skillIndex) => (skillIndex === index ? value : skill)));
  };

  return (
    <main className="recruit-post-page">
      <div className="recruit-post-shell">
        <header className="page-title-block">
          <h1>Đăng tin tuyển dụng</h1>
        </header>

        <form className="recruit-form">
          <section className="recruit-section">
            <SectionTitle index={1} title="Thông tin cơ bản công việc" />
            <div className="form-stack">
              <div className="form-grid form-grid-two">
                <Field label="Tiêu đề công việc">
                  <input type="text" defaultValue="ReactJS Front-end Developer" />
                </Field>
                <Field label="Phòng ban">
                  <input type="text" defaultValue="Sản phẩm" />
                </Field>
                <Field label="Chức danh">
                  <input type="text" defaultValue="Front-end Developer" />
                </Field>
                <Field label="Số lượng tuyển">
                  <input type="number" defaultValue={2} min="1" />
                </Field>
              </div>
            </div>
          </section>

          <section className="recruit-section">
            <SectionTitle index={2} title="Mô tả công việc" />
            <div className="form-stack">
              <Field label="Mô tả công việc" wide>
                <textarea
                  rows="3"
                  defaultValue="Xây dựng giao diện React cho sản phẩm nội bộ, phối hợp với design và backend để hoàn thiện trải nghiệm người dùng."
                />
              </Field>
              <Field label="Nhiệm vụ chính" wide>
                <textarea
                  rows="2"
                  defaultValue="Phát triển tính năng mới, tối ưu giao diện, xử lý dữ liệu từ API và đảm bảo chất lượng hiển thị trên nhiều thiết bị."
                />
              </Field>
            </div>
          </section>

          <section className="recruit-section">
            <SectionTitle index={3} title="Yêu cầu ứng viên" />
            <div className="form-stack">
              <div className="skills-panel">
                <div className="inline-chips" aria-label="Các kỹ năng cần có">
                  {skills.map((skill, index) => (
                    <input
                      key={`skill-${index}`}
                      type="text"
                      value={skill}
                      onChange={(event) => updateSkill(index, event.target.value)}
                      aria-label={`Kỹ năng ${index + 1}`}
                      placeholder="Nhập kỹ năng"
                    />
                  ))}
                </div>
                <button className="skill-add-button" type="button" onClick={addSkill}>
                  <span aria-hidden="true">+</span>
                  <span>Thêm kỹ năng</span>
                </button>
              </div>
              <Field label="Yêu cầu khác" wide>
                <input type="text" defaultValue="Ưu tiên ứng viên có kinh nghiệm làm việc với sản phẩm nội bộ." />
              </Field>
            </div>
          </section>

          <section className="recruit-section">
            <SectionTitle index={4} title="Quyền lợi & chế độ" />
            <div className="form-stack">
              <div className="form-grid form-grid-two">
                <Field label="Mức lương">
                  <input type="text" defaultValue="Thoả thuận" />
                </Field>
                <Field label="Thưởng / Phụ cấp">
                  <input type="text" defaultValue="Thưởng theo dự án" />
                </Field>
                <Field label="Chế độ khác" wide>
                  <input type="text" defaultValue="Đào tạo nội bộ, bảo hiểm đầy đủ, review định kỳ." />
                </Field>
              </div>

              <div className="tag-panel">
                {benefitTags.map((benefit) => (
                  <span className="tag-chip" key={benefit}>
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="recruit-section">
            <SectionTitle index={5} title="Thời gian & địa điểm" />
            <div className="form-stack">
              <div className="form-grid form-grid-three">
                <Field label="Địa điểm làm việc">
                  <input type="text" defaultValue="TP. Hồ Chí Minh" />
                </Field>
                <Field label="Thời gian làm việc">
                  <input type="text" defaultValue="09:00 - 18:00" />
                </Field>
                <Field label="Hình thức">
                  <input type="text" defaultValue="Hybrid" />
                </Field>
              </div>
            </div>
          </section>

          <section className="recruit-section">
            <SectionTitle index={6} title="Thông tin công ty" />
            <div className="form-stack">
              <Field label="Tự động lấy từ hồ sơ công ty" wide>
                <input type="text" defaultValue="Công ty công nghệ nội bộ" />
              </Field>
              <Field label="Giới thiệu ngắn" wide>
                <textarea
                  rows="2"
                  defaultValue="Môi trường làm việc tập trung vào sản phẩm, quy trình gọn và ưu tiên tốc độ phản hồi trong đội ngũ nhỏ."
                />
              </Field>
            </div>
          </section>

          <section className="recruit-section">
            <SectionTitle index={7} title="Cài đặt đăng tin" />
            <div className="form-stack">
              <div className="status-options" role="radiogroup" aria-label="Cài đặt trạng thái đăng tin">
                {statusOptions.map((option, index) => (
                  <label className="status-option" key={option}>
                    <input type="radio" name="post-status" defaultChecked={index === 0} />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <div className="action-row" aria-label="Hành động cuối trang">
            <button className="btn btn-muted" type="button">
              Lưu nháp
            </button>
            <button className="btn btn-primary" type="button">
              Xem trước
            </button>
            <button className="btn btn-success" type="button">
              Đăng tin
            </button>
            <button className="btn btn-danger" type="button">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Dangtintuyendung;