"use client"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { useState } from "react"
import "./JobCardVip.css"
import { getCompanyByEmployerId } from "@/lib/company/api"

const JobPostingVip = () => {
  const [jobs, setJobs] = useState<any[]>([])
  const [companyInfoMap, setCompanyInfoMap] = useState<{ [key: string]: any }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<"loading" | "loaded" | "error">("loading")

  const isScrolling = jobs.length > 6
  const containerRef = useRef<HTMLDivElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const currentContainer = containerRef.current
    if (currentContainer) {
      observer.observe(currentContainer)
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer)
      }
    }
  }, [])

  // Lấy danh sách job vip và thông tin công ty giống CategoryTab
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      setError("")
      setAnimationPhase("loading")
      try {
        const res = await fetch("http://localhost:8080/api/job-postings/all")
        if (!res.ok) throw new Error("Không thể lấy danh sách công việc")
        const data = await res.json()
        // Lọc chỉ lấy job có postType = 'vip'
        const vipJobs = data.filter((job: any) => job.postType === "vip")
        setJobs(vipJobs)

        // Lấy thông tin công ty cho các job vip
        const jobsToShow = vipJobs
          .slice()
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        const employerIds = Array.from(new Set(jobsToShow.map((job: any) => job.employerId).filter(Boolean)))
        const companyPromises = employerIds.map(async (employerId) => {
          try {
            const company = await getCompanyByEmployerId(employerId)
            return { employerId, company }
          } catch {
            return { employerId, company: null }
          }
        })
        const companyResults = await Promise.all(companyPromises)
        const companyMap: { [key: string]: any } = {}
        companyResults.forEach(({ employerId, company }) => {
          companyMap[employerId] = company
        })
        setCompanyInfoMap(companyMap)
        setTimeout(() => setAnimationPhase("loaded"), 300)
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định")
        setAnimationPhase("error")
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const startAutoScroll = () => {
    if (!isScrolling || !containerRef.current) return
    const container = containerRef.current

    intervalRef.current = setInterval(() => {
      if (isPaused) return

      setScrollPosition((prev) => {
        const newPosition = prev + 0.8 // Slower, smoother scroll
        const maxScroll = container.scrollWidth / 2

        if (newPosition >= maxScroll) {
          container.scrollTo({ left: 0, behavior: "auto" })
          return 0
        }

        container.scrollTo({ left: newPosition, behavior: "auto" })
        return newPosition
      })
    }, 25) // Higher frequency for smoother animation
  }

  const stopAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    if (isScrolling && animationPhase === "loaded") {
      setTimeout(() => startAutoScroll(), 1000)
    }
    return () => stopAutoScroll()
  }, [isScrolling, isPaused, animationPhase])

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return
    const container = containerRef.current
    const scrollStep = 340 // Slightly larger step for better UX
    const targetScroll = container.scrollLeft + (direction === "left" ? -scrollStep : scrollStep)

    // Smooth scroll with custom easing
    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    })

    // Update scroll position state
    setScrollPosition(targetScroll)
  }

  const jobsToRender = isScrolling ? [...jobs, ...jobs] : jobs

  return (
    <div className={`job-vip-wrapper ${isVisible ? "fade-in" : ""}`}>
      {isScrolling && (
        <>
          <button className="nav-btn left" onClick={() => scroll("left")}>
            <span className="nav-icon">⬅</span>
          </button>
          <button className="nav-btn right" onClick={() => scroll("right")}>
            <span className="nav-icon">➡</span>
          </button>
        </>
      )}
      <div
        ref={containerRef}
        className={`${isScrolling ? "job-vip-slider" : "job-vip-grid"} ${animationPhase}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {loading && (
          <div className="job-vip-loading">
            <div className="loading-spinner"></div>
            <span>Đang tải dữ liệu...</span>
          </div>
        )}
        {error && (
          <div className="job-vip-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        {!loading && !error && jobsToRender.length === 0 && (
          <div className="job-vip-empty">
            <span className="empty-icon">📋</span>
            Không có bài đăng VIP nào
          </div>
        )}
        {!loading &&
          !error &&
          jobsToRender.length > 0 &&
          jobsToRender.map((job: any, index: number) => {
            const company = job.employerId ? companyInfoMap[job.employerId] : null
            return (
              <div
                key={job.id + "-" + index}
                className="job-card-vip"
                style={{
                  animationDelay: `${(index % jobs.length) * 0.1}s`,
                }}
              >
                {/* Header */}
                <div className="company">
                  <img
                    src={company?.logoUrl || "//assets/imgs/brands/brand-1.png"}
                    alt={company?.companyName || "Company Logo"}
                    className="logo"
                  />
                  <div>
                    <h3 className="companyName">{company?.companyName || "Company Name"}</h3>
                    <span className="posted-time">
                      {job.createdAt
                        ? (() => {
                            const diffMs = Date.now() - new Date(job.createdAt).getTime()
                            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
                            if (diffDays === 0) {
                              const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
                              return (
                                <>
                                  <span role="img" aria-label="clock">
                                    🕒
                                  </span>{" "}
                                  {diffHours} giờ trước
                                </>
                              )
                            }
                            return (
                              <>
                                <span role="img" aria-label="calendar">
                                  📅
                                </span>{" "}
                                {diffDays} ngày trước
                              </>
                            )
                          })()
                        : "Chưa xác định"}
                    </span>
                  </div>
                  <span className="badge-vip">★ VIP</span>
                </div>
                {/* Job Title */}
                <h2 className="jobTitle">{job.title}</h2>
                {/* Job Meta */}
                <div className="info">
                  <span>📍 {job.location}</span>
                  <span>⏰ {job.endAt ? new Date(job.endAt).toLocaleDateString("vi-VN") : "Không xác định"}</span>
                </div>
                {/* Stats */}
                <div className="info">
                  <span>
                    {job.description
                      ? job.description.length > 100
                        ? job.description.slice(0, 100) + "..."
                        : job.description
                      : "No description"}
                  </span>
                </div>
                {/* Salary */}
                <div className="salary">
                  {job.salaryRange ? job.salaryRange : "Thương lượng"} / Month
                  <br />
                  <span className="competitive">
                    <span role="img" aria-label="fire">
                      🔥
                    </span>{" "}
                    Competitive
                  </span>
                </div>
                {/* Apply Button */}
                <Link href="/jobs-grid" className="apply-btn">
                  <span className="btn-text">Apply Now</span>
                  <span className="btn-arrow">→</span>
                </Link>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default JobPostingVip
