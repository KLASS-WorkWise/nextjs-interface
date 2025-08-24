"use client";

interface CVEmptyStateProps {
  onCreateNew: () => void;
}

export function CVEmptyState({ onCreateNew }: CVEmptyStateProps) {
  return (
    <div className="container vh-100 d-flex flex-column">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold m-0">CV đã tạo trên JobPost</h1>
        <button
          className="btn btn-primary fw-semibold px-3"
          onClick={onCreateNew}
        >
          + Tạo CV
        </button>
      </div>

      {/* Empty state - full center */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <div className="mb-3">
          <svg
            width="80"
            height="80"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="20"
              y="30"
              width="80"
              height="60"
              rx="4"
              stroke="#CED4DA"
              strokeWidth="2"
              fill="none"
            />
            <rect x="30" y="40" width="60" height="4" rx="2" fill="#CED4DA" />
            <rect x="30" y="50" width="40" height="4" rx="2" fill="#CED4DA" />
            <rect x="30" y="60" width="50" height="4" rx="2" fill="#CED4DA" />
            <rect x="30" y="70" width="35" height="4" rx="2" fill="#CED4DA" />
            <path
              d="M70 15 L85 25 L70 35"
              stroke="#CED4DA"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M80 25 L95 25"
              stroke="#CED4DA"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-muted fs-6">Chưa có CV nào được tạo.</p>
      </div>
    </div>
  );
}
