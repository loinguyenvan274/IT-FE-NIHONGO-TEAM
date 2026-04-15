import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, buildInDevelopmentPath } from "../../constants/routes";
import styles from "./Chitiettuyendung.module.css";

const defaultRecruitmentData = {
  title: "Tuyển dụng Lập trình viên Frontend",
  jobName: "Lập trình viên ReactJS",
  companyName: "Công ty ABC",
  salary: "15-20 triệu VND",
  location: "Hà Nội",
  employmentType: "Toàn thời gian",
  deadline: "30/04/2026",
  description:
    "Chúng tôi đang tìm kiếm một lập trình viên Frontend có kinh nghiệm với ReactJS để tham gia vào dự án phát triển ứng dụng web.",
  requirements:
    "Kinh nghiệm 2+ năm với ReactJS, HTML/CSS, JavaScript. Có khả năng làm việc nhóm tốt.",
  benefits:
    "Lương cạnh tranh, thưởng hiệu suất, bảo hiểm, làm việc linh hoạt.",
};

function Chitiettuyendung() {
  const location = useLocation();
  const navigate = useNavigate();
  const recruitmentData = {
    ...defaultRecruitmentData,
    ...(location.state?.recruitmentData ?? {}),
  };

  const recruitmentId =
    location.state?.recruitmentData?.id ??
    location.state?.recruitmentId ??
    "";

  const handleEdit = () => {
    navigate(buildInDevelopmentPath("job-edit"));
  };

  const handleDelete = () => {
    navigate(buildInDevelopmentPath("job-delete"));
  };

  const handleViewCandidates = () => {
    if (recruitmentId) {
      navigate(`${ROUTES.CANDIDATES}?job_id=${encodeURIComponent(recruitmentId)}`);
      return;
    }

    navigate(ROUTES.CANDIDATES);
  };

  return (
    <main className={styles['chitiettuyendung-page']}>
      <div className={styles['chitiettuyendung-shell']}>
        <header className={styles['page-title-block']}>
          <h1>{recruitmentData.title}</h1>
        </header>

        <section className={styles['recruitment-details']}>
          <div className={styles['detail-item']}>
            <strong>1. Tiêu đề tuyển dụng:</strong> {recruitmentData.title}
          </div>
          <div className={styles['detail-item']}>
            <strong>2. Tên công việc:</strong> {recruitmentData.jobName}
          </div>
          <div className={styles['detail-item']}>
            <strong>3. Tên công ty:</strong> {recruitmentData.companyName}
          </div>
          <div className={styles['detail-item']}>
            <strong>4. Mức lương:</strong> {recruitmentData.salary}
          </div>
          <div className={styles['detail-item']}>
            <strong>5. Địa điểm:</strong> {recruitmentData.location}
          </div>
          <div className={styles['detail-item']}>
            <strong>6. Hình thức tuyển dụng:</strong>{" "}
            {recruitmentData.employmentType}
          </div>
          <div className={styles['detail-item']}>
            <strong>7. Hạn nộp hồ sơ:</strong> {recruitmentData.deadline}
          </div>
          <div className={styles['detail-item']}>
            <strong>8. Mô tả công việc:</strong> {recruitmentData.description}
          </div>
          <div className={styles['detail-item']}>
            <strong>9. Yêu cầu tố chất:</strong> {recruitmentData.requirements}
          </div>
          <div className={styles['detail-item']}>
            <strong>10. Quyền lợi:</strong> {recruitmentData.benefits}
          </div>
        </section>

        <section className={styles['actions']}>
          <button className={styles['edit-btn']} type="button" onClick={handleEdit}>
            11. Chỉnh sửa thông tin đăng tuyển
          </button>
          <button className={styles['delete-btn']} type="button" onClick={handleDelete}>
            12. Xóa thông tin đăng tuyển
          </button>
          <button className={styles['edit-btn']} type="button" onClick={handleViewCandidates}>
            13. Xem danh sách ứng viên phù hợp
          </button>
        </section>
      </div>
    </main>
  );
}

export default Chitiettuyendung;
