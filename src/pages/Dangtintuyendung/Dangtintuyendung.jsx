import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJobPost } from '../../services/api';
import { ROUTES } from '../../constants/routes';
import './Dangtintuyendung.css';

const requirementTags = ['ReactJS', 'HTML/CSS', 'REST API'];

const benefitTags = ['Lương cạnh tranh', 'Thưởng hiệu suất', 'Linh hoạt', 'Bảo hiểm'];

const statusOptions = ['Nháp', 'Đăng'];
const draftStorageKey = 'dangtintuyendung-draft';

const defaultDraft = {
  title: 'ReactJS Front-end Developer',
  department: 'Sản phẩm',
  jobName: 'Front-end Developer',
  openings: '2',
  description:
    'Xây dựng giao diện React cho sản phẩm nội bộ, phối hợp với design và backend để hoàn thiện trải nghiệm người dùng.',
  mainDuties:
    'Phát triển tính năng mới, tối ưu giao diện, xử lý dữ liệu từ API và đảm bảo chất lượng hiển thị trên nhiều thiết bị.',
  skills: requirementTags,
  otherRequirements: 'Ưu tiên ứng viên có kinh nghiệm làm việc với sản phẩm nội bộ.',
  salary: 'Thoả thuận',
  bonus: 'Thưởng theo dự án',
  otherBenefits: 'Đào tạo nội bộ, bảo hiểm đầy đủ, review định kỳ.',
  location: 'TP. Hồ Chí Minh',
  workTime: '09:00 - 18:00',
  employmentType: 'Hybrid',
  deadline: '30/04/2026',
  companyName: 'Công ty công nghệ nội bộ',
  companyIntro:
    'Môi trường làm việc tập trung vào sản phẩm, quy trình gọn và ưu tiên tốc độ phản hồi trong đội ngũ nhỏ.',
};

