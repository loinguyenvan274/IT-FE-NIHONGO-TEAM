import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './Manhinhmatching.module.css';

function Manhinhmatching() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    matchingCondition: '',
    workDate: '',
    startTime: '',
    endTime: '',
    location: '',
    staffCount: '',
    minSalary: '',
    maxSalary: '',
    requiredSkills: '',
    preferredConditions: ''
  });

  const [previewResult, setPreviewResult] = useState(null);
  const [averageMatch, setAverageMatch] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreview = () => {
    // Giả lập xem trước kết quả
    const count = Math.floor(Math.random() * 50) + 1;
    const avg = (Math.random() * 40 + 60).toFixed(1); // 60-100%
    setPreviewResult(count);
    setAverageMatch(avg);
  };

  const handleMatching = () => {
    navigate(`${ROUTES.CANDIDATES}?source=matching`);
  };

  const handleReset = () => {
    setFormData({
      matchingCondition: '',
      workDate: '',
      startTime: '',
      endTime: '',
      location: '',
      staffCount: '',
      minSalary: '',
      maxSalary: '',
      requiredSkills: '',
      preferredConditions: ''
    });
    setPreviewResult(null);
    setAverageMatch(null);
  };

  return (
    <div className={styles['app-shell']}>
      <div className={styles['ambient ambient-left']} />
      <div className={styles['ambient ambient-right']} />

      <header className={styles['topbar']}>
        <div className={styles['brand-block']}>
          <div className={styles['brand-mark']}>IT</div>
          <div>
            <strong>IT-FE</strong>
            <span>Màn hình Matching</span>
          </div>
        </div>

        <nav className={styles['topnav']} aria-label="Điều hướng chính">
          <button className={styles['topnav-link']} type="button" onClick={() => navigate(ROUTES.JOB_SEARCH)}>
            Trang chủ
          </button>
          <button className={`${styles['topnav-link']} ${styles['is-active']}`} type="button" onClick={() => navigate(ROUTES.MATCHING)}>
            Matching
          </button>
        </nav>
      </header>

      <main className={styles['page']}>
        <section className={styles['hero-card']}>
          <div className={styles['hero-copy']}>
            <h1>Thiết lập điều kiện Matching</h1>
            <p>Nhập các điều kiện để hệ thống ghép ứng viên phù hợp.</p>

            <form className={styles['matching-form']}>
              <div className={styles['form-group']}>
                <label htmlFor="matchingCondition">Điều kiện matching</label>
                <input
                  type="text"
                  id="matchingCondition"
                  name="matchingCondition"
                  value={formData.matchingCondition}
                  onChange={handleChange}
                  placeholder="Nhập điều kiện matching"
                />
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="workDate">Ngày làm việc</label>
                <input
                  type="date"
                  id="workDate"
                  name="workDate"
                  value={formData.workDate}
                  onChange={handleChange}
                />
              </div>

              <div className={styles['form-group']}>
                <label>Thời gian làm việc</label>
                <div className={styles['time-inputs']}>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    placeholder="Bắt đầu"
                  />
                  <span>đến</span>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    placeholder="Kết thúc"
                  />
                </div>
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="location">Địa điểm làm việc</label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                >
                  <option value="">Chọn địa điểm</option>
                  <option value="Hanoi">Hà Nội</option>
                  <option value="HCMC">TP.HCM</option>
                  <option value="Danang">Đà Nẵng</option>
                </select>
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="staffCount">Số lượng nhân sự cần tuyển</label>
                <input
                  type="number"
                  id="staffCount"
                  name="staffCount"
                  value={formData.staffCount}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <div className={styles['form-group']}>
                <label>Khoảng lương</label>
                <div className={styles['salary-inputs']}>
                  <input
                    type="number"
                    name="minSalary"
                    value={formData.minSalary}
                    onChange={handleChange}
                    placeholder="Tối thiểu"
                  />
                  <span>đến</span>
                  <input
                    type="number"
                    name="maxSalary"
                    value={formData.maxSalary}
                    onChange={handleChange}
                    placeholder="Tối đa"
                  />
                </div>
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="requiredSkills">Kỹ năng bắt buộc</label>
                <input
                  type="text"
                  id="requiredSkills"
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  placeholder="Ví dụ: Tiếng Anh, ReactJS"
                />
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="preferredConditions">Điều kiện ưu tiên</label>
                <textarea
                  id="preferredConditions"
                  name="preferredConditions"
                  value={formData.preferredConditions}
                  onChange={handleChange}
                  placeholder="Nhập các điều kiện ưu tiên"
                />
              </div>

              <div className={styles['form-actions']}>
                <button type="button" className={styles['btn btn-secondary']} onClick={handlePreview}>
                  Xem trước kết quả
                </button>
                <button type="button" className={styles['btn btn-primary']} onClick={handleMatching}>
                  Thực hiện matching
                </button>
                <button type="button" className={styles['btn btn-secondary']} onClick={handleReset}>
                  Đặt lại điều kiện
                </button>
              </div>
            </form>
          </div>

          <aside className={styles['hero-summary']}>
            <p className={styles['summary-label']}>Xem trước kết quả</p>
            {previewResult !== null ? (
              <>
                <h3>Số ứng viên phù hợp dự kiến: {previewResult}</h3>
                <div className={styles['summary-panel']}>
                  <div>
                    <span>Mức độ phù hợp trung bình</span>
                    <strong>{averageMatch}%</strong>
                  </div>
                </div>
                <p className={styles['note']}>* Kết quả chỉ mang tính ước tính</p>
                <p className={styles['note']}>* Có thể thay đổi khi điều kiện được điều chỉnh</p>
              </>
            ) : (
              <h3>Nhấn "Xem trước kết quả" để xem ước tính</h3>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Manhinhmatching;