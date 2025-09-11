/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { applicantService, ApplicantTimeline } from "../services/applicant.service";
import { Applicant } from "@/types/applicant";
import styles from '../../../styles/ApplicantDetail.module.css';// css riêng cho component
import ApplicantTimelineView from "./ApplicantTimeline";



type Props = { id: number };

export default function ApplicantDetail({ id }: Props) {
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);

    const [timeline, setTimeline] = useState<ApplicantTimeline[]>([]);
  // State cho HR update
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  const fetchDetail = async () => {
    try {
      const res = await applicantService.getApplicantDetail(id);
      setApplicant(res.data ?? null);
    } catch (err) {
      console.error("Error fetching applicant detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    try {
      const res = await applicantService.getTimeline(id);
      setTimeline(res.data ?? []);
    } catch (err) {
      console.error("Error fetching applicant timeline:", err);
    }
  };

  useEffect(() => {
    fetchDetail();
    fetchTimeline();
  }, [id]);

 const handleUpdateStatus = async () => {
    try {
      if (!status) {
        alert("❌ Vui lòng nhập status");
        return;
      }
      await applicantService.updateStatus(applicant!.id, { status, note });
      alert("✅ Cập nhật trạng thái thành công");
      setStatus("");
      setNote("");
      fetchDetail();
      fetchTimeline();
    } catch (err) {
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
  

//   const downloadResume = async (filename: string) => {
//     const res = await applicantService.getResumeLink(filename);
//     const url = window.URL.createObjectURL(new Blob([res.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", filename); // đặt tên file gốc
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(url);
//   };
  const handleResume = async (filename: string) => {
    try {
      const res = await applicantService.getResumeLink(filename);
      const contentType =
        res.headers["content-type"] || "application/octet-stream";
      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      if (contentType === "application/pdf") {
        // PDF mở trực tiếp
        window.open(url, "_blank");
      } else {
        // Các file khác download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      // Giải phóng memory
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading resume:", err);
    }
  };

   if (loading) return <p>Loading...</p>;
  if (!applicant) return <p>Applicant not found.</p>;

  return (
    <div className={styles.card}>
  <h3 className={styles.title}>Applicant Detail #{applicant.id}</h3>

  <div className={styles.grid}>
    <p><strong>Job Title:</strong> {applicant.jobTitle}</p>
    <p><strong>Candidate ID:</strong> {applicant.candidateId}</p>
    ...
  </div>

  {applicant.coverLetter && (
    <p className={styles.coverLetter}><strong>Cover Letter:</strong> {applicant.coverLetter}</p>
  )}

  <button className={styles.btn} onClick={() => handleResume(applicant.resumeLink!)}>
    View / Download Resume
  </button>

  <hr />

  <h5 className={styles.subtitle}>Evaluation Result</h5>
  <p><strong>Required Experience:</strong> {applicant.minExperience}</p>
  <p><strong>Candidate Experience:</strong> {applicant.experienceYears} years</p>
  <p>
    <strong>Skill Match:</strong> {applicant.skillMatchPercent}%{" "}
    {applicant.isSkillQualified 
      ? <span className={styles.textSuccess}>✅ Qualified</span> 
      : <span className={styles.textDanger}>❌ Missing</span>}
  </p>

  {applicant.missingSkills?.length ? (
    <div>
      <strong>Missing Skills:</strong>
      <div>
        {applicant.missingSkills.map((skill, i) => (
          <span key={i} className={styles.missingSkill}>{skill}</span>
        ))}
      </div>
    </div>
  ) : (
    <p className={styles.textSuccess}>No missing skills ✅</p>
  )}

  {applicant.history && (
    <div>
      <h5 className={styles.subtitle}>History</h5>
      <ul className={styles.historyList}>
        {applicant.history.map((h, idx) => (
          <li key={idx}>
            <strong>{h.step}</strong> - {h.status}{" "}
            {h.date && `(${new Date(h.date).toLocaleDateString()})`}
          </li>
        ))}
      </ul>
    </div>
  )}
  <hr />

      {/* Timeline cho Candidate
      <ApplicantTimelineView timeline={timeline} /> */}
  
      {/* Thông tin khác */}
      <hr />
   
   {applicant.history && (
        <div>
          <h5 className={styles.subtitle}>History</h5>
          <ul className={styles.historyList}>
            {applicant.history.map((h, idx) => (
              <li key={idx}>
                <strong>{h.status}</strong> - {h.note}{" "}
                {/* ({new Date(h.changedAt).toLocaleDateString()} bởi {h.changedBy}) */}
                 ({new Date(h.changedAt).toLocaleString()})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Form HR update status
      <div className={styles.updateForm}>
        <h5>Update Status</h5>
        <input
          type="text"
          placeholder="Status..."
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <input
          type="text"
          placeholder="Note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className={styles.btn} onClick={handleUpdateStatus}>
          Update
        </button>
      </div> */}
</div>
  );
}
