"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Award } from "lucide-react";
import { DragDropList } from "../drag-drop-list";
import type { ResumeData } from "../resume-builder";

export function AwardsStep() {
  const { register, control } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "awards",
  });

  const addAward = () => {
    append({
      id: Date.now().toString(),
      title: "",
      issuer: "",
      date: "",
      description: "",
    });
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
  };

  const renderAwardItem = (field: any, index: number, isDragging?: boolean) => (
    <div
      key={field.id}
      className={`card mb-3 ${isDragging ? "shadow-lg border-primary" : ""}`}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Giải thưởng {index + 1}</h6>
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
            <label htmlFor={`awardTitle-${index}`} className="form-label">
              Tên giải thưởng *
            </label>
            <input
              id={`awardTitle-${index}`}
              type="text"
              className="form-control"
              placeholder="Học sinh giỏi, Chứng chỉ TOEIC..."
              {...register(`awards.${index}.title`, { required: true })}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor={`issuer-${index}`} className="form-label">
              Đơn vị trao *
            </label>
            <input
              id={`issuer-${index}`}
              type="text"
              className="form-control"
              placeholder="Trường học, tổ chức..."
              {...register(`awards.${index}.issuer`, { required: true })}
            />
          </div>

          <div className="col-md-12">
            <label htmlFor={`awardDate-${index}`} className="form-label">
              Ngày nhận *
            </label>
            <input
              id={`awardDate-${index}`}
              type="date"
              className="form-control"
              {...register(`awards.${index}.date`, { required: true })}
            />
          </div>

          <div className="col-12">
            <label htmlFor={`awardDescription-${index}`} className="form-label">
              Mô tả
            </label>
            <textarea
              id={`awardDescription-${index}`}
              rows={2}
              className="form-control"
              placeholder="Mô tả chi tiết về giải thưởng..."
              {...register(`awards.${index}.description`)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Award size={20} />
          <h5 className="mb-0">Giải thưởng & Chứng chỉ</h5>
        </div>
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={addAward}>
          <Plus size={16} /> Thêm giải thưởng
        </button>
      </div>

      {/* Empty state */}
      {fields.length === 0 && (
        <div className="card">
          <div className="card-body text-center py-5 text-muted">
            <Award size={40} className="mb-3" />
            <p>Chưa có giải thưởng nào. Hãy thêm các giải thưởng và chứng chỉ của bạn!</p>
          </div>
        </div>
      )}

      {/* List with drag-drop */}
      {fields.length > 0 && (
        <div>
          <div className="alert alert-secondary text-center small mb-3">
            💡 Kéo và thả để sắp xếp lại thứ tự giải thưởng
          </div>
          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderAwardItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}
    </div>
  );
}
