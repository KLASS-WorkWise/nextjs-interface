"use client";
import Layout from "@/components/Layout/Layout";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface JobForm {
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  jobType: string;
  category: string;
  requiredSkills: string;
  minExperience: string | number;
  requiredDegree: string;
  endAt: string;
  status: string;
}

export default function JobEdit() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const { id } = useParams();
  const [form, setForm] = useState<JobForm>({
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
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setMessage("");
      try {
        const res = await fetch(`http://localhost:8080/api/job-postings/${id}` , {
          headers: {
            ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setForm({
            ...data,
            requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills.join(", ") : "",
            minExperience: data.minExperience ? String(data.minExperience) : "",
            endAt: data.endAt ? data.endAt.slice(0, 10) : "",
          });
        } else {
          setMessage("Lỗi khi lấy dữ liệu job");
        }
      } catch (error) {
        setMessage("Lỗi kết nối API!");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id, accessToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const payload = {
      ...form,
      requiredSkills: form.requiredSkills.split(",").map((s: string) => s.trim()).filter(Boolean),
      minExperience: form.minExperience ? Number(form.minExperience) : null,
    };
    try {
      const res = await fetch(`http://localhost:8080/api/job-postings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage("Cập nhật việc làm thành công!");
      } else {
        const err = await res.json();
        setMessage("Lỗi: " + (err.message || "Không thể cập nhật việc làm"));
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
        <h2 className="mb-4">Chỉnh sửa việc làm</h2>
        {message && <div className="mb-3 text-danger">{message}</div>}
        {loading ? (
          <div>Đang tải...</div>
        ) : (
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
            <button type="submit" className="btn btn-primary" disabled={loading}>Cập nhật việc làm</button>
          </form>
        )}
      </div>
    </Layout>
  );
}
