/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { applicantService, ApplicantTimeline } from "../services/applicant.service";
import { Applicant } from "@/types/applicant";
import styles from '../../../styles/ApplicantDetail.module.css';// css riêng cho component
import { Timeline } from "./Timeline";
import { fi } from "date-fns/locale";




type Props = { id: number };

export default function ApplicantDetail({ id }: Props) {
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);

    const [timeline, setTimeline] = useState<ApplicantTimeline[]>([]);
  // State cho HR update
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
 // Fetch applicant detail + timeline
 // Fetch detail + timeline
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await applicantService.getApplicantTracking(id);
      setApplicant(res.data.detail ?? null);
      setTimeline(res.data.timeline ?? []);
    } catch (err) {
      console.error("Error fetching applicant data:", err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchData();

  const unsubscribe = applicantService.subscribeApplicant(id, (data) => {
    if (data.detail) setApplicant(prev => ({ ...prev, ...data.detail }));
    if (data.timeline) setTimeline(data.timeline);
  });

  return () => unsubscribe();
}, [id]);

  const handleUpdateStatus = async () => {
    if (!status) {
      alert("❌ Vui lòng chọn status");
      return;
    }

    try {
      await applicantService.updateStatus(applicant!.id, { status, note });
      alert("✅ Cập nhật trạng thái thành công");
      setStatus("");
      setNote("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật trạng thái");
    }
  };


  // useEffect(() => {
  //   const fetchDetail = async () => {
  //     try {
  //       const res = await applicantService.getApplicantDetail(id);
  //       setApplicant(res.data ?? null);
      
  //       console.log("Applicant detail:", res.data);
  //     } catch (err) {
  //       console.error("Error fetching applicant detail:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchDetail();
  // }, [id]);
  


  // const handleResume = async (filename: string) => {
  //   try {
  //     const res = await applicantService.getResumeLink(filename);
  //     const contentType =
  //       res.headers["content-type"] || "application/octet-stream";
  //     const blob = new Blob([res.data], { type: contentType });
  //     const url = window.URL.createObjectURL(blob);

  //     if (contentType === "application/pdf") {
  //       // PDF mở trực tiếp
  //       window.open(url, "_blank");
  //     } else {
  //       // Các file khác download
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", filename);
  //       document.body.appendChild(link);
  //       link.click();
  //       link.remove();
  //     }

  //     // Giải phóng memory
  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     console.error("Error downloading resume:", err);
  //   }
  // };
  
  const handleResume = async (firebaseUrl: string) => {
  try {
    // Lấy tên file từ URL Firebase
    const getFilenameFromFirebaseUrl = (url: string) => {
      const decoded = decodeURIComponent(url);
      const parts = decoded.split('/');
      const lastPart = parts[parts.length - 1]; // ..._NguyenThanhHoan.pdf?alt=media
      return lastPart.split('?')[0]; // bỏ query params
    };

    const filename = getFilenameFromFirebaseUrl(firebaseUrl);

    // Gọi API backend để lấy blob
    const res = await applicantService.getResumeLink(firebaseUrl);

    // Tạo object URL từ blob
    const blob = new Blob([res.data], { type: res.data.type || "application/octet-stream" });
    const fileURL = window.URL.createObjectURL(blob);

    if (filename.endsWith(".pdf")) {
      // Mở PDF trực tiếp
      window.open(fileURL, "_blank");
    } else {
      // Download file khác
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    // Giải phóng memory
    window.URL.revokeObjectURL(fileURL);

    console.log(`Resume opened/downloaded: ${filename}`);
  } catch (error) {
    console.error("Error previewing resume:", error);
  }
};


   if (loading) return <p>Loading...</p>;
  if (!applicant) return <p>Applicant not found.</p>;

return (
  <div className={styles.card}>
    {/* Cột trái - Detail */}
    <div className={styles.detailColumn}>
      <div className={styles.headerRow}>
    <h3 className={styles.title}>Applicant Detail</h3>
    <button 
      className={styles.btn} 
      onClick={() => handleResume(applicant.resumeLink!)}
    >
      View / Download Resume
    </button>
  </div>

      <div className={styles.grid}>
        <p><strong>Job Title:</strong> {applicant.jobTitle}</p>
        {/* Thêm các field khác */}
      </div>

      {applicant.coverLetter && (
        <p className={styles.coverLetter}>
          <strong>Cover Letter:</strong> {applicant.coverLetter}
        </p>
      )}


      <hr className={styles.divider} />
      

    </div>

    {/* Cột phải - Timeline + History */}
    <div className={styles.timelineColumn}>
      <Timeline steps={timeline} />

      {applicant.history && (
        <div className="mt-6">
          <h5 className={styles.subtitle}>History</h5>
          <ul className={styles.historyList}>
            {applicant.history.map((h, idx) => (
              <li key={idx}>
                <strong>{h.status}</strong> - {h.note} 
                <span className="text-xs text-gray-400">
                  ({new Date(h.changedAt).toLocaleString()} bởi {h.changedBy})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

}
