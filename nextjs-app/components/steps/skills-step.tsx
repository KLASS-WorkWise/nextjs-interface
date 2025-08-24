"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import type { ResumeData } from "../resume-builder"
import { Plus, Trash2, Zap } from "lucide-react"
import { DragDropList } from "../drag-drop-list"

export function SkillsStep() {
  const { register, control } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "skills",
  })

  const addSkill = () => {
    append("") // thêm kỹ năng rỗng
  }

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex)
  }

  const renderSkillItem = (field: any, index: number, isDragging?: boolean) => (
    <div
      key={field.id}
      className={`card mb-3 ${isDragging ? "shadow-lg border-primary" : ""}`}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Kỹ năng {index + 1}</h6>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => remove(index)}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor={`skill-${index}`} className="form-label">
            Tên kỹ năng *
          </label>
          <input
            id={`skill-${index}`}
            {...register(`skills.${index}`, { required: true })}
            placeholder="JavaScript, Photoshop, Marketing..."
            className="form-control"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <Zap size={20} />
          <h5 className="mb-0">Kỹ năng</h5>
        </div>
        <button type="button" onClick={addSkill} className="btn btn-primary d-flex align-items-center gap-2">
          <Plus size={16} />
          Thêm kỹ năng
        </button>
      </div>

      {/* Trường hợp chưa có skill */}
      {fields.length === 0 && (
        <div className="card text-center">
          <div className="card-body py-5">
            <Zap size={40} className="text-muted mb-3" />
            <p className="text-muted">
              Chưa có kỹ năng nào. Hãy thêm những kỹ năng của bạn!
            </p>
          </div>
        </div>
      )}

      {/* Có skill */}
      {fields.length > 0 && (
        <div>
          <div
            className="alert alert-secondary text-center py-2 mb-3"
            style={{ border: "2px dashed #ccc" }}
          >
            💡 Kéo và thả để sắp xếp lại thứ tự kỹ năng
          </div>

          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderSkillItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}
    </div>
  )
}
