"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useState } from "react";
import "./JobCardVip.css";
import { getCompanyByEmployerId } from "@/lib/company/api";


const JobPostingVip = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [companyInfoMap, setCompanyInfoMap] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isScrolling = jobs.length > 6;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Lấy danh sách job vip và thông tin công ty giống CategoryTab
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:8080/api/job-postings/all");
        if (!res.ok) throw new Error("Không thể lấy danh sách công việc");
        const data = await res.json();
        // Lọc chỉ lấy job có postType = 'vip'
        const vipJobs = data.filter((job: any) => job.postType === "vip");
        setJobs(vipJobs);

        // Lấy thông tin công ty cho các job vip
        const jobsToShow = vipJobs.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const employerIds = Array.from(new Set(jobsToShow.map((job: any) => job.employerId).filter(Boolean)));
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
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Hiệu ứng scroll giữ nguyên
  const startAutoScroll = () => {
    if (!isScrolling || !containerRef.current) return;
    const container = containerRef.current;
    let scrollAmount = 0;
    intervalRef.current = setInterval(() => {
      if (isPaused) return;
      scrollAmount += 1;
      if (scrollAmount >= container.scrollWidth / 2) {
        scrollAmount = 0;
      }
      container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }, 40);
  };
  const stopAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  useEffect(() => {
    if (isScrolling) startAutoScroll();
    return () => stopAutoScroll();
  }, [isScrolling, isPaused]);
  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollStep = 320;
    container.scrollBy({ left: direction === "left" ? -scrollStep : scrollStep, behavior: "smooth" });
  };
  const jobsToRender = isScrolling ? [...jobs, ...jobs] : jobs;

  return (
    <div className="job-vip-wrapper">
      {isScrolling && (
        <>
          <button className="nav-btn left" onClick={() => scroll("left")}>⬅</button>
          <button className="nav-btn right" onClick={() => scroll("right")}>➡</button>
        </>
      )}
      <div
        ref={containerRef}
        className={isScrolling ? "job-vip-slider" : "job-vip-grid"}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {loading && <div className="job-vip-loading">Đang tải dữ liệu...</div>}
        {error && <div className="job-vip-error">{error}</div>}
        {!loading && !error && jobsToRender.length === 0 && <div className="job-vip-empty">Không có bài đăng VIP nào</div>}
        {!loading && !error && jobsToRender.length > 0 &&
          jobsToRender.map((job: any, index: number) => {
            const company = job.employerId ? companyInfoMap[job.employerId] : null;
            return (
              <div key={job.id + "-" + index} className="job-card-vip">
                {/* Header */}
                <div className="company">
                  <img
                    src={company?.logoUrl || "//assets/imgs/brands/brand-1.png"}
                    alt={company?.companyName  || "Company Logo"}
                    className="logo"
                  />
                  <div>
                    <h3 className="companyName">{company?.companyName  || "Company Name"}</h3>
                    <span className="verified">✔ Verified</span>
                  </div>
                  <span className="badge-vip">★ VIP</span>
                </div>
                {/* Job Title */}
                <h2 className="jobTitle">{job.title}</h2>
                {/* Job Meta */}
                <div className="info">
                  <span>📍 {job.location}</span>
                  <span>⏰ {job.type}</span>
                  <span>📅 {job.posted || job.createdAt}</span>
                </div>
                {/* Stats */}
                <div className="info">
                  <span>👁 {job.views || 0} views</span>
                  <span>👥 {job.applicants || 0} applicants</span>
                </div>
                {/* Salary */}
                <div className="salary">
                  {job.salary}
                  <span className="competitive">Competitive</span>
                </div>
                {/* Apply Button */}
                <Link href="/jobs-grid" className="apply-btn">
                  Apply Now
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default JobPostingVip;