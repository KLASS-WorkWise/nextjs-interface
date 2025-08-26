/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { applyService } from "@/services/applyService";

type ApplicantDetailProps = {
  applicantId: number;
  onClose: () => void;
};

export default function ApplicantDetailModal({ applicantId, onClose }: ApplicantDetailProps) {
  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await applyService.getApplicantDetail(applicantId);
        setApplicant(res?.data);
        console.log("Applicant detail response:", res.data.resumeLink);

      } catch (err: any) {
        console.error(err);
        setError("Không tải được chi tiết ứng viên");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [applicantId]);

 const viewResume = async (filename: string) => {
  if (!filename) return;
  try {
    const res = await applyService.getResumeLink(filename); // Axios trả blob
    const blob = new Blob([res.data], { type: getMimeType(filename) });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  } catch (err) {
    console.error(err);
    alert("Không tải được file");
  }
};

// helper xác định mime type
const getMimeType = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "application/pdf";
  if (ext === "doc") return "application/msword";
  if (ext === "docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return "application/octet-stream";
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!applicant) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chi tiết ứng viên</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-2"><strong>Job ID:</strong> {applicant.jobId}</div>
            <div className="mb-2"><strong>Candidate ID:</strong> {applicant.candidateId}</div>
            <div className="mb-2"><strong>Status:</strong> {applicant.applicationStatus}</div>

            <div className="mb-2">
              <strong>Resume:</strong>{" "}
              {applicant.resumeLink ? (
                <button
                  className="btn btn-link p-0 text-primary"
                  onClick={() => viewResume(applicant.resumeLink)}
                >
                  Xem file
                </button>
              ) : (
                "Chưa có"
              )}
            </div>

            <div className="mb-2"><strong>Cover Letter:</strong> {applicant.coverLetter || "Chưa có"}</div>

            <div className="mb-2">
              <strong>Missing Skills:</strong>{" "}
              {applicant.missingSkills && applicant.missingSkills.length > 0 ? (
                applicant.missingSkills.map((skill: string, idx: number) => (
                  <span key={idx} className="badge bg-danger me-1">{skill}</span>
                ))
              ) : (
                <span className="text-success">Đủ kỹ năng</span>
              )}
            </div>

            <div className="mb-2"><strong>Experience:</strong> {applicant.minExperience}</div>

            <div className="mb-2">
              <strong>Applied At:</strong>{" "}
              {new Date(applicant.appliedAt).toLocaleString()}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
}
