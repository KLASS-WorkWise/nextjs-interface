"use client";
import { useEffect, useState } from "react";
import { applicantService } from "@/features/applicants/services/applicant.service";
import { Applicant } from "@/types/applicant";

type Props = {
  applicantId: number;
  onClose: () => void;
};

export default function ApplicantDetailModal({ applicantId, onClose }: Props) {
  const [applicant, setApplicant] = useState<Applicant | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await applicantService.getApplicantDetail(applicantId);
      const apiRes: Applicant = res.data;
      setApplicant(apiRes);
    };
    fetchDetail();
  }, [applicantId]);

  // inject keyframes animation vào document 1 lần
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInScale {
        0% {
          opacity: 0;
          transform: scale(0.95);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!applicant)
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "2rem",
            width: "400px",
            textAlign: "center",
            fontWeight: 500,
            color: "#374151",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)",
            animation: "fadeInScale 0.25s ease",
          }}
        >
          Loading detail...
        </div>
      </div>
    );

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

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "2rem",
          width: "480px",
          maxWidth: "90%",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
          position: "relative",
          animation: "fadeInScale 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "transparent",
            border: "none",
            fontSize: "1.25rem",
            cursor: "pointer",
            color: "#6b7280",
          }}
        >
          ✕
        </button>

        {/* Tiêu đề */}
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "#111827",
          }}
        >
          Applicant Detail
        </h2>

        {/* Thông tin */}
        {[
          ["Job ID", applicant.jobId],
          ["Status", applicant.applicationStatus],
          ["Applied at", applicant.appliedAt],
          ["Cover letter", applicant.coverLetter ?? "N/A"],
          [
            "Missing skills",
            applicant.missingSkills?.join(", ") ?? "None",
          ],
        ].map(([label, value], idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
              fontSize: "0.95rem",
            }}
          >
            <span
              style={{
                fontWeight: 600,
                color: "#1e3a8a",
                minWidth: "120px",
              }}
            >
              {label}:
            </span>
            <span style={{ color: "#374151" }}>{value as string}</span>
          </div>
        ))}

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "1.5rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.6rem 1.2rem",
              background: "#e5e7eb",
              borderRadius: "8px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              color: "#374151",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "#d1d5db")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "#e5e7eb")
            }
          >
            Close
          </button>
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
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#1d4ed8")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "#2563eb")
              }
            >
              📄 Download Resume
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
