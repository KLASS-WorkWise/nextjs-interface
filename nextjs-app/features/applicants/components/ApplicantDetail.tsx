"use client";
import { useState } from "react";
import { Applicant } from "@/types/applicant";
import { applicantService } from "../services/applicant.service";

type Props = {
  applicant: Applicant;
  role: "hr" | "applicant"; // phân quyền
};

export default function ApplicantDetail({ applicant: initialApplicant, role }: Props) {
  const [applicant, setApplicant] = useState<Applicant>(initialApplicant);
  const [updatingStep, setUpdatingStep] = useState<string | null>(null);

  // Cập nhật từng bước timeline (chỉ HR mới dùng)
  const handleUpdateStep = async (step: string) => {
    if (role !== "hr") return;
    setUpdatingStep(step);
    try {
      const res = await applicantService.updateStep(applicant.id, step);
      setApplicant(res.data); // cập nhật applicant + history
    } finally {
      setUpdatingStep(null);
    }
  };

  // Download resume (cả HR và applicant đều có thể)
  const downloadResume = async () => {
    if (!applicant.resumeLink) return alert("No resume available");
    const res = await applicantService.getResumeLink(applicant.resumeLink);
    const url = window.URL.createObjectURL(res.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = applicant.resumeLink;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getStepClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "done":
        return "bg-green-500 text-white";
      case "in-progress":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-gray-300 text-gray-600";
      default:
        return "bg-gray-300 text-gray-600";
    }
  };

  const getStepIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "done":
        return "✓";
      case "in-progress":
        return "…";
      case "pending":
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto my-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Applicant Detail</h1>

      <div className="mb-6 space-y-2">
        <p><strong>Job ID:</strong> {applicant.jobId}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="text-blue-600 font-semibold">{applicant.applicationStatus}</span>
        </p>
        <p><strong>Applied at:</strong> {new Date(applicant.appliedAt).toLocaleDateString()}</p>

        {applicant.coverLetter && (
          <p><strong>Cover letter:</strong> {applicant.coverLetter}</p>
        )}

        {applicant.resumeLink && (
          <button
            onClick={downloadResume}
            style={{
              padding: "0.6rem 1.2rem",
              background: "#2563eb",
              borderRadius: "8px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#1d4ed8")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#2563eb")}
          >
            📄 Download Resume
          </button>
        )}
      </div>

      <h2 className="font-semibold mb-3 text-gray-700">Application Timeline</h2>
      <ol className="border-l-2 border-gray-300 ml-4">
        {applicant.history?.map((h) => (
          <li key={h.step} className="mb-6 relative pl-6">
            <span
              className={`absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center ${getStepClass(h.status)}`}
            >
              {getStepIcon(h.status)}
            </span>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-gray-800">{h.step}</p>
                {h.date && (
                  <p className="text-sm text-gray-500">{new Date(h.date).toLocaleDateString()}</p>
                )}
              </div>

              {/* Nút update step chỉ hiển thị với HR */}
              {role === "hr" && h.status.toLowerCase() !== "done" && (
                <button
                  disabled={updatingStep === h.step}
                  onClick={() => handleUpdateStep(h.step)}
                  className="mt-2 md:mt-0 ml-0 md:ml-4 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {updatingStep === h.step ? "Updating..." : "Mark Done"}
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
