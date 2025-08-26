/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import BlogSlider from "@/components/sliders/Blog";
import { useSession } from "next-auth/react";

import { toast } from "react-toastify";


import "@/styles/globals.css";
import { applyService } from "@/services/applyService";

// Tách Modal ra component riêng
// Tách Modal ra component riêng
function ApplyModal({
  job,
  resumes,
  selectedResumeId,
  setSelectedResumeId,
  resumeLink,
  setResumeLink,
  setFile,
  message,
  setMessage,
  progress,
  submitting,
  onClose,
  onSubmit,
}: any) {
  const [resumeType, setResumeType] = useState<"saved" | "upload" | "link">("saved");

  return (
    <div className="modal-overlay" style={{ zIndex: 9999, background: "rgba(30,41,59,0.25)", position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="modal-box card-grid-2" style={{ maxWidth: 520, width: "100%", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", background: "#fff", padding: 40, position: "relative", border: "1px solid #e5e7eb" }}>
        <button className="modal-close btn btn-grey-small" onClick={onClose} style={{ position: "absolute", top: 18, right: 18, fontSize: 22, border: "none", background: "none", cursor: "pointer", color: "#334155" }}>
          <span aria-label="Đóng">&times;</span>
        </button>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 className="modal-title mb-0" style={{ fontWeight: 800, fontSize: 26, color: "#1e293b", letterSpacing: "-1px" }}>
            Apply for <span className="highlight" style={{ color: "#2563eb" }}>{job.jobTitle}</span>
          </h2>
        </div>
        {/* Chọn loại resume */}
        <div className="mb-20" style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <label>
            <input type="radio" name="resumeType" value="saved" checked={resumeType === "saved"} onChange={() => setResumeType("saved")} />
            <span style={{ marginLeft: 6 }}>Resume có sẵn</span>
          </label>
          <label>
            <input type="radio" name="resumeType" value="upload" checked={resumeType === "upload"} onChange={() => setResumeType("upload")} />
            <span style={{ marginLeft: 6 }}>Upload File</span>
          </label>
          <label>
            <input type="radio" name="resumeType" value="link" checked={resumeType === "link"} onChange={() => setResumeType("link")} />
            <span style={{ marginLeft: 6 }}>Resume Link</span>
          </label>
        </div>
        {/* Hiển thị trường theo lựa chọn */}
        {resumeType === "saved" && (
          <div className="mb-18">
            <label className="font-sm color-brand-1 mb-5" style={{ fontWeight: 600 }}>Resume có sẵn</label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="form-input"
              style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 15 }}
            >
              <option value="">-- Chọn Resume --</option>
              {resumes.map((resume: any) => (
                <option key={resume.id} value={resume.id}>
                  {resume.title || `Resume #${resume.id}`}
                </option>
              ))}
            </select>
          </div>
        )}
        {resumeType === "upload" && (
          <div className="mb-18">
            <label className="font-sm color-brand-1 mb-5" style={{ fontWeight: 600 }}>Upload Resume File</label>
            <input
              type="file"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) setFile(selectedFile);
              }}
              className="form-input"
              style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 15 }}
            />
          </div>
        )}
        {resumeType === "link" && (
          <div className="mb-18">
            <label className="font-sm color-brand-1 mb-5" style={{ fontWeight: 600 }}>Resume Link</label>
            <input
              type="text"
              placeholder="Nhập link resume"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              className="form-input"
              style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 15 }}
            />
          </div>
        )}
        <div className="mb-18">
          <label className="font-sm color-brand-1 mb-5" style={{ fontWeight: 600 }}>Cover Letter</label>
          <textarea
            placeholder="Viết cover letter..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-input"
            rows={4}
            style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 15 }}
          />
        </div>
        {progress > 0 && (
          <div className="progress-bar mb-15" style={{ height: 8, background: "#e0e7ef", borderRadius: 4 }}>
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                background: "#2563eb",
                height: "100%",
                borderRadius: 4,
                transition: "width 0.3s",
              }}
            ></div>
          </div>
        )}
        <div className="modal-actions mt-20" style={{ display: "flex", justifyContent: "flex-end", gap: 14 }}>
          <button className="btn btn-grey-small" onClick={onClose} style={{ minWidth: 90, borderRadius: 8, fontWeight: 600, fontSize: 15, background: "#f3f4f6", color: "#334155", border: "1px solid #e5e7eb", transition: "background 0.2s" }}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onSubmit} disabled={submitting} style={{ minWidth: 90, borderRadius: 8, fontWeight: 600, fontSize: 15, background: submitting ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", boxShadow: submitting ? "none" : "0 2px 8px rgba(37,99,235,0.08)", transition: "background 0.2s" }}>
            {submitting ? "Applying..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default function JobGrid() {
  const { data: session } = useSession();
  const role = session?.user?.roles;
  // Hook lấy dữ liệu job từ API
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");

  const [modalJob, setModalJob] = useState<any | null>(null);

  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [resumeLink, setResumeLink] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      setJobsLoading(true);
      setJobsError("");
      try {
        const res = await fetch("http://localhost:8080/api/job-postings/all");
        if (!res.ok) throw new Error("Không thể lấy danh sách công việc");
        const data = await res.json();
        setJobs(data);
      } catch (err: any) {
        setJobsError(err.message || "Lỗi không xác định");
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await applyService.getAllResumes();
        setResumes(Array.isArray(res) ? res : res.data || []);
      } catch (err) {
        console.error("Error fetching resumes:", err);
      }
    };
    fetchResumes();
  }, []);

  const handleApply = async (jobId: number) => {
    if (!selectedResumeId && !resumeLink && !file) {
      toast.error("Vui lòng chọn Resume có sẵn hoặc nhập link hoặc upload file!");
      return;
    }

    try {
      setSubmitting(true);
      setProgress(0);

      const formData = new FormData();
      if (selectedResumeId) formData.append("resumesId", selectedResumeId);
      if (resumeLink) formData.append("resumeLink", resumeLink);
      if (file) formData.append("resumeFile", file);
      if (message) formData.append("coverLetter", message);

      const res =  await applyService.applyJobWithFile(jobId, formData, {
        onUploadProgress: (event: ProgressEvent) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });

       toast.success("✅ Applied successfully!");
         // ⚠️ cảnh báo nếu thiếu skill / kinh nghiệm
  
    if (res.data.missingSkills?.length) {
      toast.warning("Thiếu kỹ năng: " + res.data.missingSkills.join(", "));
    }

    // ⚠️ Hiển thị cảnh báo kinh nghiệm
    if (res.data.minExperience) {
      toast.info(res.data.minExperience);
    }

    console.log("Apply job skills:", res.data.missingSkills);
      console.log("Apply job response:", res.data.minExperience);
 

      setResumeLink("");
      setMessage("");
      setFile(null);
      setSelectedResumeId("");
      setModalJob(null);
      setProgress(0);
    } catch (err: any) {
      console.error("Apply job failed:", err);

      const msg = err.response?.data?.message || "❌ Apply thất bại!";
      toast.error(msg);
      setProgress(0);

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Layout>
        <div>
          <section className="section-box-2">
            <div className="container">
              <div className="banner-hero banner-single banner-single-bg">
                <div className="block-banner text-center">
                  <h3 className="wow animate__animated animate__fadeInUp">
                    <span className="color-brand-2">22 Jobs</span> Available Now
                  </h3>
                  <div className="font-sm color-text-paragraph-2 mt-10 wow animate__animated animate__fadeInUp" data-wow-delay=".1s">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, <br className="d-none d-xl-block" />
                    atque delectus molestias quis?
                  </div>
                  <div className="form-find text-start mt-40 wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
                    <form>
                      <div className="box-industry">
                        <select className="form-input mr-10 select-active input-industry">
                          <option value={0}>Industry</option>
                          <option value={1}>Software</option>
                          <option value={2}>Finance</option>
                          <option value={3}>Recruting</option>
                          <option value={4}>Management</option>
                          <option value={5}>Advertising</option>
                          <option value={6}>Development</option>
                        </select>
                      </div>
                      <div className="box-industry">
                        <select className="form-input mr-10 select-active input-location">
                          <option value="">Location</option>
                          <option value="AX">Aland Islands</option>
                          <option value="AF">Afghanistan</option>
                          <option value="AL">Albania</option>
                          <option value="DZ">Algeria</option>
                          <option value="AD">Andorra</option>
                          <option value="AO">Angola</option>
                          <option value="AI">Anguilla</option>
                          <option value="AQ">Antarctica</option>
                          <option value="AG">Antigua and Barbuda</option>
                          <option value="AR">Argentina</option>
                          <option value="AM">Armenia</option>
                          <option value="AW">Aruba</option>
                          <option value="AU">Australia</option>
                          <option value="VN">Vietnam</option>
                        </select>
                      </div>
                      <input className="form-input input-keysearch mr-10" type="text" placeholder="Your keyword... " />
                      <button className="btn btn-default btn-find font-sm">Search</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-30">
            <div className="container">
              <div className="row flex-row-reverse">
                <div className="col-lg-9 col-md-12 col-sm-12 col-12 float-right">
                  <div className="content-page">
                    <div className="box-filters-job">
                      <div className="row">
                        <div className="col-xl-6 col-lg-5">
                          <span className="text-small text-showing">
                            Showing <strong>41-60 </strong>of <strong>944 </strong>jobs
                          </span>
                        </div>

                        <div className="col-xl-6 col-lg-7 text-lg-end mt-sm-15 ">
                          <div className="display-flex2">
                            {role?.includes("Employers") && (
                              <>
                                <Link href="/job-create">
                                  <button className="btn btn-primary" style={{ marginRight: "16px" }}>
                                    Create Job
                                  </button>
                                </Link>
                                <Link href="/dashboard-employers/my-jobs">
                                  <button className="btn btn-secondary" style={{ marginRight: "16px" }}>
                                    Manage Jobs
                                  </button>
                                </Link>
                              </>
                            )}

                            <div className="box-border mr-10">
                              <span className="text-sortby">Show:</span>
                              <div className="dropdown dropdown-sort">
                                <button className="btn dropdown-toggle" id="dropdownSort" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-display="static">
                                  <span>12</span>
                                  <i className="fi-rr-angle-small-down" />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownSort">
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item active">10</span>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item">12</span>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item">20</span>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="box-border">
                              <span className="text-sortby">Sort by:</span>
                              <div className="dropdown dropdown-sort">
                                <button className="btn dropdown-toggle" id="dropdownSort2" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-display="static">
                                  <span>Newest Post</span>
                                  <i className="fi-rr-angle-small-down" />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownSort2">
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item active">Newest Post</span>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item">Oldest Post</span>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item">Rating Post</span>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="box-view-type">
                              <Link href="/jobs-list">
                                <span className="view-type">
                                  <img src="assets/imgs/template/icons/icon-list.svg" alt="jobBox" />
                                </span>
                              </Link>

                              <Link href="/jobs-grid">
                                <span className="view-type">
                                  <img src="assets/imgs/template/icons/icon-grid-hover.svg" alt="jobBox" />
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      {/* Render động danh sách job từ API cho candidate */}
                      {jobsLoading && <div className="col-12 text-center">Đang tải dữ liệu...</div>}
                      {jobsError && <div className="col-12 text-center text-danger">{jobsError}</div>}
                      {!jobsLoading && !jobsError && jobs.length === 0 && <div className="col-12 text-center">Không có công việc nào</div>}
                      {!jobsLoading && !jobsError && jobs.length > 0 && jobs.map((job: any) => (
                        <div key={job.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                          <div className="card-grid-2 hover-up">
                            <div className="card-grid-2-image-left">
                              <span className="flash" />
                              <div className="image-box">
                                <img src={job.companyLogo || "assets/imgs/brands/brand-1.png"} alt="jobBox" />
                              </div>
                              <div className="right-info">
                                <Link href={`/company-details/${job.companyId || ""}`}>
                                  <span className="name-job">{job.companyName || "Company"}</span>
                                </Link>
                                <span className="location-small">{job.location || "Unknown"}</span>
                              </div>
                            </div>
                            <div className="card-block-info">
                              <h6>
                                <Link href={`/job-details-2/${job.id}`}>
                                  <span>{job.title || "No title"}</span>
                                </Link>
                              </h6>
                              <div className="mt-5">
                                <span className="card-briefcase">{job.type || "Fulltime"}</span>
                                <span className="card-time">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}</span>
                              </div>
                              <p className="font-sm color-text-paragraph mt-15">{job.description || "Không có mô tả"}</p>
                              <div className="mt-30">
                                {Array.isArray(job.skills) && job.skills.map((skill: string, idx: number) => (
                                  <span key={idx} className="btn btn-grey-small mr-5">{skill}</span>
                                ))}
                              </div>
                              <div className="card-2-bottom mt-30">
                                <div className="row">
                                  <div className="col-lg-7 col-7">
                                    <span className="card-text-price">{job.salary || "N/A"}</span>
                                    <span className="text-muted">/Tháng</span>
                                  </div>
                                  <div className="col-lg-5 col-5 text-end">
                                       <button onClick={() => setModalJob(job)} className="btn-apply">
                                  Apply Now
                                </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                  <div className="paginations">
                    <ul className="pager">
                      <li>
                        <a className="pager-prev" href="#" />
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number">1</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number">2</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number">3</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number">4</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number">5</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number active">6</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number">7</span>
                        </Link>
                      </li>
                      <li>
                        <a className="pager-next" href="#" />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12 col-12">
                  <div className="sidebar-shadow none-shadow mb-30">
                    <div className="sidebar-filters">
                      <div className="filter-block head-border mb-30">
                        <h5>
                          Advance Filter
                          <Link href="#">
                            <span className="link-reset">Reset</span>
                          </Link>
                        </h5>
                      </div>
                      <div className="filter-block mb-30">
                        <div className="form-group select-style select-style-icon">
                          <select className="form-control form-icons select-active">
                            <option>New York, US</option>
                            <option>London</option>
                            <option>Paris</option>
                            <option>Berlin</option>
                          </select>
                          <i className="fi-rr-marker" />
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-15">Industry</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">All</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">180</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Software</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">12</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Finance</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">23</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Recruting</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">43</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Management</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">65</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Advertising</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">76</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-25">Salary Range</h5>
                        <div className="list-checkbox pb-20">
                          <div className="row position-relative mt-10 mb-20">
                            <div className="col-sm-12 box-slider-range">
                              <div id="slider-range" />
                            </div>
                            <div className="box-input-money">
                              <input className="input-disabled form-control min-value-money" type="text" name="min-value-money" disabled={true} defaultValue="" />
                              <input className="form-control min-value" type="hidden" name="min-value" defaultValue="" />
                            </div>
                          </div>
                          <div className="box-number-money">
                            <div className="row mt-30">
                              <div className="col-sm-6 col-6">
                                <span className="font-sm color-brand-1">$0</span>
                              </div>
                              <div className="col-sm-6 col-6 text-end">
                                <span className="font-sm color-brand-1">$500</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group mb-20">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">All</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">145</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$0k - $20k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">56</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$20k - $40k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">37</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$40k - $60k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">75</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Popular Keyword</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Software</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">24</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Developer</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">45</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Web</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">57</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Position</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Senior</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">12</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Junior</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">35</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Fresher</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">56</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Experience Level</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Internship</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">56</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Entry Level</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">87</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Associate</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">24</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Mid Level</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">45</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Director</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">76</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Executive</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">89</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Onsite/Remote</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">On-site</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">12</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Remote</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">65</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Hybrid</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">58</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Job Posted</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">All</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">78</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">1 day</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">65</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">7 days</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">24</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">30 days</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">56</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-15">Job type</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Full Time</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">25</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Part Time</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">64</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Remote Jobs</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">78</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Freelancer</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">97</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </section>
             {/* Popup Modal */}
      {modalJob && (
        <ApplyModal
          job={modalJob}
          resumes={resumes}
          selectedResumeId={selectedResumeId}
          setSelectedResumeId={setSelectedResumeId}
          resumeLink={resumeLink}
          setResumeLink={setResumeLink}
          file={file}
          setFile={setFile}
          message={message}
          setMessage={setMessage}
          progress={progress}
          submitting={submitting}
          onClose={() => setModalJob(null)}
          onSubmit={() => handleApply(modalJob.id)}
        />
      )}
          <section className="section-box mt-50 mb-50">
            <div className="container">
              <div className="text-start">
                <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">News and Blog</h2>
                <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Get the latest news, updates and tips</p>
              </div>
            </div>
            <div className="container">
              <div className="mt-50">
                <div className="box-swiper style-nav-top">
                  <BlogSlider />
                </div>
                <div className="text-center">
                  <Link href="blog-grid">
                    <span className="btn btn-brand-1 btn-icon-load mt--30 hover-up">Load More Posts</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-20">
            <div className="container">
              <div className="box-newsletter">
                <div className="row">
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img src="assets/imgs/template/newsletter-left.png" alt="joxBox" />
                  </div>
                  <div className="col-lg-12 col-xl-6 col-12">
                    <h2 className="text-md-newsletter text-center">
                      New Things Will Always
                      <br /> Update Regularly
                    </h2>
                    <div className="box-form-newsletter mt-40">
                      <form className="form-newsletter">
                        <input className="input-newsletter" type="text" placeholder="Enter your email here" />
                        <button className="btn btn-default font-heading icon-send-letter">Subscribe</button>
                      </form>
                    </div>
                  </div>
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img src="assets/imgs/template/newsletter-right.png" alt="joxBox" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}