"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import type { ResumeData } from "../resume-builder";
import { Plus, Trash2, Briefcase } from "lucide-react";
import { DragDropList } from "../drag-drop-list";

export function ExperienceStep() {
  const { register, control, watch, setValue } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "experience",
  });

  const positionOptions = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "Marketing Manager",
    "Sales Manager",
    "Business Analyst",
    "Project Manager",
    "Quality Assurance",
    "System Administrator",
    "Database Administrator",
    "Mobile Developer",
    "Web Developer",
    "Technical Lead",
    "Team Lead",
    "Senior Developer",
    "Junior Developer",
    "Intern",
    "Freelancer",
    "Consultant",
    "Other",
  ];

  const addExperience = () => {
    append({
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
  };

  const renderExperienceItem = (field: any, index: number, isDragging?: boolean) => {
    return (
      <div key={field.id} className={`card mb-4 ${isDragging ? "shadow-lg" : ""}`}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Kinh nghiệm {index + 1}</h6>
          <button
            type="button"
            className="btn btn-link text-danger p-0"
            onClick={() => remove(index)}
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor={`company-${index}`}>
                Công ty *
              </label>
              <input
                id={`company-${index}`}
                className="form-control"
                {...register(`experience.${index}.company`, { required: true })}
                placeholder="Tên công ty"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor={`position-${index}`}>
                Vị trí *
              </label>
              <select
                id={`position-${index}`}
                className="form-select"
                {...register(`experience.${index}.position`, { required: true })}
                value={watch(`experience.${index}.position`) || ""}
                onChange={(e) =>
                  setValue(`experience.${index}.position`, e.target.value)
                }
              >
                <option value="">Chọn vị trí công việc</option>
                {positionOptions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* Ngày bắt đầu & Ngày kết thúc cùng 1 hàng */}
            <div className="col-md-6">
              <label className="form-label" htmlFor={`startDate-${index}`}>
                Ngày bắt đầu *
              </label>
              <input
                type="date"
                id={`startDate-${index}`}
                className="form-control"
                {...register(`experience.${index}.startDate`, { required: true })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor={`endDate-${index}`}>
                Ngày kết thúc
              </label>
              <input
                type="date"
                id={`endDate-${index}`}
                className="form-control"
                {...register(`experience.${index}.endDate`)}
              />
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor={`description-${index}`}>
                Mô tả công việc
              </label>
              <textarea
                id={`description-${index}`}
                className="form-control"
                rows={3}
                {...register(`experience.${index}.description`)}
                placeholder="Mô tả chi tiết về công việc, thành tích đạt được..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="experience-step">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Briefcase size={20} />
          <h5 className="mb-0">Kinh nghiệm làm việc</h5>
        </div>
        <button type="button" onClick={addExperience} className="btn btn-primary btn-sm">
          <Plus size={16} className="me-1" />
          Thêm kinh nghiệm
        </button>
      </div>

      {/* Khi chưa có kinh nghiệm */}
      {fields.length === 0 && (
        <div className="card">
          <div className="card-body text-center py-5 text-muted">
            <Briefcase size={40} className="mb-3" />
            <p>Chưa có kinh nghiệm làm việc nào. Hãy thêm kinh nghiệm đầu tiên của bạn!</p>
          </div>
        </div>
      )}

      {/* Khi có kinh nghiệm */}
      {fields.length > 0 && (
        <div>
          <div className="mb-3 p-3 rounded border border-dashed text-center text-muted small">
            💡 Kéo và thả để sắp xếp lại thứ tự kinh nghiệm
          </div>

          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderExperienceItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}

      {/* CSS nhỏ cho placeholder */}
      <style jsx>{`
        .form-control::placeholder,
        .form-select::placeholder,
        textarea::placeholder {
          font-size: 0.875rem;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
}
