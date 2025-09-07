/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import BlogSlider from "@/components/sliders/Blog";
import { useSession } from "next-auth/react";
import { Bookmark } from "lucide-react";

import "@/styles/globals.css";
import { applyService } from "@/services/applyService";
import { toast } from "react-toastify";
import ApplyJob from "@/features/applicants/components/ApplyJob";
import { useRouter } from "next/navigation";
import { savedJobService } from "@/features/applicants/services/savedJobService";

// Tách Modal ra component riêng

export default function JobGrid() {
  const { data: session } = useSession();
  const role = session?.user?.roles;
  // Hook lấy dữ liệu job từ API
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");

  const [modalJob, setModalJob] = useState<any | null>(null);

  const [resumes, setResumes] = useState<any[]>([]);
  const router = useRouter();
  const [savingJobId, setSavingJobId] = useState<number | null>(null);
  // savedJobs: lưu cả jobId và savedJobId
  const [savedJobs, setSavedJobs] = useState<
    { jobId: number; savedJobId: number }[]
  >([]);

  const toggleSaveJob = async (jobId: number) => {
    if (!session) {
      toast.error("You need to login to saved job!");
      router.push("/page-signin"); // 👈 redirect sang trang login của bạn
      return;
    }
    const existing = savedJobs.find((j) => j.jobId === jobId);
    setSavingJobId(jobId);
    try {
      if (existing) {
        // Unsave dùng savedJobId
        await savedJobService.removeSavedJob(existing.savedJobId);
        setSavedJobs((prev) => prev.filter((j) => j.jobId !== jobId));
        toast.success("Removed successfully");
      } else {
        const res = await savedJobService.saveJob(jobId);
        setSavedJobs((prev) => [
          ...prev,
          { jobId, savedJobId: res.data.savedJobId },
        ]);
        toast.success("Saved successfully");
      }
    } catch (err: any) {
      console.error("Error saving job", err);
      // Nếu 404, vẫn remove khỏi state để UI không treo
      if (err.response?.status === 404 && existing) {
        setSavedJobs((prev) => prev.filter((j) => j.jobId !== jobId));
        toast.error("This job was not saved or already removed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setSavingJobId(null);
    }
  };

  const handleOpenApply = (job: any) => {
    if (!session) {
      toast.error("You need to login to apply!");
      router.push("/page-signin"); // 👈 redirect sang trang login của bạn
      return;
    }
    setModalJob(job);
  };

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
  // Lấy danh sách saved jobs của user
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!session) return;
      try {
        const res = await savedJobService.getMySavedJobs();
        const savedJobsMap =
          res.data?.map((job: any) => ({
            jobId: job.jobPostingResponseDTO?.id, // 👈 lấy id từ DTO
            savedJobId: job.savedJobId,
          })) || [];
        setSavedJobs(savedJobsMap);
      } catch (err) {
        console.error("Error fetching saved jobs", err);
      }
    };
    fetchSavedJobs();
  }, [session]);
  useEffect(() => {
    console.log(
      "Jobs:",
      jobs.map((j) => j.id)
    );
    console.log("SavedJobs:", savedJobs);
  }, [jobs, savedJobs]);

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
                  <div
                    className="font-sm color-text-paragraph-2 mt-10 wow animate__animated animate__fadeInUp"
                    data-wow-delay=".1s"
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Vero repellendus magni, <br className="d-none d-xl-block" />
                    atque delectus molestias quis?
                  </div>
                  <div
                    className="form-find text-start mt-40 wow animate__animated animate__fadeInUp"
                    data-wow-delay=".2s"
                  >
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
                      <input
                        className="form-input input-keysearch mr-10"
                        type="text"
                        placeholder="Your keyword... "
                      />
                      <button className="btn btn-default btn-find font-sm">
                        Search
                      </button>
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
                            Showing <strong>41-60 </strong>of{" "}
                            <strong>944 </strong>jobs
                          </span>
                        </div>

                        <div className="col-xl-6 col-lg-7 text-lg-end mt-sm-15 ">
                          <div className="display-flex2">
                            {role?.includes("Employers") && (
                              <Link href="/job-create">
                                <button
                                  className="btn btn-primary"
                                  style={{ marginRight: "16px" }}
                                >
                                  Create Job
                                </button>
                              </Link>
                            )}

                            <div className="box-border mr-10">
                              <span className="text-sortby">Show:</span>
                              <div className="dropdown dropdown-sort">
                                <button
                                  className="btn dropdown-toggle"
                                  id="dropdownSort"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  data-bs-display="static"
                                >
                                  <span>12</span>
                                  <i className="fi-rr-angle-small-down" />
                                </button>
                                <ul
                                  className="dropdown-menu dropdown-menu-light"
                                  aria-labelledby="dropdownSort"
                                >
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item active">
                                        10
                                      </span>
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
                                <button
                                  className="btn dropdown-toggle"
                                  id="dropdownSort2"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  data-bs-display="static"
                                >
                                  <span>Newest Post</span>
                                  <i className="fi-rr-angle-small-down" />
                                </button>
                                <ul
                                  className="dropdown-menu dropdown-menu-light"
                                  aria-labelledby="dropdownSort2"
                                >
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item active">
                                        Newest Post
                                      </span>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item">
                                        Oldest Post
                                      </span>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item">
                                        Rating Post
                                      </span>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="box-view-type">
                              <Link href="/jobs-list">
                                <span className="view-type">
                                  <img
                                    src="assets/imgs/template/icons/icon-list.svg"
                                    alt="jobBox"
                                  />
                                </span>
                              </Link>

                              <Link href="/jobs-grid">
                                <span className="view-type">
                                  <img
                                    src="assets/imgs/template/icons/icon-grid-hover.svg"
                                    alt="jobBox"
                                  />
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      {/* Render động danh sách job từ API cho candidate */}
                      {jobsLoading && (
                        <div className="col-12 text-center">
                          Đang tải dữ liệu...
                        </div>
                      )}
                      {jobsError && (
                        <div className="col-12 text-center text-danger">
                          {jobsError}
                        </div>
                      )}
                      {!jobsLoading && !jobsError && jobs.length === 0 && (
                        <div className="col-12 text-center">
                          Không có công việc nào
                        </div>
                      )}
                      {!jobsLoading &&
                        !jobsError &&
                        jobs.length > 0 &&
                        jobs.map((job: any) => {
                          const isSaved = savedJobs.some(
                            (j) => j.jobId === job.id
                          );
                          return (
                            <div
                              key={job.id}
                              className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                            >
                              <div className="card-grid-2 hover-up">
                                <div className="card-grid-2-image-left">
                                  <span
                                    className="flash"
                                    style={{ marginRight: "20px" }}
                                  >
                                    <button
                                      onClick={() => toggleSaveJob(job.id)}
                                      disabled={savingJobId === job.id}
                                      className="saved-job-button"
                                      style={{
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 0,
                                      }}
                                    >
                                      {savingJobId === job.id ? (
                                        <span className="loading-dots">
                                          ...
                                        </span>
                                      ) : (
                                        <Bookmark
                                          size={22}
                                          color={isSaved ? "red" : "gray"} // 👈 khi save thì đỏ, chưa save thì xám
                                          fill={isSaved ? "red" : "none"} // 👈 tô màu khi saved
                                        />
                                      )}
                                    </button>
                                  </span>

                                  <div className="image-box">
                                    <img
                                      src={
                                        job.companyLogo ||
                                        "assets/imgs/brands/brand-1.png"
                                      }
                                      alt="jobBox"
                                    />
                                  </div>
                                  <div className="right-info">
                                    <Link
                                      href={`/company-details/${
                                        job.companyId || ""
                                      }`}
                                    >
                                      <span className="name-job">
                                        {job.companyName || "Company"}
                                      </span>
                                    </Link>
                                    <span className="location-small">
                                      {job.location || "Unknown"}
                                    </span>
                                  </div>
                                </div>
                                <div className="card-block-info">
                                  <h6>
                                    <Link href={`/job-details-2/${job.id}`}>
                                      <span>{job.title || "No title"}</span>
                                    </Link>
                                  </h6>
                                  <div className="mt-5">
                                    <span className="card-briefcase">
                                      {job.type || "Fulltime"}
                                    </span>
                                    <span className="card-time">
                                      {job.createdAt
                                        ? new Date(
                                            job.createdAt
                                          ).toLocaleDateString()
                                        : ""}
                                    </span>
                                  </div>
                                  <p className="font-sm color-text-paragraph mt-15">
                                    {job.description || "Không có mô tả"}
                                  </p>
                                  <div className="mt-30">
                                    {Array.isArray(job.skills) &&
                                      job.skills.map(
                                        (skill: string, idx: number) => (
                                          <span
                                            key={idx}
                                            className="btn btn-grey-small mr-5"
                                          >
                                            {skill}
                                          </span>
                                        )
                                      )}
                                  </div>
                                  <div className="card-2-bottom mt-30">
                                    <div className="row">
                                      <div className="col-lg-7 col-7">
                                        <span className="card-text-price">
                                          {job.salary || "N/A"}
                                        </span>
                                        <span className="text-muted">
                                          /Tháng
                                        </span>
                                      </div>
                                      <div className="col-lg-5 col-5 text-end">
                                        <button
                                          onClick={() => handleOpenApply(job)}
                                          className="btn-apply"
                                        >
                                          Apply Now
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                              <input
                                className="input-disabled form-control min-value-money"
                                type="text"
                                name="min-value-money"
                                disabled={true}
                                defaultValue=""
                              />
                              <input
                                className="form-control min-value"
                                type="hidden"
                                name="min-value"
                                defaultValue=""
                              />
                            </div>
                          </div>
                          <div className="box-number-money">
                            <div className="row mt-30">
                              <div className="col-sm-6 col-6">
                                <span className="font-sm color-brand-1">
                                  $0
                                </span>
                              </div>
                              <div className="col-sm-6 col-6 text-end">
                                <span className="font-sm color-brand-1">
                                  $500
                                </span>
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
                        <h5 className="medium-heading mb-10">
                          Popular Keyword
                        </h5>
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
                        <h5 className="medium-heading mb-10">
                          Experience Level
                        </h5>
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
          {modalJob && (
            <ApplyJob
              job={modalJob}
              resumes={resumes} // 👈 truyền resumes vào
              onClose={() => setModalJob(null)}
              onSuccess={() => toast.success("Applied successfully!")}
            />
          )}
          <section className="section-box mt-50 mb-50">
            <div className="container">
              <div className="text-start">
                <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
                  News and Blog
                </h2>
                <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
                  Get the latest news, updates and tips
                </p>
              </div>
            </div>
            <div className="container">
              <div className="mt-50">
                <div className="box-swiper style-nav-top">
                  <BlogSlider />
                </div>
                <div className="text-center">
                  <Link href="blog-grid">
                    <span className="btn btn-brand-1 btn-icon-load mt--30 hover-up">
                      Load More Posts
                    </span>
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
                    <img
                      src="assets/imgs/template/newsletter-left.png"
                      alt="joxBox"
                    />
                  </div>
                  <div className="col-lg-12 col-xl-6 col-12">
                    <h2 className="text-md-newsletter text-center">
                      New Things Will Always
                      <br /> Update Regularly
                    </h2>
                    <div className="box-form-newsletter mt-40">
                      <form className="form-newsletter">
                        <input
                          className="input-newsletter"
                          type="text"
                          placeholder="Enter your email here"
                        />
                        <button className="btn btn-default font-heading icon-send-letter">
                          Subscribe
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img
                      src="assets/imgs/template/newsletter-right.png"
                      alt="joxBox"
                    />
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
