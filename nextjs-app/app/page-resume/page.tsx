"use client";
import React, { useRef, useState } from "react";
import "./page-resume.css";
import "./step-status.css";

export default function ResumePage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    desc: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });

  // Thêm state step để điều khiển bước
  const [step, setStep] = useState(1);

  // State cho kinh nghiệm làm việc
  const [experiences, setExperiences] = useState([
    {
      company: "",
      position: "",
      start: "",
      end: "",
      current: false,
      desc: "",
    },
  ]);
  const [expTouched, setExpTouched] = useState([
    { company: false, position: false, start: false },
  ]);

  // State cho học vấn
  const [educations, setEducations] = useState([
    { school: "", degree: "", major: "", gpa: "", start: "", end: "" },
  ]);
  const [eduTouched, setEduTouched] = useState([
    { school: false, degree: false, start: false },
  ]);
  const handleEduChange = (idx: number, field: string, value: string) => {
    const newEdus = educations.map((edu, i) =>
      i === idx ? { ...edu, [field]: value } : edu
    );
    setEducations(newEdus);
    if (["school", "degree", "start"].includes(field)) {
      const newTouched = eduTouched.map((t, i) =>
        i === idx ? { ...t, [field]: true } : t
      );
      setEduTouched(newTouched);
    }
  };
  const isEduValid = educations.every(
    (edu) => edu.school.trim() && edu.degree.trim() && edu.start
  );

  // State cho kỹ năng
  const [skills, setSkills] = useState([{ name: "", category: "", level: "" }]);
  const [skillTouched, setSkillTouched] = useState([
    { name: false, level: false },
  ]);
  const handleSkillChange = (idx: number, field: string, value: string) => {
    const newSkills = skills.map((skill, i) =>
      i === idx ? { ...skill, [field]: value } : skill
    );
    setSkills(newSkills);
    if (["name", "level"].includes(field)) {
      const newTouched = skillTouched.map((t, i) =>
        i === idx ? { ...t, [field]: true } : t
      );
      setSkillTouched(newTouched);
    }
  };
  const isSkillValid = skills.every(
    (skill) => skill.name.trim() && skill.level.trim()
  );

  // State cho hoạt động
  const [activities, setActivities] = useState([
    { name: "", role: "", start: "", end: "", desc: "" },
  ]);
  const [actTouched, setActTouched] = useState([
    { name: false, role: false, start: false },
  ]);
  const handleActChange = (idx: number, field: string, value: string) => {
    const newActs = activities.map((act, i) =>
      i === idx ? { ...act, [field]: value } : act
    );
    setActivities(newActs);
    if (["name", "role", "start"].includes(field)) {
      const newTouched = actTouched.map((t, i) =>
        i === idx ? { ...t, [field]: true } : t
      );
      setActTouched(newTouched);
    }
  };
  const isActValid = activities.every(
    (act) => act.name.trim() && act.role.trim() && act.start
  );

  // State cho giải thưởng
  const [awards, setAwards] = useState([
    { title: "", org: "", year: "", desc: "" },
  ]);
  const [awardTouched, setAwardTouched] = useState([
    { title: false, org: false, year: false },
  ]);
  const handleAwardChange = (idx: number, field: string, value: string) => {
    const newAwards = awards.map((award, i) =>
      i === idx ? { ...award, [field]: value } : award
    );
    setAwards(newAwards);
    if (["title", "org", "year"].includes(field)) {
      const newTouched = awardTouched.map((t, i) =>
        i === idx ? { ...t, [field]: true } : t
      );
      setAwardTouched(newTouched);
    }
  };
  const isAwardValid = awards.every(
    (award) => award.title.trim() && award.org.trim() && award.year.trim()
  );

  // Hàm xử lý thay đổi kinh nghiệm
  const handleExpChange = (idx: number, field: string, value: any) => {
    const newExps = experiences.map((exp, i) =>
      i === idx ? { ...exp, [field]: value } : exp
    );
    setExperiences(newExps);
    // Đánh dấu đã chạm vào trường để hiện lỗi
    if (["company", "position", "start"].includes(field)) {
      const newTouched = expTouched.map((t, i) =>
        i === idx ? { ...t, [field]: true } : t
      );
      setExpTouched(newTouched);
    }
  };

  // Validate kinh nghiệm: tất cả các trường bắt buộc phải có
  const isExpValid = experiences.every(
    (exp) => exp.company.trim() && exp.position.trim() && exp.start
  );

  // Validate
  const isEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPhone = (phone: string) => /^0\d{9,10}$/.test(phone.trim());

  const isValid =
    form.name.trim().length > 0 && isEmail(form.email) && isPhone(form.phone);

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle blur for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setStep(2); // Chuyển sang bước 2
  };

  // Xác định bước hoàn thành
  const completed = [
    isValid,
    isExpValid,
    isEduValid,
    isSkillValid,
    isActValid,
    isAwardValid,
  ];

  return (
    <div className="resume-container">
      <header className="resume-header">
        <h1>Tạo Resume</h1>
        <p className="resume-desc">Tạo resume chuyên nghiệp trong vài phút</p>
        <div className="resume-actions">
          <button className="resume-action-btn">Bước</button>
          <button className="resume-action-btn">Thiết kế</button>
          <button className="resume-action-btn">Xuất</button>
        </div>
      </header>
      <div className="resume-main">
        {/* Steps */}
        <aside className="resume-steps">
          <h3>Các bước</h3>
          <ul>
            <li className={step === 1 ? "active" : completed[0] ? "done" : ""}>
              <div>Thông tin cá nhân</div>
              <span>
                Bước 1 {completed[0] && <span className="step-tick">✔</span>}
              </span>
            </li>
            <li className={step === 2 ? "active" : completed[1] ? "done" : ""}>
              <div>Kinh nghiệm làm việc</div>
              <span>
                Bước 2 {completed[1] && <span className="step-tick">✔</span>}
              </span>
            </li>
            <li className={step === 3 ? "active" : completed[2] ? "done" : ""}>
              <div>Học vấn</div>
              <span>
                Bước 3 {completed[2] && <span className="step-tick">✔</span>}
              </span>
            </li>
            <li className={step === 4 ? "active" : completed[3] ? "done" : ""}>
              <div>Kỹ năng</div>
              <span>
                Bước 4 {completed[3] && <span className="step-tick">✔</span>}
              </span>
            </li>
            <li className={step === 5 ? "active" : completed[4] ? "done" : ""}>
              <div>Hoạt động</div>
              <span>
                Bước 5 {completed[4] && <span className="step-tick">✔</span>}
              </span>
            </li>
            <li className={step === 6 ? "active" : completed[5] ? "done" : ""}>
              <div>Giải thưởng</div>
              <span>
                Bước 6 {completed[5] && <span className="step-tick">✔</span>}
              </span>
            </li>
          </ul>
        </aside>
        {/* Form */}
        <section className="resume-form">
          <div className="resume-form-header">
            <h2>{step === 1 ? "Thông tin cá nhân" : "Kinh nghiệm làm việc"}</h2>
            <span>{step} / 6</span>
          </div>
          <div className="resume-progress">
            <div
              className="resume-progress-bar"
              style={{ width: `${step * 16.6}%` }}
            ></div>
          </div>
          {step === 1 && (
            <>
              <div className="resume-avatar">
                <div
                  className="avatar-img"
                  style={{
                    backgroundImage: avatar ? `url(${avatar})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!avatar && (
                    <span
                      style={{
                        color: "#ccc",
                        fontSize: "2rem",
                      }}
                    >
                      &#9787;
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  className="avatar-upload-btn"
                  onClick={handleAvatarClick}
                >
                  Tải ảnh lên
                </button>
                <p className="avatar-note">
                  Khuyến nghị: Ảnh vuông, kích thước tối thiểu 200x200px
                </p>
              </div>
              <form
                className="resume-fields"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                <div className="field-row">
                  <div className="field">
                    <label>Họ và tên *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    {touched.name && form.name.trim().length === 0 && (
                      <span className="error">Vui lòng nhập họ và tên</span>
                    )}
                  </div>
                  <div className="field">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="example@email.com"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    {touched.email && !isEmail(form.email) && (
                      <span className="error">Email không hợp lệ</span>
                    )}
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Số điện thoại *</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="0123456789"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    {touched.phone && !isPhone(form.phone) && (
                      <span className="error">Số điện thoại không hợp lệ</span>
                    )}
                  </div>
                  <div className="field">
                    <label>Địa chỉ</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Thành phố Hồ Chí Minh"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Mô tả bản thân</label>
                  <textarea
                    name="desc"
                    placeholder="Mô tả ngắn gọn về bản thân, mục tiêu nghề nghiệp..."
                    rows={3}
                    value={form.desc}
                    onChange={handleChange}
                  ></textarea>
                  <small>
                    Viết 2-3 câu ngắn gọn về kinh nghiệm và mục tiêu của bạn
                  </small>
                </div>
                <div className="resume-form-actions">
                  <button type="button" className="back-btn" disabled>
                    &lt; Quay lại
                  </button>
                  <button
                    type="submit"
                    className="next-btn"
                    disabled={!isValid}
                    style={{
                      opacity: isValid ? 1 : 0.5,
                      cursor: isValid ? "pointer" : "not-allowed",
                    }}
                  >
                    Tiếp theo
                  </button>
                </div>
              </form>
            </>
          )}
          {step === 2 && (
            <div className="resume-fields">
              <h3 style={{ marginBottom: 16 }}>Kinh nghiệm làm việc</h3>
              <button
                type="button"
                className="add-exp-btn"
                onClick={() => {
                  setExperiences([
                    ...experiences,
                    {
                      company: "",
                      position: "",
                      start: "",
                      end: "",
                      current: false,
                      desc: "",
                    },
                  ]);
                  setExpTouched([
                    ...expTouched,
                    { company: false, position: false, start: false },
                  ]);
                }}
                style={{ marginBottom: 16 }}
              >
                + Thêm kinh nghiệm
              </button>
              <div className="exp-list">
                {experiences.map((exp, idx) => (
                  <div className="exp-item" key={idx}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <b>Kinh nghiệm {idx + 1}</b>
                      {experiences.length > 1 && (
                        <button
                          type="button"
                          className="del-exp-btn"
                          onClick={() => {
                            setExperiences(
                              experiences.filter((_, i) => i !== idx)
                            );
                            setExpTouched(
                              expTouched.filter((_, i) => i !== idx)
                            );
                          }}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>Công ty *</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            handleExpChange(idx, "company", e.target.value)
                          }
                          placeholder="Tên công ty"
                          required
                        />
                        {expTouched[idx]?.company && !exp.company.trim() && (
                          <span className="error">
                            Vui lòng nhập tên công ty
                          </span>
                        )}
                      </div>
                      <div className="field">
                        <label>Vị trí *</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) =>
                            handleExpChange(idx, "position", e.target.value)
                          }
                          placeholder="Vị trí công việc"
                          required
                        />
                        {expTouched[idx]?.position && !exp.position.trim() && (
                          <span className="error">Vui lòng nhập vị trí</span>
                        )}
                      </div>
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>Ngày bắt đầu *</label>
                        <input
                          type="date"
                          value={exp.start}
                          onChange={(e) =>
                            handleExpChange(idx, "start", e.target.value)
                          }
                          required
                        />
                        {expTouched[idx]?.start && !exp.start && (
                          <span className="error">
                            Vui lòng chọn ngày bắt đầu
                          </span>
                        )}
                      </div>
                      <div className="field">
                        <label>Ngày kết thúc</label>
                        <input
                          type="date"
                          value={exp.end}
                          onChange={(e) =>
                            handleExpChange(idx, "end", e.target.value)
                          }
                          disabled={exp.current}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label>
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) =>
                            handleExpChange(idx, "current", e.target.checked)
                          }
                        />{" "}
                        Đang làm việc tại đây
                      </label>
                    </div>
                    <div className="field">
                      <label>Mô tả công việc</label>
                      <textarea
                        value={exp.desc}
                        onChange={(e) =>
                          handleExpChange(idx, "desc", e.target.value)
                        }
                        placeholder="Mô tả chi tiết về công việc, thành tích đạt được..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="resume-form-actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep(1)}
                >
                  &lt; Quay lại
                </button>
                <button
                  type="button"
                  className="next-btn"
                  disabled={!isExpValid}
                  onClick={() => setStep(3)}
                  style={{
                    opacity: isExpValid ? 1 : 0.5,
                    cursor: isExpValid ? "pointer" : "not-allowed",
                  }}
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="resume-fields">
              <h3 style={{ marginBottom: 16 }}>Học vấn</h3>
              <button
                type="button"
                className="add-exp-btn"
                onClick={() => {
                  setEducations([
                    ...educations,
                    {
                      school: "",
                      degree: "",
                      major: "",
                      gpa: "",
                      start: "",
                      end: "",
                    },
                  ]);
                  setEduTouched([
                    ...eduTouched,
                    { school: false, degree: false, start: false },
                  ]);
                }}
                style={{ marginBottom: 16 }}
              >
                + Thêm học vấn
              </button>
              <div className="exp-list">
                {educations.map((edu, idx) => (
                  <div className="exp-item" key={idx}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <b>Học vấn {idx + 1}</b>
                      {educations.length > 1 && (
                        <button
                          type="button"
                          className="del-exp-btn"
                          onClick={() => {
                            setEducations(
                              educations.filter((_, i) => i !== idx)
                            );
                            setEduTouched(
                              eduTouched.filter((_, i) => i !== idx)
                            );
                          }}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>Trường học *</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) =>
                            handleEduChange(idx, "school", e.target.value)
                          }
                          placeholder="Tên trường học"
                          required
                        />
                        {eduTouched[idx]?.school && !edu.school.trim() && (
                          <span className="error">
                            Vui lòng nhập trường học
                          </span>
                        )}
                      </div>
                      <div className="field">
                        <label>Bằng cấp *</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            handleEduChange(idx, "degree", e.target.value)
                          }
                          placeholder="Cử nhân, Thạc sĩ, Tiến sĩ..."
                          required
                        />
                        {eduTouched[idx]?.degree && !edu.degree.trim() && (
                          <span className="error">Vui lòng nhập bằng cấp</span>
                        )}
                      </div>
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>Chuyên ngành</label>
                        <input
                          type="text"
                          value={edu.major}
                          onChange={(e) =>
                            handleEduChange(idx, "major", e.target.value)
                          }
                          placeholder="Công nghệ thông tin, Kinh tế..."
                        />
                      </div>
                      <div className="field">
                        <label>GPA</label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) =>
                            handleEduChange(idx, "gpa", e.target.value)
                          }
                          placeholder="3.5/4.0"
                        />
                      </div>
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>Ngày bắt đầu *</label>
                        <input
                          type="date"
                          value={edu.start}
                          onChange={(e) =>
                            handleEduChange(idx, "start", e.target.value)
                          }
                          required
                        />
                        {eduTouched[idx]?.start && !edu.start && (
                          <span className="error">
                            Vui lòng chọn ngày bắt đầu
                          </span>
                        )}
                      </div>
                      <div className="field">
                        <label>Ngày tốt nghiệp</label>
                        <input
                          type="date"
                          value={edu.end}
                          onChange={(e) =>
                            handleEduChange(idx, "end", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="resume-form-actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep(2)}
                >
                  &lt; Quay lại
                </button>
                <button
                  type="button"
                  className="next-btn"
                  disabled={!isEduValid}
                  onClick={() => setStep(4)}
                  style={{
                    opacity: isEduValid ? 1 : 0.5,
                    cursor: isEduValid ? "pointer" : "not-allowed",
                  }}
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="resume-fields">
              <h3 style={{ marginBottom: 16 }}>Kỹ năng</h3>
              <button
                type="button"
                className="add-exp-btn"
                onClick={() => {
                  setSkills([...skills, { name: "", category: "", level: "" }]);
                  setSkillTouched([
                    ...skillTouched,
                    { name: false, level: false },
                  ]);
                }}
                style={{ marginBottom: 16 }}
              >
                + Thêm kỹ năng
              </button>
              <div className="exp-list">
                {skills.map((skill, idx) => (
                  <div className="exp-item" key={idx}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <b>Kỹ năng {idx + 1}</b>
                      {skills.length > 1 && (
                        <button
                          type="button"
                          className="del-exp-btn"
                          onClick={() => {
                            setSkills(skills.filter((_, i) => i !== idx));
                            setSkillTouched(
                              skillTouched.filter((_, i) => i !== idx)
                            );
                          }}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>Tên kỹ năng *</label>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) =>
                            handleSkillChange(idx, "name", e.target.value)
                          }
                          placeholder="VD: Java, Photoshop..."
                          required
                        />
                        {skillTouched[idx]?.name && !skill.name.trim() && (
                          <span className="error">
                            Vui lòng nhập tên kỹ năng
                          </span>
                        )}
                      </div>
                      <div className="field">
                        <label>Danh mục</label>
                        <input
                          type="text"
                          value={skill.category}
                          onChange={(e) =>
                            handleSkillChange(idx, "category", e.target.value)
                          }
                          placeholder="Thiết kế, Lập trình..."
                        />
                      </div>
                      <div className="field">
                        <label>Trình độ *</label>
                        <select
                          value={skill.level}
                          onChange={(e) =>
                            handleSkillChange(idx, "level", e.target.value)
                          }
                          required
                        >
                          <option value="">Chọn trình độ</option>
                          <option value="Cơ bản">Cơ bản</option>
                          <option value="Trung bình">Trung bình</option>
                          <option value="Khá">Khá</option>
                          <option value="Tốt">Tốt</option>
                          <option value="Chuyên gia">Chuyên gia</option>
                        </select>
                        {skillTouched[idx]?.level && !skill.level.trim() && (
                          <span className="error">Vui lòng chọn trình độ</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="resume-form-actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep(3)}
                >
                  &lt; Quay lại
                </button>
                <button
                  type="button"
                  className="next-btn"
                  disabled={!isSkillValid}
                  onClick={() => setStep(5)}
                  style={{
                    opacity: isSkillValid ? 1 : 0.5,
                    cursor: isSkillValid ? "pointer" : "not-allowed",
                  }}
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="resume-fields">
              <h3 style={{ marginBottom: 16 }}>Hoạt động</h3>
              <button
                type="button"
                className="add-exp-btn"
                onClick={() => {
                  setActivities([
                    ...activities,
                    { name: "", role: "", start: "", end: "", desc: "" },
                  ]);
                  setActTouched([
                    ...actTouched,
                    { name: false, role: false, start: false },
                  ]);
                }}
                style={{ marginBottom: 16 }}
              >
                + Thêm hoạt động
              </button>
              <div className="exp-list">
                {activities.map((act, idx) => (
                  <div className="exp-item" key={idx}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <b>Hoạt động {idx + 1}</b>
                      {activities.length > 1 && (
                        <button
                          type="button"
                          className="del-exp-btn"
                          onClick={() => {
                            setActivities(
                              activities.filter((_, i) => i !== idx)
                            );
                            setActTouched(
                              actTouched.filter((_, i) => i !== idx)
                            );
                          }}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>Tên hoạt động *</label>
                        <input
                          type="text"
                          value={act.name}
                          onChange={(e) =>
                            handleActChange(idx, "name", e.target.value)
                          }
                          placeholder="Tên hoạt động"
                          required
                        />
                        {actTouched[idx]?.name && !act.name.trim() && (
                          <span className="error">
                            Vui lòng nhập tên hoạt động
                          </span>
                        )}
                      </div>
                      <div className="field">
                        <label>Vai trò *</label>
                        <input
                          type="text"
                          value={act.role}
                          onChange={(e) =>
                            handleActChange(idx, "role", e.target.value)
                          }
                          placeholder="Vai trò"
                          required
                        />
                        {actTouched[idx]?.role && !act.role.trim() && (
                          <span className="error">Vui lòng nhập vai trò</span>
                        )}
                      </div>
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>Ngày bắt đầu *</label>
                        <input
                          type="date"
                          value={act.start}
                          onChange={(e) =>
                            handleActChange(idx, "start", e.target.value)
                          }
                          required
                        />
                        {actTouched[idx]?.start && !act.start && (
                          <span className="error">
                            Vui lòng chọn ngày bắt đầu
                          </span>
                        )}
                      </div>
                      <div className="field">
                        <label>Ngày kết thúc</label>
                        <input
                          type="date"
                          value={act.end}
                          onChange={(e) =>
                            handleActChange(idx, "end", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label>Mô tả hoạt động</label>
                      <textarea
                        value={act.desc}
                        onChange={(e) =>
                          handleActChange(idx, "desc", e.target.value)
                        }
                        placeholder="Mô tả chi tiết về hoạt động..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="resume-form-actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep(4)}
                >
                  &lt; Quay lại
                </button>
                <button
                  type="button"
                  className="next-btn"
                  disabled={!isActValid}
                  onClick={() => setStep(6)}
                  style={{
                    opacity: isActValid ? 1 : 0.5,
                    cursor: isActValid ? "pointer" : "not-allowed",
                  }}
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}
          {step === 6 && (
            <div className="resume-fields">
              <h3 style={{ marginBottom: 16 }}>Giải thưởng</h3>
              <button
                type="button"
                className="add-exp-btn"
                onClick={() => {
                  setAwards([
                    ...awards,
                    { title: "", org: "", year: "", desc: "" },
                  ]);
                  setAwardTouched([
                    ...awardTouched,
                    { title: false, org: false, year: false },
                  ]);
                }}
                style={{ marginBottom: 16 }}
              >
                + Thêm giải thưởng
              </button>
              <div className="exp-list">
                {awards.map((award, idx) => (
                  <div className="exp-item" key={idx}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <b>Giải thưởng {idx + 1}</b>
                      {awards.length > 1 && (
                        <button
                          type="button"
                          className="del-exp-btn"
                          onClick={() => {
                            setAwards(awards.filter((_, i) => i !== idx));
                            setAwardTouched(
                              awardTouched.filter((_, i) => i !== idx)
                            );
                          }}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>Tên giải thưởng *</label>
                        <input
                          type="text"
                          value={award.title}
                          onChange={(e) =>
                            handleAwardChange(idx, "title", e.target.value)
                          }
                          placeholder="Tên giải thưởng"
                          required
                        />
                        {awardTouched[idx]?.title && !award.title.trim() && (
                          <span className="error">
                            Vui lòng nhập tên giải thưởng
                          </span>
                        )}
                      </div>
                      <div className="field">
                        <label>Tổ chức *</label>
                        <input
                          type="text"
                          value={award.org}
                          onChange={(e) =>
                            handleAwardChange(idx, "org", e.target.value)
                          }
                          placeholder="Tổ chức trao giải"
                          required
                        />
                        {awardTouched[idx]?.org && !award.org.trim() && (
                          <span className="error">Vui lòng nhập tổ chức</span>
                        )}
                      </div>
                      <div className="field">
                        <label>Năm *</label>
                        <input
                          type="text"
                          value={award.year}
                          onChange={(e) =>
                            handleAwardChange(idx, "year", e.target.value)
                          }
                          placeholder="2024"
                          required
                        />
                        {awardTouched[idx]?.year && !award.year.trim() && (
                          <span className="error">Vui lòng nhập năm</span>
                        )}
                      </div>
                    </div>
                    <div className="field">
                      <label>Mô tả giải thưởng</label>
                      <textarea
                        value={award.desc}
                        onChange={(e) =>
                          handleAwardChange(idx, "desc", e.target.value)
                        }
                        placeholder="Mô tả chi tiết về giải thưởng..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="resume-form-actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep(5)}
                >
                  &lt; Quay lại
                </button>
                <button
                  type="button"
                  className="next-btn"
                  disabled={!isAwardValid}
                  style={{
                    opacity: isAwardValid ? 1 : 0.5,
                    cursor: isAwardValid ? "pointer" : "not-allowed",
                  }}
                >
                  Hoàn tất
                </button>
              </div>
            </div>
          )}
        </section>
        {/* Preview */}
        <aside className="resume-preview">
          <h3>
            <span role="img" aria-label="eye">
              👁️
            </span>{" "}
            Xem trước
          </h3>
          <div className="preview-box">
            <div className="preview-name">{form.name || "Họ và tên"}</div>
          </div>
          <button className="preview-full-btn">Xem toàn màn hình</button>
        </aside>
      </div>
    </div>
  );
}
