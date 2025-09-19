// "use client"

// import { X, CheckCircle, Heart, Download, Edit3, ArrowRight } from "lucide-react"
// import "./CVSuccessModal.css"
// import { useRouter } from "next/dist/client/components/navigation"
// import { exportResumeToPDF } from "../pdf-export"
// import type { ResumeData } from "@/components/resume-builder";


// interface Job {
//   id: string
//   title: string
//   company: string
//   location: string
//   salary: string
//   logo: string
//   isLiked: boolean
//   companyTag?: string
// }


// interface CVSuccessModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   resumeId: string | null; // truyền thêm resume vào modal
//   resume?: ResumeData | null; // truyền thêm resume vào modal
// }

// export function CVSuccessModal({ isOpen, onClose, resumeId, resume }: CVSuccessModalProps) {

//   const router = useRouter();


//   if (!isOpen) return null

//   const matchedJobs: Job[] = [
//     {
//       id: "1",
//       title: "Web Development Engineer (Remote)",
//       company: "CÔNG TY TNHH IE VIỆT",
//       location: "Hồ Chí Minh & 2 nơi khác",
//       salary: "Thỏa thuận",
//       logo: "/abstract-tech-logo.png",
//       isLiked: false,
//     },
//     {
//       id: "2",
//       title: "Backend Developer (Have Japanese)",
//       company: "TECHVIFY SOFTWARE., JSC",
//       location: "Hà Nội, Đà Nẵng",
//       salary: "Thỏa thuận",
//       logo: "/abstract-tech-logo.png",
//       isLiked: false,
//       companyTag: "TECHVFY",
//     },
//     {
//       id: "3",
//       title: "KỸ SƯ CNTT (Biết Tiếng Trung)",
//       company: "CÔNG TY TNHH WELL SHIN ELECTRONIC...",
//       location: "Đà Nẵng",
//       salary: "Thỏa thuận",
//       logo: "/fpt-logo.png",
//       isLiked: false,
//     },
//     {
//       id: "4",
//       title: "Middle/Senior Frontend Developer (Angular)...",
//       company: "Newwave Solutions JSC",
//       location: "Hà Nội",
//       salary: "Tới 45 triệu",
//       logo: "/vng-logo.jpg",
//       isLiked: false,
//       companyTag: "NEWWAVE",
//     },
//     {
//       id: "5",
//       title: "FullStack Developer (Junior, Senior) - Khối Công Nghệ Thông Tin (HOLT.04)",
//       company: "NGÂN HÀNG TMCP QUÂN ĐỘI",
//       location: "Hà Nội",
//       salary: "Thỏa thuận",
//       logo: "/abstract-tech-logo.png",
//       isLiked: false,
//     },
//     {
//       id: "6",
//       title: "Software Developer (C++), (Chi Tuyển UV Đã Có Kinh Nghiệm)",
//       company: "Asilla Việt Nam",
//       location: "Hà Nội",
//       salary: "Tới 1,800 USD",
//       logo: "/fpt-logo.png",
//       isLiked: false,
//     },
//   ]

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         {/* Header */}
//         <div className="modal-header">
//           <button onClick={onClose} className="modal-close">
//             <X size={24} />
//           </button>
//           <div className="modal-success">
//             <div className="modal-icon">
//               <img
//                 src="/assets/imgs/template/logoJobBox.png" // 👈 đường dẫn logo của bạn
//                 alt="Success Logo"
//                 className="w-12 h-12 object-contain"
//               />
//             </div>
//             <div>
//               <h2 className="modal-title">Lưu CV thành công!</h2>
//               <div className="modal-actions">
//                 <button className="btn-outline" 
//                 onClick={() => {
//               onClose();
//               router.push(`/page-resume?action=edit&id=${resumeId}&source=candidate-profile`); // chuyển sang trang edit
//             }}>
//                   <Edit3 size={16} />
//                   <span>Tiếp tục chỉnh sửa</span>
//                 </button>
//                 {/* <button className="btn-outline">
//                   <Download size={16} />
//                   <span>Tải xuống</span>
//                 </button> */}
//                 <button className="btn-outline d-flex align-items-center gap-2"
//                   onClick={async () => {
//                     if (resume) {
//                         await exportResumeToPDF(resume, (resume as ResumeData)?.template || "modern");
//                       } else {
//                         console.error("Resume is missing!");
//                     }
//                   }}
//                 >
//                   <Download size={16} />
//                   <span>Tải xuống</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Job Recommendations */}
//         <div className="modal-body">
//           <div className="modal-jobs-header">
//             <h3>
//               Việc làm <span>"SOFTWARE ENGINEER"</span> phù hợp với CV của bạn
//             </h3>
//             <button className="btn-see-all">
//               <span>Xem tất cả</span>
//               <ArrowRight size={16} />
//             </button>
//           </div>

