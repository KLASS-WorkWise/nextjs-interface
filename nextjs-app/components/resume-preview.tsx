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
      const apiData = mapFormToApi(data);
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
        onSave(data);
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
    switch (template) {
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
      className={`card ${isCompact ? "" : "mx-auto shadow"}`}
      style={
        isCompact
          ? {}
          : { maxWidth: "56rem", maxHeight: "90vh", overflowY: "auto" }
      }
    >
      <div
        className={`card-body ${isCompact ? "p-0" : "p-4"}`}
        style={isCompact ? {} : {}}
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
          className={!isCompact ? "shadow-lg" : ""}
          style={isCompact ? {} : { aspectRatio: "8.5 / 11" }}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
