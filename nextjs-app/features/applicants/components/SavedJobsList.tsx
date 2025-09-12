/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { savedJobService } from "@/features/applicants/services/savedJobService";
import Link from "next/link";

export default function SavedJobsList() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSavedJobs = async () => {
    try {
      const res = await savedJobService.getMySavedJobs();
      setSavedJobs(res.data || []);
    } catch (err: any) {
      console.error("Error fetching saved jobs", err);
      setMessage("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (savedJobId: number) => {
    try {
      // const confirmed = confirm("Are you sure you want to delete this saved job??");
      // if (!confirmed) return false;
      setRemovingId(savedJobId);
      await savedJobService.removeSavedJob(savedJobId);

      setSavedJobs(savedJobs.filter((job) => job.savedJobId !== savedJobId));
      setMessage("Xóa thành công!");
      setTimeout(() => setMessage(null), 3000); // 3s auto-hide
    } catch (err: any) {
      console.error(
        "Error removing saved job:",
        err.response?.data?.message || err.message
      );
      setMessage(
        "Xóa thất bại: " + (err.response?.data?.message || err.message)
      );
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
    <div className="row">
      {message && (
        <div
          style={{ marginBottom: "15px", color: "green", fontWeight: "bold" }}
        >
          {message}
        </div>
      )}
      {savedJobs.map((job) => (
        <div
          key={job.savedJobId}
          className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
        >
          <div className="card-grid-2 hover-up">
            <div className="card-grid-2-image-left">
              <div className="image-box">
                <img src="assets/imgs/brands/brand-5.png" alt="jobBox" />
              </div>
              <div className="right-info">
                <span className="name-job">
                  {job.jobPostingResponseDTO.employerName}
                </span>
                <span className="location-small">
                  {job.jobPostingResponseDTO.location}
                </span>
              </div>
            </div>
            <div className="card-block-info">
              <h6>
                <Link href={`/job-details/${job.jobPostingResponseDTO.id}`}>
                  <span>{job.jobPostingResponseDTO.title}</span>
                </Link>
              </h6>
              <p className="font-sm color-text-paragraph mt-15">
                {job.jobPostingResponseDTO.description}
              </p>
              <div className="card-2-bottom mt-30 d-flex justify-content-between gap-2">
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemove(job.savedJobId)}
                  disabled={removingId === job.savedJobId}
                >
                  {removingId === job.savedJobId ? "Deleting..." : "Delete"}
                </button>

                <button className="btn btn-apply">Apply</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
