"use client";
/* eslint-disable */
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Users } from "lucide-react";
import { DragDropList } from "../drag-drop-list";
import type { ResumeData } from "../resume-builder";

export function ActivitiesStep() {
  const { register, control } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "activities",
  });

  const addActivity = () => {
    append({
      id: Date.now().toString(),
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
  };

  const renderActivityItem = (
    field: any,
    index: number,
    isDragging?: boolean
  ) => (
    <div
      className={`card mb-3 ${isDragging ? "shadow-lg border-primary" : ""}`}
      key={field.id}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Hoạt động {index + 1}</h6>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => remove(index)}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor={`activityTitle-${index}`} className="form-label">
              Tên hoạt động *
            </label>
            <input
              type="text"
              id={`activityTitle-${index}`}
              className="form-control"
              {...register(`activities.${index}.title`, { required: true })}
              placeholder="Tình nguyện viên, Chủ tịch CLB..."
            />
          </div>

          <div className="col-md-6">
            <label htmlFor={`organization-${index}`} className="form-label">
              Tổ chức *
            </label>
            <input
              type="text"
              id={`organization-${index}`}
              className="form-control"
              {...register(`activities.${index}.organization`, {
                required: true,
              })}
              placeholder="Tên tổ chức, câu lạc bộ..."
            />
          </div>

          <div className="col-md-6">
            <label
              htmlFor={`activityStartDate-${index}`}
              className="form-label"
            >
              Ngày bắt đầu *
            </label>
            <input
              type="date"
              id={`activityStartDate-${index}`}
              className="form-control"
              {...register(`activities.${index}.startDate`, { required: true })}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor={`activityEndDate-${index}`} className="form-label">
              Ngày kết thúc
            </label>
            <input
              type="date"
              id={`activityEndDate-${index}`}
              className="form-control"
              {...register(`activities.${index}.endDate`)}
            />
          </div>
        </div>

        <div className="mt-3">
          <label
            htmlFor={`activityDescription-${index}`}
            className="form-label"
          >
            Mô tả
          </label>
          <textarea
            id={`activityDescription-${index}`}
            className="form-control"
            {...register(`activities.${index}.description`)}
            placeholder="Mô tả chi tiết về hoạt động và vai trò của bạn..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Users size={20} />
          <h5 className="mb-0">Hoạt động</h5>
        </div>
        <button
          type="button"
          onClick={addActivity}
          className="btn btn-primary d-flex align-items-center gap-1"
        >
          <Plus size={16} /> Thêm hoạt động
        </button>
      </div>

      {fields.length === 0 && (
        <div className="card text-center">
          <div className="card-body py-5 d-flex flex-column align-items-center justify-content-center">
            <div
              className="d-flex align-items-center justify-content-center mb-3"
              style={{ width: 56, height: 56 }}
            >
              <Users size={40} className="text-secondary" />
            </div>
            <p className="text-muted">
              Chưa có hoạt động nào. Hãy thêm các hoạt động ngoại khóa của bạn!
            </p>
          </div>
        </div>
      )}

      {fields.length > 0 && (
        <div>
          <div className="alert alert-secondary text-center mb-3">
            💡 Kéo và thả để sắp xếp lại thứ tự hoạt động
          </div>
          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderActivityItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}
    </div>
  );
}
