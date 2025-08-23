"use client";
import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// ...existing code...

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  // Không cần lấy employerId từ session nữa

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setMessage("");
      try {
        console.log("session:", session);
        console.log("accessToken:", accessToken);
        if (!session) {
          setJobs([]);
          setLoading(false);
          return;
        }
        const res = await fetch("http://localhost:8080/api/job-postings/all", {
          headers: {
            ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("jobs data:", data);
            // Lọc job theo employerId (luôn lọc thủ công phía FE)
            const employerId = session?.user?.id;
            console.log("employerId:", employerId);
            let jobsArray = Array.isArray(data) ? data : (data.jobs || []);
            const filteredJobs = jobsArray.filter((job: any) => job.employerId === employerId);
            console.log("filteredJobs:", filteredJobs);
            setJobs(filteredJobs);
        } else {
          setMessage("Lỗi khi lấy danh sách job");
        }
      } catch (error) {
        setMessage("Lỗi kết nối API!");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [accessToken, session]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xoá job này?")) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:8080/api/job-postings/${id}`, { 
          method: "DELETE", 
          headers: { 
            ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}), 
          }, 
        });
      if (res.ok) {
        setJobs(jobs.filter((job: any) => job.id !== id));
        setMessage("Xoá job thành công!");
      } else {
        setMessage("Lỗi khi xoá job");
      }
    } catch (error) {
      setMessage("Lỗi kết nối API!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container pt-100 pb-100">
        {!session ? (
          <div className="text-center mt-5">
            <h2>Bạn cần đăng nhập để xem danh sách việc làm đã đăng</h2>
            <Link href="/page-signin" className="btn btn-primary mt-3">Đăng nhập</Link>
          </div>
        ) : (
          <>
            <h2 className="mb-4">Danh sách việc làm đã đăng</h2>
            <Link href="/job-create" className="btn btn-primary mb-3">+ Đăng việc mới</Link>
            {message && <div className="mb-3 text-danger">{message}</div>}
            {loading ? (
              <div>Đang tải...</div>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Trạng thái</th>
                    <th>Ngày hết hạn</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job: any) => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{job.status === "active" ? "Đang tuyển" : "Đã đóng"}</td>
                      <td>{job.endAt}</td>
                      <td>
                        <Link href={`/job-edit/${job.id}`} className="btn btn-sm btn-warning me-2">Sửa</Link>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(job.id)}>Xoá</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}