function getSavedDraft() {
  if (typeof window === 'undefined') {
    return defaultDraft;
  }

  try {
    const savedDraft = window.sessionStorage.getItem(draftStorageKey);
    if (!savedDraft) {
      return defaultDraft;
    }

    const parsedDraft = JSON.parse(savedDraft);
    return {
      ...defaultDraft,
      ...parsedDraft,
      skills: Array.isArray(parsedDraft.skills) && parsedDraft.skills.length > 0 ? parsedDraft.skills : defaultDraft.skills,
    };
  } catch {
    return defaultDraft;
  }
}

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
  const navigate = useNavigate();
  const formRef = useRef(null);
  const initialDraft = getSavedDraft();
  const [skills, setSkills] = useState(initialDraft.skills);
  const [workTime, setWorkTime] = useState(initialDraft.workTime);
  const [workTimeError, setWorkTimeError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const workTimeInputRef = useRef(null);

  const workTimePattern = /^(?:[01]\d|2[0-3]):[0-5]\d\s-\s(?:[01]\d|2[0-3]):[0-5]\d$/;

  const addSkill = () => {
    setSkills((currentSkills) => [...currentSkills, '']);
  };

  const updateSkill = (index, value) => {
    setSkills((currentSkills) => currentSkills.map((skill, skillIndex) => (skillIndex === index ? value : skill)));
  };

  const validateWorkTime = () => {
    if (workTimePattern.test(workTime.trim())) {
      setWorkTimeError('');
      return;
    }

    setWorkTimeError('Vui lòng nhập đúng mẫu HH:MM - HH:MM.');
    window.setTimeout(() => {
      workTimeInputRef.current?.focus();
    }, 0);
  };

  const collectRecruitmentData = () => {
    const formElement = formRef.current;
    if (!formElement) {
      return null;
    }

    const formData = new FormData(formElement);
    const requirementSkills = formData
      .getAll('skills')
      .map((skill) => String(skill).trim())
      .filter(Boolean);

    const recruitmentData = {
      title: String(formData.get('title') || '').trim(),
      jobName: String(formData.get('jobName') || '').trim(),
      companyName: String(formData.get('companyName') || '').trim(),
      salary: String(formData.get('salary') || '').trim(),
      location: String(formData.get('location') || '').trim(),
      employmentType: String(formData.get('employmentType') || '').trim(),
      deadline: String(formData.get('deadline') || '').trim(),
      description: String(formData.get('description') || '').trim(),
      requirements: [
        requirementSkills.length > 0 ? requirementSkills.join(', ') : '',
        String(formData.get('otherRequirements') || '').trim(),
        String(formData.get('mainDuties') || '').trim(),
      ]
        .filter(Boolean)
        .join(' '),
      benefits: [
        String(formData.get('bonus') || '').trim(),
        String(formData.get('otherBenefits') || '').trim(),
      ]
        .filter(Boolean)
        .join(' '),
    };

    const draftData = {
      title: recruitmentData.title,
      department: String(formData.get('department') || '').trim(),
      jobName: recruitmentData.jobName,
      openings: String(formData.get('openings') || '').trim(),
      description: recruitmentData.description,
      mainDuties: String(formData.get('mainDuties') || '').trim(),
      skills: requirementSkills,
      otherRequirements: String(formData.get('otherRequirements') || '').trim(),
      salary: recruitmentData.salary,
      bonus: String(formData.get('bonus') || '').trim(),
      otherBenefits: String(formData.get('otherBenefits') || '').trim(),
      location: recruitmentData.location,
      workTime: String(formData.get('workTime') || '').trim(),
      employmentType: recruitmentData.employmentType,
      deadline: recruitmentData.deadline,
      companyName: recruitmentData.companyName,
      companyIntro: String(formData.get('companyIntro') || '').trim(),
    };

    window.sessionStorage.setItem(draftStorageKey, JSON.stringify(draftData));

    return recruitmentData;
  };

  const handlePreview = () => {
    const recruitmentData = collectRecruitmentData();
    if (!recruitmentData) {
      return;
    }

    navigate(ROUTES.JOB_DETAIL, {
      state: {
        recruitmentData,
      },
    });
  };

  const handlePublish = async () => {
    const workTimeValue = workTime.trim();
    if (!workTimePattern.test(workTimeValue)) {
      setWorkTimeError('Vui lòng nhập đúng mẫu HH:MM - HH:MM.');
      workTimeInputRef.current?.focus();
      return;
    }

    const recruitmentData = collectRecruitmentData();
    if (!recruitmentData) {
      return;
    }

    setSubmitError('');
    setSubmitSuccess('');
    setIsSubmitting(true);

    try {
      const response = await createJobPost({
        ...recruitmentData,
        status: 'Đăng',
        workTime: workTimeValue,
      });

      setSubmitSuccess('Tin tuyển dụng đã được gửi thành công.');
      navigate(ROUTES.RECRUITMENT_LIST, {
        state: {
          createdJob: response,
        },
      });
    } catch (error) {
      setSubmitError(error.message || 'Không thể đăng tin tuyển dụng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.RECRUITMENT_LIST);
  };

  return (
    <main className="recruit-post-page">
      <div className="recruit-post-shell">
        <header className="page-title-block">
          <h1>Đăng tin tuyển dụng</h1>
        </header>

        <form ref={formRef} className="recruit-form">
          <section className="recruit-section">
            <SectionTitle index={1} title="Thông tin cơ bản công việc" />
            <div className="form-stack">
              <div className="form-grid form-grid-two">
                <Field label="Tiêu đề công việc">
                  <input name="title" type="text" defaultValue={initialDraft.title} />
                </Field>
                <Field label="Phòng ban">
                  <input name="department" type="text" defaultValue={initialDraft.department} />
                </Field>
                <Field label="Chức danh">
                  <input name="jobName" type="text" defaultValue={initialDraft.jobName} />
                </Field>
                <Field label="Số lượng tuyển">
                  <input name="openings" type="number" defaultValue={initialDraft.openings} min="1" />
                </Field>
              </div>
            </div>
          </section>

          <section className="recruit-section">
            <SectionTitle index={2} title="Mô tả công việc" />
            <div className="form-stack">
              <Field label="Mô tả công việc" wide>
                <textarea
                  name="description"
                  rows="3"
                  defaultValue={initialDraft.description}
                />
              </Field>
              <Field label="Nhiệm vụ chính" wide>
                <textarea
                  name="mainDuties"
                  rows="2"
                  defaultValue={initialDraft.mainDuties}
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
                      name="skills"
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
                <input
                  name="otherRequirements"
                  type="text"
                  defaultValue={initialDraft.otherRequirements}
                />
              </Field>
            </div>
          </section>

          <section className="recruit-section">
            <SectionTitle index={4} title="Quyền lợi & chế độ" />
            <div className="form-stack">
              <div className="form-grid form-grid-two">
                <Field label="Mức lương">
                  <input name="salary" type="text" defaultValue={initialDraft.salary} />
                </Field>
                <Field label="Thưởng / Phụ cấp">
                  <input name="bonus" type="text" defaultValue={initialDraft.bonus} />
                </Field>
                <Field label="Chế độ khác" wide>
                  <input
                    name="otherBenefits"
                    type="text"
                    defaultValue={initialDraft.otherBenefits}
                  />
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
                  <input name="location" type="text" defaultValue={initialDraft.location} />
                </Field>
                <Field label="Thời gian làm việc">
                  <input
                    ref={workTimeInputRef}
                    name="workTime"
                    type="text"
                    value={workTime}
                    onChange={(event) => {
                      setWorkTime(event.target.value);
                      if (workTimeError) {
                        setWorkTimeError('');
                      }
                    }}
                    onBlur={validateWorkTime}
                    placeholder="HH:MM - HH:MM"
                    aria-invalid={Boolean(workTimeError)}
                    aria-describedby={workTimeError ? 'work-time-hint' : undefined}
                  />
                  {workTimeError ? (
                    <small id="work-time-hint" className="field-error">
                      {workTimeError}
                    </small>
                  ) : null}
                </Field>
                <Field label="Hình thức">
                  <input name="employmentType" type="text" defaultValue={initialDraft.employmentType} />
                </Field>
                <Field label="Hạn nộp hồ sơ">
                  <input name="deadline" type="text" defaultValue={initialDraft.deadline} />
                </Field>
              </div>
            </div>
          </section>

          <section className="recruit-section">
            <SectionTitle index={6} title="Thông tin công ty" />
            <div className="form-stack">
              <Field label="Tự động lấy từ hồ sơ công ty" wide>
                <input name="companyName" type="text" defaultValue={initialDraft.companyName} />
              </Field>
              <Field label="Giới thiệu ngắn" wide>
                <textarea
                  name="companyIntro"
                  rows="2"
                  defaultValue={initialDraft.companyIntro}
                />
              </Field>
            </div>
          </section>



          <div className="action-row" aria-label="Hành động cuối trang">
          {submitError ? (
            <div className="form-notice form-notice-error" role="alert">
              {submitError}
            </div>
          ) : null}
          {submitSuccess ? (
            <div className="form-notice form-notice-success" role="status">
              {submitSuccess}
            </div>
          ) : null}

            <button className="btn btn-primary" type="button" onClick={handlePreview}>
              Xem trước
            </button>
            <button className="btn btn-success" type="button" onClick={handlePublish} disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : 'Đăng tin'}
            </button>
            <button className="btn btn-danger" type="button" onClick={handleCancel}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Dangtintuyendung;