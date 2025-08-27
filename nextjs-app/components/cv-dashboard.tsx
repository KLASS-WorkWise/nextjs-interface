"use client";
/* eslint-disable */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { CVEmptyState } from "@/components/cv-empty-state";
import type { ResumeData } from "@/components/resume-builder";

import { mapApiToForm, resumeApi } from "@/lib/api";

import { useToast } from "./ui/use-toast";
import ResumeUpdate from "./resume-update";
import { ViewCv } from "./view-cv";
import { CVList } from "./cv-list";

type ViewState = "empty" | "list" | "builder";

export function CVDashboard() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<ViewState>("empty");
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [editingResume, setEditingResume] = useState<ResumeData | null>(null);
  const { toast } = useToast();
  const [previewResume, setPreviewResume] = useState<ResumeData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const loadResumes = async () => {
    try {
      const apiResumes = await resumeApi.getMyResume();
      const mappedResumes = Array.isArray(apiResumes)
        ? apiResumes.map((r: any) => mapApiToForm(r))
        : apiResumes
        ? [mapApiToForm(apiResumes)]
        : [];
      setResumes(mappedResumes);

      if (mappedResumes.length > 0) {
        setCurrentView("list");
      } else {
        setCurrentView("empty");
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
      toast({ description: "Lỗi: Không thể tải danh sách CV" });
      setCurrentView("empty");
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleCreateNewCV = () => {
    setEditingResume(null);
    setCurrentView("builder");
  };

  const handleEditCV = async (resume: ResumeData) => {
    try {
      const getDataResumeById = await resumeApi.getResumeById(resume.id);
      const mappedResume = mapApiToForm(getDataResumeById);
      console.log("[Edit Icon Clicked] Resume data:", mappedResume);
      setEditingResume(mappedResume);
      setCurrentView("builder");
    } catch (error) {
      console.error("Failed to load resume:", error);
      toast({ description: "Lỗi: Không thể tải CV" });
    }
  };

  const handleDeleteCV = async (resumeId: number) => {
    try {
      await resumeApi.deleteResume(resumeId);

      // remove from local state
      setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));
      if (resumes.length === 1) {
        setCurrentView("empty");
      } else {
        setCurrentView("list");
      }
      await loadResumes();
    } catch (error) {
      console.error("Failed to delete resume:", error);
      toast({ description: "Lỗi: Không thể xóa CV" });
    }
  };

  const handleBackToList = () => {
    if (resumes.length > 0) {
      setCurrentView("list");
    } else {
      setCurrentView("empty");
    }
  };

  const handleCVSaved = async (newResume: ResumeData) => {
    await loadResumes(); // Gọi lại API để lấy danh sách mới nhất
    setCurrentView("list");
  };

  const handlePreviewCV = (resume: ResumeData) => {
    setPreviewResume(resume);
    setShowPreview(true);
  };

  if (currentView === "builder") {
    // Nếu đang tạo mới CV
    if (editingResume === null) {
      return (
        <ResumeUpdate
          onBack={handleBackToList}
          onSave={handleCVSaved}
          initialData={undefined}
        />
      );
    }
    // Nếu đang edit, chỉ render khi đã có dữ liệu
    if (!editingResume) return <div>Đang tải dữ liệu...</div>;
    return (
      <ResumeUpdate
        onBack={handleBackToList}
        onSave={handleCVSaved}
        initialData={editingResume}
      />
    );
  }

  if (currentView === "list") {
    return (
      <>
        <CVList
          resumes={resumes}
          onCreateNew={handleCreateNewCV}
          onEditCV={handleEditCV}
          onDeleteCV={handleDeleteCV}
          onPreviewCV={handlePreviewCV}
        />
        {showPreview && previewResume && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowPreview(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 8,
                padding: 24,
                maxWidth: "90vw",
                maxHeight: "90vh",
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPreview(false)}
                style={{
                  position: "absolute",
                  top: 24,
                  right: 32,
                  zIndex: 10000,
                }}
                className="btn btn-secondary"
              >
                Đóng
              </button>
              {/* Hiển thị ViewCv ở chế độ chỉ xem */}
              <ViewCv data={previewResume} isCompact={false} />
            </div>
          </div>
        )}
      </>
    );
  }

  return <CVEmptyState onCreateNew={handleCreateNewCV} />;
}
