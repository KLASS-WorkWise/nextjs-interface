/* eslint-disable */
"use client";

import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { ResumeData } from "./resume-builder";
import type { CustomizationOptions } from "./customization-panel";
import { ModernTemplate } from "./resume-templates/modern-template";
import { ClassicTemplate } from "./resume-templates/classic-template";
import { mapFormToApi, resumeApi } from "@/lib/api";
import styles from "./resume-preview.module.css";

interface ResumePreviewProps {
  data: ResumeData;
  template?: string;
  customization?: CustomizationOptions;
  isCompact?: boolean;
  onSave?: (resumeData: ResumeData) => void;
  resumeData?: ResumeData;
}

const defaultCustomization: CustomizationOptions = {
  font: "inter",
  colorScheme: "blue",
  spacing: "normal",
  fontSize: "medium",
};

export function ResumePreview({
  data,
  template = "modern",
  customization = defaultCustomization,
  isCompact = false,
  onSave,
  resumeData,
}: ResumePreviewProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCV = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const dataWithTemplate = { ...data, template: template } as any;
      const apiData = mapFormToApi(dataWithTemplate);
      if (data.id) {
        await resumeApi.updateMyResume(data.id, apiData);
      } else {
        await resumeApi.saveMyResume(apiData);
      }

      toast({
        title: "Lưu CV thành công!",
        description: "CV của bạn đã được lưu lên server.",
      });

      if (onSave) {
        onSave(dataWithTemplate as any);
      }
    } catch (error: any) {
      console.error("Error saving CV:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể lưu CV. Vui lòng thử lại.";
      toast({
        title: "Lỗi khi lưu CV",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderTemplate = () => {
    const tpl = (template || "modern").toLowerCase();
    const normalized = tpl.includes("classic")
      ? "classic"
      : tpl.includes("modern")
      ? "modern"
      : "modern";
    switch (normalized) {
      case "classic":
        return (
          <ClassicTemplate
            data={data}
            customization={customization}
            isCompact={isCompact}
          />
        );
      case "modern":
      default:
        return (
          <ModernTemplate
            data={data}
            customization={customization}
            isCompact={isCompact}
          />
        );
    }
  };

  return (
    <div
      className={isCompact ? styles.compactPreview : `card mx-auto shadow`}
      style={
        isCompact
          ? {
              minWidth: 0,
              minHeight: 0,
              padding: 0,
              background: "#fff",
              overflow: "visible",
            }
          : { maxWidth: "56rem", maxHeight: "90vh", overflowY: "auto" }
      }
    >
      <div
        className={isCompact ? undefined : `card-body p-4`}
        style={isCompact ? { padding: 0 } : {}}
      >
        {!isCompact && (
          <div className={styles.saveButtonContainer}>
            <button
              onClick={handleSaveCV}
              disabled={isSaving}
              className={`btn btn-primary d-flex align-items-center gap-2 ${styles.saveButton}`}
            >
              <Save
                size={16}
                className={isSaving ? "spinner-border spinner-border-sm" : ""}
              />
              {isSaving ? "Đang lưu..." : "Lưu CV"}
            </button>
          </div>
        )}
        <div
          className={!isCompact ? "shadow-lg" : "d-flex justify-content-center"}
          style={
            isCompact
              ? { width: "100%", height: "100%", overflow: "hidden" }
              : { aspectRatio: "8.5 / 11" }
          }
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
