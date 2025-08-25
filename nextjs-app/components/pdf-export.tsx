"use client";

import { useRef, useState } from "react";
import type { ResumeData } from "./resume-builder";
import type { CustomizationOptions } from "./customization-panel";
import { PrintableResume } from "./printable-resume";

interface PDFExportProps {
  data: ResumeData;
  template: string;
  customization: CustomizationOptions;
  onSave?: (resumeData: ResumeData) => void;
  resumeData?: ResumeData;
}

export function PDFExport({ data, template, customization }: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!contentRef.current) return;

    setIsExporting(true);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setIsExporting(false);
      return;
    }

    const printContent = contentRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.personalInfo.fullName || "Resume"}_CV</title>
          <meta charset="utf-8">
          <style>
            @page { size: A4; margin: 0.5in; }
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-container { width: 100%; height: 100%; margin: 0; padding: 0; box-shadow: none; }
            .print-safe * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .no-print { display: none !important; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setIsExporting(false);
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      }, 500);
    };
  };

  return (
    <div className="mb-4">
      {/* Bootstrap Card */}
      <div className="card shadow-sm">
        <div className="card-header d-flex align-items-center">
          <i className="bi bi-file-earmark-text me-2"></i>
          <h5 className="mb-0">Xuất PDF</h5>
        </div>
        <div className="card-body">
          {/* Export Section */}
          <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-3">
            <div>
              <h6 className="fw-semibold">Tải xuống Resume</h6>
              <p className="text-muted small mb-0">
                Xuất resume dưới dạng PDF để in hoặc gửi cho nhà tuyển dụng
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              {exportSuccess && (
                <span className="badge bg-success d-flex align-items-center">
                  <i className="bi bi-check-circle me-1"></i>
                  Đã xuất
                </span>
              )}
              <button
                onClick={handlePrint}
                disabled={isExporting}
                className="btn btn-primary d-flex align-items-center"
              >
                {isExporting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Đang xuất...
                  </>
                ) : (
                  <>
                    <i className="bi bi-download me-2"></i>
                    Tải PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="text-muted small">
            <h6 className="fw-semibold text-dark">Lưu ý khi xuất PDF:</h6>
            <ul className="mb-0 ps-3">
              <li>Đảm bảo trình duyệt hỗ trợ in nền (background graphics)</li>
              <li>Chọn khổ giấy A4 để có kết quả tốt nhất</li>
              <li>Kiểm tra xem trước trước khi in hoặc lưu</li>
              <li>Màu sắc có thể khác nhau giữa màn hình và bản in</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hidden printable component */}
      <div style={{ display: "none" }}>
        <PrintableResume
          ref={contentRef}
          data={data}
          template={template}
          customization={customization}
        />
      </div>
    </div>
  );
}
