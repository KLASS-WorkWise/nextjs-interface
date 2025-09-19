/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { savedJobService } from "@/features/applicants/services/savedJobService";
import Link from "next/link";
import styles from "../../../styles/SavedJobsList.module.css";

export default function SavedJobsList() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSavedJobs = async () => {
    try {
      const res = await savedJobService.getMySavedJobs();
      setSavedJobs(res.data || []);
    } catch (err: any) {
      console.error("Error fetching saved jobs", err);
      setMessage({ type: "error", text: "Failed to load saved jobs" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (savedJobId: number) => {
    try {
      setRemovingId(savedJobId);
      await savedJobService.removeSavedJob(savedJobId);

      setSavedJobs(savedJobs.filter((job) => job.savedJobId !== savedJobId));
      setMessage({ type: "success", text: "Xóa thành công!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error("Error removing saved job:", err);
      setMessage({
        type: "error",
        text: "Xóa thất bại: " + (err.response?.data?.message || err.message),
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {message && (
        <div className={`${styles.message} ${message.type === "success" ? styles.success : styles.error}`}>
          {message.text}
        </div>
      )}

      <div className={styles.wrapper}>
        {savedJobs.map((job) => (
          <div key={job.savedJobId} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.logo}>
                <img src="assets/imgs/brands/brand-5.png" alt="jobBox" />
              </div>
              <div className={styles.info}>
                <span className={styles.company}>{job.jobPostingResponseDTO.employerName}</span>
                <span className={styles.location}>{job.jobPostingResponseDTO.location}</span>
              </div>
            </div>

            <div className={styles.body}>
              <h6>
                <Link href={`/job-details/${job.jobPostingResponseDTO.id}`}>
                  {job.jobPostingResponseDTO.title}
                </Link>
              </h6>
              <p className={styles.description}>{job.jobPostingResponseDTO.description}</p>
            </div>

            <div className={styles.footer}>
              <button
                className={`${styles.btn} ${styles.delete}`}
                onClick={() => handleRemove(job.savedJobId)}
                disabled={removingId === job.savedJobId}
              >
                {removingId === job.savedJobId ? "Deleting..." : "Delete"}
              </button>

              <button className={`${styles.btn} ${styles.apply}`}>Apply</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
