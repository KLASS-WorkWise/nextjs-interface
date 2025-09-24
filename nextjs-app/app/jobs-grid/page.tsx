/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect, useState } from "react";
import { getCompanyByEmployerId } from "@/lib/company/api";
import Layout from "@/components/Layout/Layout";
import BlogSlider from "@/components/sliders/Blog";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { useSearchParams } from "next/navigation";

import { applicantService } from "../../features/applicants/services/applicant.service";
import { toast } from "react-toastify";
import ApplyJob from "@/features/applicants/components/ApplyJob";
import { useRouter } from "next/navigation";
import { savedJobService } from "@/features/applicants/services/savedJobService";
import { Bookmark } from "lucide-react";
// import "@/styles/globals.css";

export default function JobGrid() {
  // Map employerId -> company info
  const [companyInfoMap, setCompanyInfoMap] = useState<{ [key: string]: any }>(
    {}
  );
  const searchParams = useSearchParams();

  useEffect(() => {
    const qLocation = searchParams.get("location") || "";
    const qKeyword = searchParams.get("keyword") || "";
    if (qLocation) setLocation(qLocation);
    if (qKeyword) setKeyword(qKeyword);
  }, [searchParams]);
  const { data: session } = useSession();
  const role = session?.user?.roles;
  // Hook lấy dữ liệu job từ API
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");
  // const [resumes, setResumes] = useState<any[]>([]);
  // const [savedJobs, setSavedJobs] = useState<{ jobId: number; savedJobId: number }[]>([]);
  // const [modalJob, setModalJob] = useState<any | null>(null);
  // Filter state
  const [jobTypeChecked, setJobTypeChecked] = useState<string[]>(["All"]);
  const [location, setLocation] = useState("");
  const [categoryChecked, setCategoryChecked] = useState<string[]>(["All"]);
  const [salaryChecked, setSalaryChecked] = useState<string[]>(["All"]);
  const [positionChecked, setPositionChecked] = useState<string[]>(["All"]);
  const [degreeChecked, setDegreeChecked] = useState<string[]>(["All"]);
  // Phân trang: mỗi trang 15 job (5 hàng, 3 cột)
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 15;
  // Keyword search
  const [keyword, setKeyword] = useState("");

  // Lấy dữ liệu Applyjob từ API
  const [modalJob, setModalJob] = useState<any | null>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const router = useRouter();
  const [savingJobId, setSavingJobId] = useState<number | null>(null);
  // savedJobs: lưu cả jobId và savedJobId
  const [savedJobs, setSavedJobs] = useState<
    { jobId: number; savedJobId: number }[]
  >([]);

  useEffect(() => {
    const fetchJobsAndCompanies = async () => {
      setJobsLoading(true);
      setJobsError("");
      try {
        // 1. Lấy danh sách jobs
        const res = await fetch("http://localhost:8080/api/job-postings/all");
        if (!res.ok) throw new Error("Không thể lấy danh sách công việc");
        const jobsData = await res.json();
        console.log("Fetched jobs:", jobsData);
        setJobs(jobsData);

        // 2. Lấy tất cả employerId duy nhất
        const employerIds = Array.from(
          new Set(jobsData.map((job: any) => job.employerId).filter(Boolean))
        );

        // 3. Lấy thông tin công ty cho từng employerId
        const companyPromises = employerIds.map(async (employerId) => {
          try {
            const company = await getCompanyByEmployerId(employerId);
            return { employerId, company };
          } catch {
            return { employerId, company: null };
          }
        });
        const companyResults = await Promise.all(companyPromises);
        const companyMap: { [key: string]: any } = {};
        companyResults.forEach(({ employerId, company }) => {
          companyMap[employerId] = company;
        });
        setCompanyInfoMap(companyMap);
      } catch (err: any) {
        setJobsError(err.message || "Lỗi không xác định");
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobsAndCompanies();
  }, []);

  // Helper: loại bỏ dấu tiếng Việt
  function removeVietnameseTones(str: string) {
    return str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }
  // Helper: parse lương từ chuỗi
  function parseSalaryRange(s: string): [number, number] | null {
    if (!s) return null;
    const match = s.match(/(\d+)[^\d]+(\d+)/);
    if (match) return [parseInt(match[1]), parseInt(match[2])];
    const single = s.match(/(\d+)/);
    if (single) return [parseInt(single[1]), parseInt(single[1])];
    return null;
  }
  // Filter jobs theo location, category, salary
  const filteredJobs = jobs.filter((job) => {
    // Filter location
    if (location && (job.location || "") !== location) return false;
    // Filter category (so sánh gần đúng, không phân biệt dấu/chữ hoa)
    if (!categoryChecked.includes("All")) {
      const jobCat = removeVietnameseTones((job.category || "").toLowerCase());
      const checked = categoryChecked.some((cat) =>
        jobCat.includes(removeVietnameseTones(cat.toLowerCase()))
      );
      if (!checked) return false;
    }
    // Filter salary
    if (!salaryChecked.includes("All")) {
      const jobSalaryStr = (job.salaryRange || job.salary || "").replace(
        /[^\d\- ]/g,
        ""
      );
      const jobSalary = parseSalaryRange(jobSalaryStr);
      if (!jobSalary) return false;
      const salaryRanges = [
        { label: "Duới 20 triệu", min: 0, max: 20 },
        { label: "20 - 50 triệu", min: 20, max: 50 },
        { label: "50 - 70 triệu", min: 50, max: 70 },
        { label: "70 - 100 triệu", min: 70, max: 100 },
        { label: "Trên 100 triệu", min: 100, max: 9999 },
      ];
      // Nếu job lương giao với bất kỳ khoảng nào được chọn thì hiện
      const match = salaryChecked.some((label) => {
        const range = salaryRanges.find((r) => r.label === label);
        if (!range) return false;
        if (label === "Duới 20 triệu") {
          // Chỉ lấy job có max < 20
          return jobSalary[1] < 20;
        }
        return jobSalary[1] >= range.min && jobSalary[0] <= range.max;
      });
      if (!match) return false;
    }
    // Filter position (tiêu đề chứa từ khóa vị trí được chọn)
    if (!positionChecked.includes("All")) {
      const title = removeVietnameseTones((job.title || "").toLowerCase());
      const checked = positionChecked.some((pos) =>
        title.includes(removeVietnameseTones(pos.toLowerCase()))
      );
      if (!checked) return false;
    }
    // Filter job type
    if (!jobTypeChecked.includes("All")) {
      // Ưu tiên job.jobType, fallback sang job.type nếu không có
      const jobTypeRaw = job.jobType || job.type || "";
      const jobType = removeVietnameseTones(jobTypeRaw.toLowerCase());
      const checked = jobTypeChecked.some((type) =>
        jobType.includes(removeVietnameseTones(type.toLowerCase()))
      );
      if (!checked) return false;
    }
    // Filter degree
    if (!degreeChecked.includes("All")) {
      const jobDegree = removeVietnameseTones(
        (job.requiredDegree || "").toLowerCase()
      );
      const checked = degreeChecked.some((deg) =>
        jobDegree.includes(removeVietnameseTones(deg.toLowerCase()))
      );
      if (!checked) return false;
    }
    // Filter keyword (tìm gần đúng trên nhiều trường)
    if (keyword.trim() !== "") {
      const kwArr = removeVietnameseTones(keyword.toLowerCase())
        .split(/\s|,|\./)
        .filter(Boolean);
      // Phân loại từ khóa số (lương) và từ khóa text
      const kwNumbers = kwArr.filter((k) => /^\d+$/.test(k)).map(Number);
      const kwTexts = kwArr.filter((k) => !/^\d+$/.test(k));
      // Ghép các trường text lại để so sánh
      const jobText = [
        job.title,
        job.description,
        job.salaryRange,
        job.salary,
        job.location,
        job.category,
        job.requiredDegree,
        job.type,
        job.jobType,
        Array.isArray(job.skills) ? job.skills.join(" ") : "",
      ]
        .map((x) => removeVietnameseTones((x || "").toLowerCase()))
        .join(" ");
      // Nếu có từ khóa text, phải match ít nhất 1 từ
      if (kwTexts.length > 0) {
        const matchText = kwTexts.some((kw) => jobText.includes(kw));
        if (!matchText) return false;
      }
      // Nếu có từ khóa số (lương), chỉ hiện job có lương giao với khoảng nhập
      if (kwNumbers.length > 0) {
        const min = Math.min(...kwNumbers);
        const max = Math.max(...kwNumbers);
        const jobSalaryStr = (job.salaryRange || job.salary || "").replace(
          /[^\d\- ]/g,
          ""
        );
        const jobSalary = parseSalaryRange(jobSalaryStr);
        if (!jobSalary) return false;
        // Lấy job có lương giao với khoảng nhập
        if (jobSalary[1] < min || jobSalary[0] > max) return false;
      }
    }
    return true;
  });
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const pagedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  // Đã fetch company cùng lúc với jobs, không cần fetch lại theo pagedJobs

  // Xử lý submit filter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Xử lý mở  apply job
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
        toast.error("Removed successfully");
        console.log("Removed job:", existing);
         console.log("Removed job:", existing.savedJobId);
      } else {
        const res = await savedJobService.saveJob(jobId);
        setSavedJobs((prev) => [
          ...prev,
          { jobId, savedJobId: res.data.savedJobId },
        ]);
        toast.success("Saved successfully");
        console.log("Saved job:", res.data);
          console.log("Saved jobss:", res.data.savedJobId);
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
    const fetchResumes = async () => {
      try {
        const res = await applicantService.getMyResumes();
        setResumes(res.data || []);
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
          res.data.data.content?.map((job: any) => ({
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
                    <span className="color-brand-2">
                      {filteredJobs.length} Jobs
                    </span>{" "}
                    Available Now
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
                    <form onSubmit={handleSearch}>
                      {/* <div className="box-industry">
                        <select className="form-input mr-10 select-active input-industry">
                          <option value={0}>Industry</option>
                          <option value={1}>Software</option>
                          Cái này có filter ở dưới nên không cần nữa
                          <option value={2}>Finance</option>
                          <option value={3}>Recruting</option>
                          <option value={4}>Management</option>
                          <option value={5}>Advertising</option>
                          <option value={6}>Development</option>
                        </select>
                      </div> */}
                      <div className="box-industry">
                        <select
                          className="form-input mr-10 select-active input-location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        >
                          <option value="">Location</option>
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="Hải Phòng">Hải Phòng</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <option value="Huế">Huế</option>
                          <option value="Cần Thơ">Cần Thơ</option>
                          <option value="HCM">Thành phố Hồ Chí Minh</option>
                          <option value="An Giang">An Giang</option>
                          <option value="Bắc Ninh">Bắc Ninh</option>
                          <option value="Cà Mau">Cà Mau</option>
                          <option value="Cao Bằng">Cao Bằng</option>
                          <option value="Đắk Lắk">Đắk Lắk</option>
                          <option value="Điện Biên">Điện Biên</option>
                          <option value="Đồng Nai">Đồng Nai</option>
                          <option value="Đồng Tháp">Đồng Tháp</option>
                          <option value="Gia Lai">Gia Lai</option>
                          <option value="Hà Tĩnh">Hà Tĩnh</option>
                          <option value="Hưng Yên">Hưng Yên</option>
                          <option value="Khánh Hòa">Khánh Hòa</option>
                          <option value="Lai Châu">Lai Châu</option>
                          <option value="Lạng Sơn">Lạng Sơn</option>
                          <option value="Lào Cai">Lào Cai</option>
                          <option value="Lâm Đồng">Lâm Đồng</option>
                          <option value="Nghệ An">Nghệ An</option>
                          <option value="Ninh Bình">Ninh Bình</option>
                          <option value="Phú Thọ">Phú Thọ</option>
                          <option value="Quảng Ngãi">Quảng Ngãi</option>
                          <option value="Quảng Ninh">Quảng Ninh</option>
                          <option value="Quảng Trị">Quảng Trị</option>
                          <option value="Sơn La">Sơn La</option>
                          <option value="Tây Ninh">Tây Ninh</option>
                          <option value="Thái Nguyên">Thái Nguyên</option>
                          <option value="Thanh Hóa">Thanh Hóa</option>
                          <option value="Tuyên Quang">Tuyên Quang</option>
                          <option value="Vĩnh Long">Vĩnh Long</option>
                        </select>
                      </div>
                      <input
                        className="form-input input-keysearch mr-10"
                        type="text"
                        placeholder="Your keyword... "
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
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
                            Showing <strong>10-15 </strong>of{" "}
                            <strong>30 </strong>jobs
                          </span>
                        </div>

                        <div className="col-xl-6 col-lg-7 text-lg-end mt-sm-15 ">
                          <div className="display-flex2">
                            {role?.includes("Employers") && (
                              // <Link href="/job-create">
                              //   <button className="btn btn-primary" style={{ marginRight: "16px" }}>
                              //     Create Job
                              //   </button>
                              // </Link>
                              <div className="display-flex2">
                                <Link href="/job-create">
                                  <button
                                    className="btn btn-primary"
                                    style={{ marginRight: "16px" }}
                                  >
                                    Create Job
                                  </button>
                                </Link>

                                <Link href="http://localhost:3000/dashboard-employers/my-jobs">
                                  <button className="btn btn-primary">
                                    Manage Jobs
                                  </button>
                                </Link>
                              </div>
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
                                  <span>15</span>
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
                        pagedJobs.map((job: any) => {
                          const isSaved = savedJobs.some(
                            (j) => j.jobId === job.id
                          );
                          const company = job.employerId
                            ? companyInfoMap[job.employerId]
                            : null;
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
                                          color={isSaved ? "red" : "gray"}
                                          fill={isSaved ? "red" : "none"}
                                        />
                                      )}
                                    </button>
                                  </span>
                                  <div
                                    className="image-box"
                                    style={{
                                      width: 48,
                                      height: 48,
                                      borderRadius: 8,
                                      objectFit: "cover",
                                    }}
                                  >
                                    <img
                                      src={
                                        company?.logoUrl ||
                                        job.companyLogo ||
                                        "/assets/imgs/brands/brand-1.png"
                                      }
                                      alt={
                                        company?.companyName ||
                                        job.companyName ||
                                        "Company"
                                      }
                                      style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        borderRadius: 8,
                                        objectFit: "contain", // hoặc "scale-down" để scale xuống khi quá lớn
                                        display: "block",
                                        margin: "auto",
                                      }}
                                    />
                                  </div>

                                <div className="right-info">
                                  <span className="fw-bold" style={{ fontSize: '1.08rem', color: '#222'}}>
                                    {company?.companyName || job.companyName || 'Company'}
                                  </span>
                                  <div className="d-flex align-items-center font-xs color-text-paragraph mt-1">
                                    <i className="fi-rr-marker mr-5" />
                                    { 
                                    job.location || 'Unknown'
                                      }
                                  </div>
                                </div>
                              </div>
                            <div className="card-block-info">
                              <h6>
                                <Link href={`/job-details-2/${job.id}`}>
                                  <span>{job.title || "No title"}</span>
                                </Link>
                              </h6>
                              <div className="mt-5">
                                <span className="card-briefcase">{job.jobType || "Fulltime"}</span>
                                <span className="card-time">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}</span>
                              </div>
                              <p
                                className="font-sm color-text-paragraph mt-15"
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'normal',
                                  maxWidth: '100%',
                                  marginBottom: 0
                                }}
                                title={job.description || "Không có mô tả"}
                              >
                                {job.description || "Không có mô tả"}
                              </p>
                              <div className="mt-30">
                                {Array.isArray(job.skills) && job.skills.map((skill: string, idx: number) => (
                                  <span key={idx} className="btn btn-grey-small mr-5">{skill}</span>
                                ))}
                              </div>
                              <div className="card-2-bottom mt-30">
                                <div className="row">
                                  <div className="col-lg-7 col-7">
                                    <span className="card-text-price" style={{ fontSize: '1rem', color: '#2A6DF5', fontWeight: 700, letterSpacing: '0.5px', lineHeight: 1 }}>
                                      {job.salaryRange && job.salaryRange.trim() !== "" ? job.salaryRange : (job.salary && job.salary.trim() !== "" ? job.salary : "N/A")}
                                    </span>
                                    <span className="text-muted" style={{ fontSize: '0.85rem', marginLeft: 2 }}>/Tháng</span>
                                  </div>
                                  <div className="col-lg-5 col-5 text-end">
                                        <button
                                          onClick={() => handleOpenApply(job)}
                                          className="btn btn-apply-now"
                                        >
                                          Apply
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

                    {/* Modal ApplyJob */}
                    {modalJob && (
                      <ApplyJob
                        job={modalJob}
                        resumes={resumes}
                        onClose={() => setModalJob(null)}
                        onSuccess={() => toast.success("Applied successfully!")}
                      />
                    )}
                  </div>
                  <div className="paginations">
                    <ul className="pager">
                      <li>
                        <a
                          className={`pager-prev${
                            currentPage === 1 ? " disabled" : ""
                          }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              setCurrentPage(currentPage - 1);
                          }}
                        />
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i + 1}>
                          <a
                            href="#"
                            className={`pager-number${
                              currentPage === i + 1 ? " active" : ""
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(i + 1);
                            }}
                          >
                            {i + 1}
                          </a>
                        </li>
                      ))}
                      <li>
                        <a
                          className={`pager-next${
                            currentPage === totalPages ? " disabled" : ""
                          }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              setCurrentPage(currentPage + 1);
                          }}
                        />
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
                          <input
                            className="form-control form-icons select-active"
                            value={location || "Location"}
                            disabled
                            style={{ background: "#f7f7f7", color: "#222" }}
                          />
                          <i className="fi-rr-marker" />
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-15">Category</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            {[
                              "All",
                              "Công Nghệ Thông Tin",
                              "Tài chính và Kế toán",
                              "Nhân sự và Hành chính",
                              "Kiến trúc",
                              "Marketing",
                              "Thiết kế đồ họa",
                              "Truyền thông đa phương tiện",
                              "Nhân viên kinh doanh",
                            ].map((cat) => (
                              <li key={cat}>
                                <label className="cb-container">
                                  <input
                                    type="checkbox"
                                    checked={categoryChecked.includes(cat)}
                                    onChange={() => {
                                      if (cat === "All") {
                                        setCategoryChecked(["All"]);
                                      } else {
                                        let newChecked =
                                          categoryChecked.includes(cat)
                                            ? categoryChecked.filter(
                                                (c) => c !== cat
                                              )
                                            : [
                                                ...categoryChecked.filter(
                                                  (c) => c !== "All"
                                                ),
                                                cat,
                                              ];
                                        if (newChecked.length === 0)
                                          newChecked = ["All"];
                                        setCategoryChecked(newChecked);
                                      }
                                    }}
                                  />
                                  <span className="text-small">{cat}</span>
                                  <span className="checkmark" />
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-25">Salary Range</h5>
                        <div className="form-group mb-20">
                          <ul className="list-checkbox">
                            {[
                              "All",
                              "Duới 20 triệu",
                              "20 - 50 triệu",
                              "50 - 70 triệu",
                              "70 - 100 triệu",
                              "Trên 100 triệu",
                            ].map((label) => (
                              <li key={label}>
                                <label className="cb-container">
                                  <input
                                    type="checkbox"
                                    checked={salaryChecked.includes(label)}
                                    onChange={() => {
                                      if (label === "All") {
                                        setSalaryChecked(["All"]);
                                      } else {
                                        let newChecked = salaryChecked.includes(
                                          label
                                        )
                                          ? salaryChecked.filter(
                                              (l) => l !== label
                                            )
                                          : [
                                              ...salaryChecked.filter(
                                                (l) => l !== "All"
                                              ),
                                              label,
                                            ];
                                        if (newChecked.length === 0)
                                          newChecked = ["All"];
                                        setSalaryChecked(newChecked);
                                      }
                                    }}
                                  />
                                  <span className="text-small">{label}</span>
                                  <span className="checkmark" />
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Position</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            {[
                              "All",
                              "Senior",
                              "Middle",
                              "Junior",
                              "Fresher",
                              "Intern",
                            ].map((pos) => (
                              <li key={pos}>
                                <label className="cb-container">
                                  <input
                                    type="checkbox"
                                    checked={positionChecked.includes(pos)}
                                    onChange={() => {
                                      if (pos === "All") {
                                        setPositionChecked(["All"]);
                                      } else {
                                        let newChecked =
                                          positionChecked.includes(pos)
                                            ? positionChecked.filter(
                                                (p) => p !== pos
                                              )
                                            : [
                                                ...positionChecked.filter(
                                                  (p) => p !== "All"
                                                ),
                                                pos,
                                              ];
                                        if (newChecked.length === 0)
                                          newChecked = ["All"];
                                        setPositionChecked(newChecked);
                                      }
                                    }}
                                  />
                                  <span className="text-small">{pos}</span>
                                  <span className="checkmark" />
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">
                          Required Degree
                        </h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            {[
                              "All",
                              "Đại học",
                              "Cao đẳng",
                              "Trung cấp",
                              "THPT",
                              "Chứng chỉ nghề",
                            ].map((deg) => (
                              <li key={deg}>
                                <label className="cb-container">
                                  <input
                                    type="checkbox"
                                    checked={degreeChecked.includes(deg)}
                                    onChange={() => {
                                      if (deg === "All") {
                                        setDegreeChecked(["All"]);
                                      } else {
                                        let newChecked = degreeChecked.includes(
                                          deg
                                        )
                                          ? degreeChecked.filter(
                                              (d) => d !== deg
                                            )
                                          : [
                                              ...degreeChecked.filter(
                                                (d) => d !== "All"
                                              ),
                                              deg,
                                            ];
                                        if (newChecked.length === 0)
                                          newChecked = ["All"];
                                        setDegreeChecked(newChecked);
                                      }
                                    }}
                                  />
                                  <span className="text-small">{deg}</span>
                                  <span className="checkmark" />
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-15">Job type</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            {[
                              "All",
                              "Full-Time",
                              "Part-Time",
                              "Contract",
                              "Remote",
                              "Onsite",
                            ].map((type) => (
                              <li key={type}>
                                <label className="cb-container">
                                  <input
                                    type="checkbox"
                                    checked={jobTypeChecked.includes(type)}
                                    onChange={() => {
                                      if (type === "All") {
                                        setJobTypeChecked(["All"]);
                                      } else {
                                        let newChecked =
                                          jobTypeChecked.includes(type)
                                            ? jobTypeChecked.filter(
                                                (t) => t !== type
                                              )
                                            : [
                                                ...jobTypeChecked.filter(
                                                  (t) => t !== "All"
                                                ),
                                                type,
                                              ];
                                        if (newChecked.length === 0)
                                          newChecked = ["All"];
                                        setJobTypeChecked(newChecked);
                                      }
                                    }}
                                  />
                                  <span className="text-small">{type}</span>
                                  <span className="checkmark" />
                                </label>
                              </li>
                            ))}
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