//           <div className="job-list">
//             {matchedJobs.map((job) => (
//               <div key={job.id} className="job-card">
//                 <div className="job-header">
//                   <div className="job-logo">
//                     {job.companyTag ? (
//                       <span>{job.companyTag}</span>
//                     ) : (
//                       <img src={job.logo} alt={job.company} />
//                     )}
//                   </div>
//                   <button className="job-like">
//                     <Heart size={18} />
//                   </button>
//                 </div>
//                 <h4 className="job-title">{job.title}</h4>
//                 <p className="job-company">{job.company}</p>
//                 <div className="job-tags">
//                   <span>{job.salary}</span>
//                   <span>{job.location}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { X, Heart, Download, Edit3, ArrowRight } from "lucide-react"
import "./CVSuccessModal.css"
import { useRouter } from "next/navigation"
import { exportResumeToPDF } from "../pdf-export"
import type { ResumeData } from "@/components/resume-builder"
import { fetchRecommendedJobs } from "@/lib/recommentJob/api"
import { useSession } from "next-auth/react"
import Link from "next/link";

interface Job {
  jobPostingId: string
  jobTitle: string
  salary_range: string
  location: string
  logoUrl: string
  companyName: string
  major?: string
  isLiked?: boolean
}

interface CVSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  resumeId: string | null
  resume?: ResumeData | null
}

export function CVSuccessModal({ isOpen, onClose, resumeId, resume }: CVSuccessModalProps) {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const candidateId = session?.user?.id ? Number(session.user.id) : 0
  console.log("candidateId", candidateId)

  useEffect(() => {
    if (isOpen && candidateId) {
      setLoading(true)
      fetchRecommendedJobs(candidateId, 5, 30).then((data) => {
        if (data && data.recommendations) {
          setJobs(data.recommendations)
        }
        setLoading(false)
      })
    }
  }, [isOpen, candidateId])

  if (!isOpen) return null

  const handleViewAll = () => {
    router.push(`/jobs-grid?keyword=${encodeURIComponent(jobs[0]?.major || "")}`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
          <div className="modal-success">
            <div className="modal-icon">
              <img
                src="/assets/imgs/template/logoJobBox.png"
                alt="Success Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h2 className="modal-title">Lưu CV thành công!</h2>
              <div className="modal-actions">
                <button
                  className="btn-outline"
                  onClick={() => {
                    onClose()
                    router.push(`/page-resume?action=edit&id=${resumeId}&source=candidate-profile`)
                  }}
                >
                  <Edit3 size={16} />
                  <span>Tiếp tục chỉnh sửa</span>
                </button>

                <button
                  className="btn-outline d-flex align-items-center gap-2"
                  onClick={async () => {
                    if (resume) {
                      await exportResumeToPDF(resume, (resume as ResumeData)?.template || "modern")
                    } else {
                      console.error("Resume is missing!")
                    }
                  }}
                >
                  <Download size={16} />
                  <span>Tải xuống</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Recommendations */}
        <div className="modal-body">
          <div className="modal-jobs-header">
            <h3>
              Việc làm <span>{jobs[0]?.major || ""}</span> phù hợp với CV của bạn
            </h3>
            <button onClick={handleViewAll} className="btn-see-all">
              <span>Xem tất cả</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="job-list">
            {loading ? (
              <p>Đang tải...</p>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.jobPostingId} className="job-card">
                  <div className="job-header">
                    <div className="job-logo-title">
                      <div className="job-logo">
                        {job.logoUrl ? (
                          <img src={job.logoUrl} alt={job.companyName} />
                        ) : (
                          <span>{job.companyName?.[0]}</span>
                        )}
                      </div>
                      {/* <h4 className="job-title">{job.jobTitle}</h4> */}
                      <h4 className="job-title">
                        <Link href={`/job-details-2/${job.jobPostingId}`}>
                                  <span>{job.jobTitle || "No title"}</span>
                        </Link>
                      </h4>
                      
                    </div>
                    <button className="job-like">
                      <Heart size={18} />
                    </button>
                  </div>
                  <p className="job-company">{job.companyName}</p>
                  <div className="job-tags">
                    <span>{job.salary_range}</span>
                    <span style={{marginLeft: "8px"}}>{job.location}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Không tìm thấy việc làm phù hợp</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

