"use client";

import Layout from "@/components/Layout/Layout";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

const initialState = {
  title: "",
  description: "",
  location: "",
  salaryRange: "",
  jobType: "",
  category: "",
  requiredSkills: "",
  minExperience: "",
  requiredDegree: "",
  endAt: "",
  status: "active",
};


export default function JobCreate() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Lấy token và employerId từ session
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const employerId = session?.user?.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const payload = {
      ...form,
      requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      minExperience: form.minExperience ? Number(form.minExperience) : null,
      employerId,
      endAt: form.endAt ? `${form.endAt}T00:00:00` : "", // Sửa dòng này
    };
    try {
    const res = await fetch("http://localhost:8080/api/job-postings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage("Đăng việc thành công!");
        setForm(initialState);
      } else {
        const err = await res.json();
        console.error("API error:", err); // Thêm dòng này để log lỗi ra console
        setMessage("Lỗi: " + (err.message || JSON.stringify(err) || "Không thể đăng việc"));
      }
    } catch (error) {
      setMessage("Lỗi kết nối API!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: 600, width: "100%", background: "#fff" }}>
          <h2 className="mb-4 text-center fw-bold" style={{ color: "#2a3b6a" }}>
            <span style={{fontSize:32, marginRight:8}}>📝</span> Tạo việc làm mới
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">Tiêu đề công việc *</label>
                <input type="text" className="form-control rounded-3" name="title" value={form.title} onChange={handleChange} required maxLength={150} placeholder="VD: Lập trình viên ReactJS" />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Mô tả công việc</label>
                <textarea className="form-control rounded-3" name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Mô tả chi tiết công việc..." />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Địa điểm</label>
                <input type="text" className="form-control rounded-3" name="location" value={form.location} onChange={handleChange} maxLength={100} placeholder="VD: Hà Nội, Hồ Chí Minh" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Mức lương</label>
                <input type="text" className="form-control rounded-3" name="salaryRange" value={form.salaryRange} onChange={handleChange} maxLength={100} placeholder="VD: 15-20 triệu" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Loại việc làm *</label>
                <select className="form-select rounded-3" name="jobType" value={form.jobType} onChange={handleChange} required>
                  <option value="">Chọn loại việc</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="intern">Intern</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Ngành nghề</label>
                <input type="text" className="form-control rounded-3" name="category" value={form.category} onChange={handleChange} maxLength={100} placeholder="VD: Công nghệ thông tin" />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Kỹ năng yêu cầu <span className="text-muted">(cách nhau bởi dấu phẩy)</span></label>
                <input type="text" className="form-control rounded-3" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="React, Node.js, SQL" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Kinh nghiệm tối thiểu (năm)</label>
                <input type="number" className="form-control rounded-3" name="minExperience" value={form.minExperience} onChange={handleChange} min={0} placeholder="VD: 1" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Bằng cấp yêu cầu</label>
                <input type="text" className="form-control rounded-3" name="requiredDegree" value={form.requiredDegree} onChange={handleChange} placeholder="VD: Đại học CNTT" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Ngày hết hạn</label>
                <input type="date" className="form-control rounded-3" name="endAt" value={form.endAt} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Trạng thái</label>
                <select className="form-select rounded-3" name="status" value={form.status} onChange={handleChange}>
                  <option value="active">Đang tuyển</option>
                  <option value="closed">Đã đóng</option>
                </select>
              </div>
              <div className="col-12 text-center mt-4">
                <button type="submit" className="btn btn-primary px-5 py-2 rounded-3 fw-bold" style={{ fontSize: "1.1rem", boxShadow: "0 2px 8px #2a3b6a33" }} disabled={loading}>
                  {loading ? "Đang đăng..." : "Đăng việc"}
                </button>
              </div>
            </div>
          </form>
          {message && <div className="mt-3 text-center text-success fw-semibold">{message}</div>}
        </div>
      </div>
    </Layout>
  );
}
