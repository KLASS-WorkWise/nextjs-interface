"use client";

import type { ResumeData } from "./resume-builder";
import { ResumeCardItem } from "./resume-card-item";

interface CVCardProps {
  resume: ResumeData;
  onEdit: () => void;
  onDelete: () => void;
}

export function CVCard({ resume, onEdit, onDelete }: CVCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
      {/* Preview section */}
      <div className="position-relative">
        <div className="p-3 bg-light">
          <ResumeCardItem data={resume} />
        </div>

        {/* Overlay actions */}
        <div className="hover-overlay position-absolute top-0 end-0 p-2 d-flex gap-2 opacity-0 hover-overlay">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={onEdit}
            title="Chỉnh sửa"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={onDelete}
            title="Xóa"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3,6 5,6 21,6" />
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="card-body text-center">
        <h5 className="card-title mb-1">
          {resume?.personalInfo?.fullName || "CV không có tên"}
        </h5>
        <p className="card-text text-muted small">
          Cập nhật {formatDate(new Date())}
        </p>
      </div>
    </div>
  );
}
