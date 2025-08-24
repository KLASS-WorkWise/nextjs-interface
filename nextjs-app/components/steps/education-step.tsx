"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { DragDropList } from "../drag-drop-list";
import type { ResumeData } from "../resume-builder";

export function EducationStep() {
  const { register, control, watch, setValue } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "education",
  });

  const degreeOptions = [
    "Tiến sĩ (Ph.D)",
    "Thạc sĩ (Master)",
    "Cử nhân (Bachelor)",
    "Kỹ sư (Engineer)",
    "Cao đẳng (Associate)",
    "Trung cấp (Diploma)",
    "Chứng chỉ (Certificate)",
    "Khác",
  ];

  const majorOptions = [
    "Công nghệ thông tin",
    "Khoa học máy tính",
    "Kỹ thuật phần mềm",
    "Hệ thống thông tin",
    "An ninh mạng",
    "Trí tuệ nhân tạo",
    "Khoa học dữ liệu",
    "Kỹ thuật điện tử",
    "Kỹ thuật cơ khí",
    "Kỹ thuật xây dựng",
    "Kinh tế",
    "Quản trị kinh doanh",
    "Marketing",
    "Tài chính - Ngân hàng",
    "Kế toán",
    "Luật",
    "Y học",
    "Dược học",
    "Giáo dục",
    "Ngôn ngữ Anh",
    "Thiết kế đồ họa",
    "Kiến trúc",
    "Khác",
  ];

  const addEducation = () => {
    append({
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    });
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
  };

  const renderEducationItem = (field: any, index: number, isDragging?: boolean) => (
    <div key={field.id} className={`card mb-4 ${isDragging ? "shadow-lg" : ""}`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Học vấn {index + 1}</h6>
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
            <label className="form-label" htmlFor={`institution-${index}`}>
              Trường học *
            </label>
            <input
              id={`institution-${index}`}
              className="form-control"
              {...register(`education.${index}.institution`, { required: true })}
              placeholder="Tên trường học"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor={`degree-${index}`}>
              Bằng cấp *
            </label>
            <select
              id={`degree-${index}`}
              className="form-select"
              {...register(`education.${index}.degree`, { required: true })}
              value={watch(`education.${index}.degree`) || ""}
              onChange={(e) => setValue(`education.${index}.degree`, e.target.value)}
            >
              <option value="">Chọn bằng cấp</option>
              {degreeOptions.map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor={`field-${index}`}>
              Chuyên ngành *
            </label>
            <select
              id={`field-${index}`}
              className="form-select"
              {...register(`education.${index}.field`, { required: true })}
              value={watch(`education.${index}.field`) || ""}
              onChange={(e) => setValue(`education.${index}.field`, e.target.value)}
            >
              <option value="">Chọn chuyên ngành</option>
              {majorOptions.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor={`gpa-${index}`}>
              GPA
            </label>
            <input
              id={`gpa-${index}`}
              className="form-control"
              {...register(`education.${index}.gpa`)}
              placeholder="3.5/4.0"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor={`startDate-${index}`}>
              Ngày bắt đầu *
            </label>
            <input
              type="date"
              id={`startDate-${index}`}
              className="form-control"
              {...register(`education.${index}.startDate`, { required: true })}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor={`endDate-${index}`}>
              Ngày tốt nghiệp *
            </label>
            <input
              type="date"
              id={`endDate-${index}`}
              className="form-control"
              {...register(`education.${index}.endDate`, { required: true })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="education-step">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <GraduationCap size={20} />
          <h5 className="mb-0">Học vấn</h5>
        </div>
        <button type="button" onClick={addEducation} className="btn btn-primary btn-sm">
          <Plus size={16} className="me-1" />
          Thêm học vấn
        </button>
      </div>

      {/* Khi chưa có học vấn */}
      {fields.length === 0 && (
        <div className="card">
          <div className="card-body text-center py-5 text-muted">
            <GraduationCap size={40} className="mb-3" />
            <p>Chưa có thông tin học vấn nào. Hãy thêm trình độ học vấn của bạn!</p>
          </div>
        </div>
      )}

      {/* Khi có học vấn */}
      {fields.length > 0 && (
        <div>
          <div className="mb-3 p-3 rounded border border-dashed text-center text-muted small">
            💡 Kéo và thả để sắp xếp lại thứ tự học vấn
          </div>

          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderEducationItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}

      {/* CSS nhỏ cho placeholder */}
      <style jsx>{`
        .form-control::placeholder,
        .form-select::placeholder {
          font-size: 0.875rem;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
}
