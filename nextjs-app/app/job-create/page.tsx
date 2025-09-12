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

  // Danh sách bằng cấp dropdown
  const degreeOptions = [
    "Đại học",
    "Cao đẳng",
    "Trung cấp",
    "THPT",
    "Chứng chỉ nghề",
    "Không yêu cầu",
  ];

  // Danh sách tỉnh/thành phố Việt Nam
  const locationOptions = [
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
  ];

  // Lấy ngày hôm nay yyyy-mm-dd
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;

  console.log(employerId)
  console.log(session)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    // Validate ngày hết hạn
    if (form.endAt && form.endAt < minDate) {
      setMessage("Ngày hết hạn phải lớn hơn hoặc bằng ngày hiện tại!");
      setLoading(false);
      return;
    }
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
      endAt: form.endAt ? `${form.endAt}T00:00:00` : "",
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
      <div className="container py-5">
        <div className="mx-auto" style={{ maxWidth: 1200, minWidth: 400 }}>
          <h2 className="mb-4 text-center fw-bold" style={{ color: "#2a3b6a" }}>
            <span style={{fontSize:32, marginRight:8}}>📝</span> Create New Job
          </h2>
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-4 shadow-sm border">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Job Title *</label>
                <input type="text" className="form-control rounded-3" name="title" value={form.title} onChange={handleChange} required maxLength={150} placeholder="e.g. ReactJS Developer" />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Category</label>
                <input type="text" className="form-control rounded-3" name="category" value={form.category} onChange={handleChange} maxLength={100} placeholder="e.g. Information Technology" />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Job Description</label>
                <textarea className="form-control rounded-3" name="description" rows={7} style={{minHeight: 180}} value={form.description} onChange={handleChange} placeholder="Detailed job description..." />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Location</label>
                <select className="form-select rounded-3" name="location" value={form.location} onChange={handleChange} required>
                  <option value="">Select province/city</option>
                  {locationOptions.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Salary Range</label>
                <input type="text" className="form-control rounded-3" name="salaryRange" value={form.salaryRange} onChange={handleChange} maxLength={100} placeholder="e.g. 15-20 million" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Job Type *</label>
                <select className="form-select rounded-3" name="jobType" value={form.jobType} onChange={handleChange} required>
                  <option value="">Select job type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="onsite">Onsite</option>
                  <option value="remote">Remote</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Required Degree</label>
                <select className="form-select rounded-3" name="requiredDegree" value={form.requiredDegree} onChange={handleChange}>
                  <option value="">Select degree</option>
                  {degreeOptions.map((deg) => (
                    <option key={deg} value={deg}>{deg}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Minimum Experience (years)</label>
                <input type="number" className="form-control rounded-3" name="minExperience" value={form.minExperience} onChange={handleChange} min={0} placeholder="e.g. 1" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Expiration Date</label>
                <input type="date" className="form-control rounded-3" name="endAt" value={form.endAt} onChange={handleChange} min={minDate} required />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Required Skills <span className="text-muted">(comma separated)</span></label>
                <input type="text" className="form-control rounded-3" name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="React, Node.js, SQL" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Status</label>
                <input type="text" className="form-control rounded-3" name="status" value="Active" disabled readOnly />
              </div>
              <div className="col-12 text-center mt-4">
                <button type="submit" className="btn btn-primary px-5 py-2 rounded-3 fw-bold" style={{ fontSize: "1.1rem", boxShadow: "0 2px 8px #2a3b6a33" }} disabled={loading}>
                  {loading ? "Posting..." : "Create Job"}
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
