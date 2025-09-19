"use client";
import { useEffect, useState } from "react";
import { getCompanyByEmployerId } from "@/lib/company/api";
import { useParams } from "next/navigation";
/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import { useSession } from "next-auth/react";
import FeaturedSlider from "@/components/sliders/Featured";
import ApplyJob from "@/features/applicants/components/ApplyJob";
import { applicantService } from "@/features/applicants/services/applicant.service";
import { toast } from "react-toastify";


export default function JobDetails2() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [modalJob, setModalJob] = useState<any>(null); // 👈 Fix: declare modalJob state
  const [resumes, setResumes] = useState<any[]>([]); // 👈 Optional: declare resumes if needed

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/job-postings/${id}`)
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch(() => setJob(null));
  }, [id]);
// lấy thông tin bài đăng

  const [active, setActive] = useState(1);
  
    const handleOnClick = (index: number) => {
      setActive(index);
    };
    const { data: session } = useSession();
      const role = session?.user?.roles;
      // Hook lấy dữ liệu job từ API
      const [jobs, setJobs] = useState<any[]>([]);
      const [jobsLoading, setJobsLoading] = useState(false);
      const [jobsError, setJobsError] = useState("");
  
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

      // Helper: robustly parse createdAt value from API (supports ms, seconds, ISO string)
      const parseToDate = (val: any): Date | null => {
        if (!val && val !== 0) return null;
        if (typeof val === 'number') {
          return new Date(val > 1e12 ? val : val * 1000);
        }
        if (typeof val === 'string') {
          const num = Number(val);
          if (!isNaN(num)) return new Date(num > 1e12 ? num : num * 1000);
          const d = new Date(val);
          if (!isNaN(d.getTime())) return d;
        }
        return null;
      };

      const formatCreatedAt = (date: Date) => {
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes} mins ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hrs ago`;
        // show readable date for older posts
        return date.toLocaleDateString();
      };

  useEffect(() => {
    if (!job?.employerId) return;
    (async () => {
      try {
        const data = await getCompanyByEmployerId(job.employerId);
        setCompany(data);
      } catch {
        setCompany(null);
      }
    })();
  }, [job?.employerId]);
  return (
    <>
      <Layout>
        <div>
          <section className="section-box mt-50">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-md-12 col-sm-12 col-12">
                  <div className="box-border-single">
                    {/* JOB DETAIL: DỮ LIỆU TỪ API */}
                    {!job ? (
                      <div>Loading...</div>
                    ) : (
                      <>
                        <div className="row mt-10">
                          <div className="col-lg-8 col-md-12">
                            <h3>{job.title}</h3>
                            <div className="mt-0 mb-15">
                              {job.jobType && <span className="card-briefcase">{job.jobType}</span>}
                              {job.createdAt && <span className="card-time">{new Date(job.createdAt).toLocaleDateString()}</span>}
                            </div>
                              <button
                                onClick={() => setModalJob(job)} // 👈 Fix: open modal by setting modalJob
                                className="btn-apply"
                              >
                                Apply 
                              </button>
                              
                           
                          </div>
                        </div>
                        <div className="border-bottom pt-10 pb-10" />
                        <div className="job-overview">
                          <h5 className="border-bottom pb-15 mb-30">Employment Information</h5>
                          <div className="row" style={{rowGap: '18px', columnGap: '0'}}>
                            {job.title && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Title icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Title</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.title}</span>
                              </div>
                            )}
                            {job.location && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Location icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10z" stroke="#8a94a6" strokeWidth="1.5"/><circle cx="12" cy="11" r="2.5" stroke="#8a94a6" strokeWidth="1.5"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Location</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.location}</span>
                              </div>
                            )}
                            {job.salaryRange && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Salary icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#8a94a6" strokeWidth="1.5"/><path d="M8 12h4a2 2 0 1 0 0-4h-2a2 2 0 1 1 0-4h4" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Salary</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.salaryRange}</span>
                              </div>
                            )}
                            {job.jobType && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Job Type icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><path d="M16 3v4M8 3v4" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Job Type</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.jobType}</span>
                              </div>
                            )}
                            {job.category && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Category icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><path d="M16 3v4M8 3v4" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Category</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.category}</span>
                              </div>
                            )}
                            {job.requiredSkills && job.requiredSkills.length > 0 && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Skills icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><path d="M7 10h10M7 14h6" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Required Skills</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.requiredSkills.join(", ")}</span>
                              </div>
                            )}
                            {typeof job.minExperience !== 'undefined' && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Experience icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#8a94a6" strokeWidth="1.5"/><path d="M12 6v6l4 2" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Min Experience</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.minExperience} years</span>
                              </div>
                            )}
                            {job.requiredDegree && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Degree icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 3L2 9l10 6 10-6-10-6z" stroke="#8a94a6" strokeWidth="1.5"/><path d="M2 17l10 6 10-6" stroke="#8a94a6" strokeWidth="1.5"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Required Degree</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.requiredDegree}</span>
                              </div>
                            )}
                            {job.createdAt && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Created At icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><path d="M16 2v4M8 2v4" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 10h18" stroke="#8a94a6" strokeWidth="1.5"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Created At</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{new Date(job.createdAt).toLocaleDateString()}</span>
                              </div>
                            )}
                            {job.endAt && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Deadline icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><path d="M16 2v4M8 2v4" stroke="#8a94a6" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 10h18" stroke="#8a94a6" strokeWidth="1.5"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Expiration date</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{new Date(job.endAt).toLocaleDateString()}</span>
                              </div>
                            )}
            
                            {job.employer && job.employer.name && (
                              <div className="col-md-6 d-flex align-items-center" style={{minHeight: '38px'}}>
                                <span style={{width: 32, textAlign: 'center', display: 'inline-block'}}>
                                  {/* Employer icon */}
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#8a94a6" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="#8a94a6" strokeWidth="1.5"/></svg>
                                </span>
                                <span style={{color:'#8a94a6', minWidth: 110, marginLeft: 8}}>Employer</span>
                                <span style={{fontWeight:600, marginLeft: 8}}>{job.employer.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="content-single" style={{background:'#fff',border:'1.5px solid #e5e8ec',borderRadius:16,padding:'28px 32px',margin:'32px 0',fontSize:'1.08rem',lineHeight:1.7,boxShadow:'0 2px 12px 0 rgba(0,0,0,0.03)'}}>
                          <h5 className="border-bottom pb-15 mb-30">Job Description</h5>
                          <div dangerouslySetInnerHTML={{ __html: job.description ? job.description.replace(/\n/g, '<br>') : '' }} />
                        </div>
                        <div className="author-single">
                          <span>{job.employerName}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                   {modalJob && (
                            <ApplyJob
                              job={modalJob}
                              resumes={resumes} // 👈 truyền resumes vào
                              onClose={() => setModalJob(null)}
                              onSuccess={() => toast.success("Applied successfully!")}
                            />
                          )}
                          
                <div className="col-lg-4 col-md-12 col-sm-12 col-12 pl-40 pl-lg-15 mt-lg-30">
                  {/* <div className="sidebar-border">
                    <div className="sidebar-heading">
                      <div className="avatar-sidebar">
                        <figure>
                          <img alt="jobBox" src={ company?.logoUrl ||"/assets/imgs/page/job-single/avatar.png"} />
                        </figure>
                        <div className="sidebar-info">
                          <span className="sidebar-company">{company?.companyName || "Company"}</span>
                          <span className="card-location">{company?.location || "Unknown"}</span>
                          {company?.openJobs && (
                            <Link href="#">
                              <span className="link-underline mt-15">{company.openJobs} Open Jobs</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="sidebar-list-job">
                      <div className="box-map">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.3150609575905!2d-87.6235655!3d41.886080899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca8b34afe61%3A0x6caeb5f721ca846!2s205%20N%20Michigan%20Ave%20Suit%20810%2C%20Chicago%2C%20IL%2060601%2C%20Hoa%20K%E1%BB%B3!5e0!3m2!1svi!2s!4v1658551322537!5m2!1svi!2s" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                      </div>
                      <ul className="ul-disc">
                        <li>205 North Michigan Avenue, Suite 810 Chicago, 60601, USA</li>
                        <li>Phone: (123) 456-7890</li>
                        <li>Email: contact@Evara.com</li>
                      </ul>
                    </div>
                  </div> */}
                  <div className="sidebar-border">
                  <div className="sidebar-heading">
                    <div className="avatar-sidebar">
                      {/* <figure>
                        <img alt="jobBox" src={company?.logoUrl || "/assets/imgs/page/job-single/avatar.png"} />
                      </figure> */}
                      <figure style={{ width: 60, height: 60, borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img
                            alt="jobBox"
                            src={company?.logoUrl || "/assets/imgs/page/job-single/avatar.png"}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain", // ảnh vừa khung, không bị crop
                              display: "block"
                            }}
                          />
                        </figure>
                      {/* <div className="sidebar-info">
                        <Link href={`/company-details/${company.id}`}>
                          <span className="sidebar-company">{company?.companyName || "Company"}</span>
                        </Link>
                        <span className="card-location">{company?.location || company?.address || "Unknown"}</span>
                        {company?.openJobs && (
                          <Link href="#">
                            <span className="link-underline mt-15">{company.openJobs} Open Jobs</span>
                          </Link>
                        )}
                      </div> */}
                      <div className="sidebar-info">
                        {company?.id ? (
                          <Link href={`/company-details/${company.id}`}>
                            <span className="sidebar-company">{company.companyName || "Company"}</span>
                          </Link>
                        ) : (
                          <span className="sidebar-company">{company?.companyName || "Company"}</span>
                        )}
                        <span className="card-location">{company?.location || company?.address || "Unknown"}</span>
                        {company?.openJobs && (
                          <Link href="#">
                            <span className="link-underline mt-15">{company.openJobs} Open Jobs</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="sidebar-list-job">
                    <div className="box-map">
                      <iframe
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          `${company?.address || ""} ${company?.location || ""}`
                        )}&output=embed`}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        style={{ width: "100%", height: "200px", border: 0, borderRadius: "8px" }}
                      />
                    </div>
                    <ul className="ul-disc">
                      {company?.address && <li>{company.address}</li>}
                      {company?.phone && <li>Phone: {company.phone}</li>}
                      {company?.email && <li>Email: {company.email}</li>}
                    </ul>
                  </div>
                </div>
                  <div className="sidebar-border">
                    <h6 className="f-18">Similar jobs</h6>
                    <div className="sidebar-list-job">
                      {jobsLoading && <div className="py-3">Đang tải...</div>}
                      {jobsError && <div className="py-3 text-danger">{jobsError}</div>}
                      {!jobsLoading && !jobsError && jobs.length === 0 && <div className="py-3">Không có công việc tương tự</div>}
                      {!jobsLoading && !jobsError && jobs.length > 0 && (
                        <ul>
                          {(() => {
                            // determine current employer identifier (id or name)
                            const currentEmployerKey = job?.employer?.id ?? job?.employerId ?? job?.employerName ?? job?.employer?.name ?? null;
                            return jobs
                              .slice()
                              .filter((j: any) => {
                                if (!currentEmployerKey) return false;
                                return (
                                  String(j.employer?.id ?? j.employerId ?? j.employerName ?? j.employer?.name ?? '') === String(currentEmployerKey)
                                );
                              })
                              .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                              .slice(0, 9)
                              .map((j: any) => {
                                const createdDate = parseToDate(j.createdAt);
                                  const timeText = createdDate ? formatCreatedAt(createdDate) : '';
                                return (
                                  <li key={j.id} style={{ marginBottom: 10 }}>
                                    <div
                                      className="card-list-4 wow animate__animated animate__fadeIn hover-up"
                                      style={{ minHeight: 88, display: 'flex', gap: 10, padding: '8px' }}
                                    >
                                      <div className="image" style={{ width: 44, flex: '0 0 44px' }}>
                                        <Link href={`/job-details-2/${j.id}`}>
                                          <span
                                            style={{
                                              display: 'inline-block',
                                              width: '44px',
                                              height: '44px',
                                              borderRadius: '8px',
                                              overflow: 'hidden',
                                              backgroundColor: '#f9f9f9', // thêm nền để dễ nhìn nếu ảnh nhỏ
                                            }}
                                          >
                                            <img
                                              src={company?.logoUrl || '/assets/imgs/brands/brand-8.png'}
                                              alt={j.companyName || 'jobBox'}
                                              style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain', // co ảnh lại vừa khung, không crop
                                              }}
                                            />
                                          </span>
                                        </Link>
                                      </div>
                                      <div className="info-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                                        <div>
                                          <h5 className="font-md font-bold color-brand-1" style={{ fontSize: '0.95rem', marginBottom: 6 }}>
                                            <Link href={`/job-details-2/${j.id}`}>
                                              <span>{j.title || 'No title'}</span>
                                            </Link>
                                          </h5>
                                          <div className="mt-0" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <span className="card-briefcase" style={{ fontSize: '0.82rem' }}>{j.jobType || 'Fulltime'}</span>
                                            <span className="card-time" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                                              <span>{timeText}</span>
                                            </span>
                                          </div>
                                        </div>
                                        <div className="mt-5">
                                          <div className="row">
                                            <div className="col-12 text-end">
                                              <span className="card-briefcase" style={{ fontSize: '0.82rem' }}>{j.location || 'Unknown'}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              });
                          })()}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="sidebar-border">
                    <h6 className="f-18">Tags</h6>
                    <div className="sidebar-list-job">
                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">App</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Digital</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Marketing</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Conten Writer</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Sketch</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">PSD</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Laravel</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">React JS</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">HTML</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Finance</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Manager</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Business</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-50">
            <div className="container">
              <div className="text-left">
                <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Featured Jobs</h2>
                <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Get the latest news, updates and tips</p>
              </div>
              <div className="mt-50">
                <div className="box-swiper style-nav-top">
                  <FeaturedSlider />
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-20">
            <div className="container">
              <div className="box-newsletter">
                <div className="row">
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img src="/assets/imgs/template/newsletter-left.png" alt="joxBox" />
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
                    <img src="/assets/imgs/template/newsletter-right.png" alt="joxBox" />
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