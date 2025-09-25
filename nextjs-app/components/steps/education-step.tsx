"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { DragDropList } from "../drag-drop-list";
import type { ResumeData } from "../resume-builder";

export function EducationStep() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ResumeData>();
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
  type EducationField = {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
  };

  const renderEducationItem = (
    field: EducationField,
    index: number,
    isDragging?: boolean
  ) => (
    <div
      key={field.id}
      className={`card mb-4 ${isDragging ? "shadow-lg" : ""}`}
    >
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
              {...register(`education.${index}.institution`, {
                required: true,
              })}
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
              onChange={(e) =>
                setValue(`education.${index}.degree`, e.target.value)
              }
              style={{
                height: "calc(2.25rem + 13px)",
                padding: "0.375rem 0.75rem",
                fontSize: "1rem",
                lineHeight: "1.5",
                borderRadius: ".375rem",
                border: "1px solid #ced4da",
              }}
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
              onChange={(e) =>
                setValue(`education.${index}.field`, e.target.value)
              }
              style={{
                height: "calc(2.25rem + 13px)",
                padding: "0.375rem 0.75rem",
                fontSize: "1rem",
                lineHeight: "1.5",
                borderRadius: ".375rem",
                border: "1px solid #ced4da",
              }}
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
              {...register(`education.${index}.gpa`, {
                validate: (value) => {
                  if (value === "" || value === undefined) return true;
                  const num = parseFloat(value);
                  if (isNaN(num)) return "GPA không hợp lệ";
                  if (num < 0 || num > 4) return "GPA 0-4";
                  return true;
                },
              })}
              placeholder="3.5/4.0"
            />
            {errors?.education?.[index]?.gpa && (
              <div className="text-danger small mt-1">
                {errors.education[index].gpa.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor={`startDate-${index}`}>
              Ngày bắt đầu *
            </label>
            <input
              type="date"
              id={`startDate-${index}`}
              className="form-control"
              {...register(`education.${index}.startDate`, {
                required: true,
                validate: (startDate) => {
                  const endDate = watch(`education.${index}.endDate`);
                  const today = new Date().toISOString().slice(0, 10);
                  if (startDate > today) return "Không quá hiện tại";
                  if (endDate && startDate > endDate)
                    return "Bắt đầu <= kết thúc";
                  return true;
                },
              })}
            />
            {errors?.education?.[index]?.startDate && (
              <div className="text-danger small mt-1">
                {errors.education[index].startDate.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor={`endDate-${index}`}>
              Ngày tốt nghiệp *
            </label>
            <input
              type="date"
              id={`endDate-${index}`}
              className="form-control"
              {...register(`education.${index}.endDate`, {
                required: true,
                validate: (endDate) => {
                  if (!endDate) return true;
                  const today = new Date().toISOString().slice(0, 10);
                  if (endDate > today) return "Không quá hiện tại";
                  return true;
                },
              })}
            />
            {errors?.education?.[index]?.endDate && (
              <div className="text-danger small mt-1">
                {errors.education[index].endDate.message}
              </div>
            )}
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
        <button
          type="button"
          onClick={addEducation}
          className="btn btn-primary btn-sm d-inline-flex align-items-center"
        >
          <Plus size={16} className="me-1" />
          Thêm học vấn
        </button>
      </div>

      {/* Khi chưa có học vấn */}
      {fields.length === 0 && (
        <div className="card">
          <div className="card-body text-center py-5 text-muted d-flex flex-column align-items-center justify-content-center">
            <div
              className="d-flex align-items-center justify-content-center mb-3"
              style={{ width: 56, height: 56 }}
            >
              <GraduationCap size={40} />
            </div>
            <p>
              Chưa có thông tin học vấn nào. Hãy thêm trình độ học vấn của bạn!
            </p>
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
