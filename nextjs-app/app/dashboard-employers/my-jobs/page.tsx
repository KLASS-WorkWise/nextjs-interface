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
            <h2 className="mb-4 text-center fw-bold" style={{ color: '#2a3b6a' }}>
              <span style={{fontSize:32, marginRight:8}}>📋</span> My Posted Jobs
            </h2>
            <div className="d-flex justify-content-end mb-3">
              <Link href="/job-create" className="btn btn-success fw-bold px-4 py-2">
                + Create New Job
              </Link>
            </div>
            {message && <div className="mb-3 text-danger text-center">{message}</div>}
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : jobs.length === 0 ? (
              <div className="alert alert-info text-center">No jobs found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle shadow-sm border rounded-4 overflow-hidden">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Salary</th>
                      <th>Job Type</th>
                      <th>Status</th>
                      <th>Expiration</th>
                      <th>Degree</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job: any) => (
                      <tr key={job.id}>
                        <td className="fw-semibold" style={{maxWidth:180}}>{job.title}</td>
                        <td>{job.category || <span className="text-muted">-</span>}</td>
                        <td>{job.location || <span className="text-muted">-</span>}</td>
                        <td>{job.salaryRange || <span className="text-muted">-</span>}</td>
                        <td>
                          <span className="badge bg-info text-dark text-capitalize">{job.jobType || '-'}</span>
                        </td>
                        <td>
                          {String(job.status).toLowerCase() === 'active' ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-secondary">Closed</span>
                          )}
                        </td>
                        <td>{job.endAt ? job.endAt.slice(0,10) : <span className="text-muted">-</span>}</td>
                        <td>{job.requiredDegree || <span className="text-muted">-</span>}</td>
                        <td>
                          <Link href={`/job-edit/${job.id}`} className="btn btn-sm btn-outline-primary me-2 fw-semibold">
                            Edit
                          </Link>
                          <button className="btn btn-sm btn-outline-danger fw-semibold" onClick={() => handleDelete(job.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}