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
  console.log(employerId)
  console.log(session)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (!employerId) {
    setMessage("Bạn cần đăng nhập bằng tài khoản nhà tuyển dụng!");
    setLoading(false);
    return;
  }
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
      console.log("Request payload:", payload);
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
      <div className="container mt-5">
        <h2 className="mb-4">Tạo việc làm mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tiêu đề công việc *</label>
            <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required maxLength={150} />
          </div>
          <div className="mb-3">
            <label className="form-label">Mô tả công việc</label>
            <textarea className="form-control" name="description" rows={4} value={form.description} onChange={handleChange}></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Địa điểm</label>
            <input type="text" className="form-control" name="location" value={form.location} onChange={handleChange} maxLength={100} />
          </div>
          <div className="mb-3">
            <label className="form-label">Mức lương</label>
            <input type="text" className="form-control" name="salaryRange" value={form.salaryRange} onChange={handleChange} maxLength={100} />
          </div>
          <div className="mb-3">
            <label className="form-label">Loại việc làm *</label>
            <select className="form-control" name="jobType" value={form.jobType} onChange={handleChange} required>
              <option value="">Chọn loại việc</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="intern">Intern</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Ngành nghề</label>
            <input type="text" className="form-control" name="category" value={form.category} onChange={handleChange} maxLength={100} />
          </div>
          <div className="mb-3">
            <label className="form-label">Kỹ năng yêu cầu (cách nhau bởi dấu phẩy)</label>
            <input type="text" className="form-control" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="React, Node.js, SQL" />
          </div>
          <div className="mb-3">
            <label className="form-label">Kinh nghiệm tối thiểu (năm)</label>
            <input type="number" className="form-control" name="minExperience" value={form.minExperience} onChange={handleChange} min={0} />
          </div>
          <div className="mb-3">
            <label className="form-label">Bằng cấp yêu cầu</label>
            <input type="text" className="form-control" name="requiredDegree" value={form.requiredDegree} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Ngày hết hạn</label>
            <input type="date" className="form-control" name="endAt" value={form.endAt} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" name="status" value={form.status} onChange={handleChange}>
              <option value="active">Đang tuyển</option>
              <option value="closed">Đã đóng</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Đang đăng..." : "Đăng việc"}
          </button>
        </form>
        {message && <div className="mt-3">{message}</div>}
      </div>
    </Layout>
  );
}
