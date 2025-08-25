"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ResumeData } from "../resume-builder";
import type { CustomizationOptions } from "../customization-panel";
import { fontOptions } from "../customization-panel";

interface ClassicTemplateProps {
  data: ResumeData;
  customization: CustomizationOptions;
  isCompact?: boolean;
}

export function ClassicTemplate({
  data,
  customization,
  isCompact = false,
}: ClassicTemplateProps) {
  const fontFamily =
    fontOptions.find((f) => f.value === customization.font)?.family ||
    "font-serif";

  // Bootstrap font-size and spacing
  const sizeClasses = {
    small: {
      text: isCompact ? "fs-6" : "fs-7",
      heading: isCompact ? "fs-6" : "fs-6",
      title: isCompact ? "fs-5" : "fs-5",
      name: isCompact ? "fs-4" : "fs-2",
    },
    medium: {
      text: isCompact ? "fs-6" : "fs-6",
      heading: isCompact ? "fs-5" : "fs-5",
      title: isCompact ? "fs-4" : "fs-4",
      name: isCompact ? "fs-3" : "fs-1",
    },
    large: {
      text: isCompact ? "fs-5" : "fs-5",
      heading: isCompact ? "fs-4" : "fs-4",
      title: isCompact ? "fs-3" : "fs-3",
      name: isCompact ? "fs-2" : "display-4",
    },
  };

  const spacingClasses = {
    compact: isCompact ? "mb-1" : "mb-2",
    normal: isCompact ? "mb-2" : "mb-4",
    relaxed: isCompact ? "mb-3" : "mb-5",
  };

  const sizes = sizeClasses[customization.fontSize];
  const spacing = spacingClasses[customization.spacing];

  return (
    <div
      className={`${fontFamily} bg-white text-dark p-3 ${isCompact ? "" : "p-4"} print-safe`}
      style={{ borderRadius: "8px", border: "1px solid #dee2e6" }}
    >
      {/* Classic centered header */}
      <div
        className={`text-center border-bottom border-2 border-dark pb-3 mb-4 print-safe`}
      >
        {data.personalInfo.profileImage && (
          <div className="mb-3 d-flex justify-content-center">
            <Avatar className={isCompact ? "me-2" : ""} style={{ width: isCompact ? 32 : 80, height: isCompact ? 32 : 80 }}>
              <AvatarImage src={data.personalInfo.profileImage || "/placeholder.svg"} />
              <AvatarFallback className="bg-light text-dark">
                {data.personalInfo.fullName?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <h1 className={`fw-bold ${sizes.name} mb-2`}>
          {data.personalInfo.fullName || "Họ và tên"}
        </h1>
        <div className={`${sizes.text}`}>
          {data.personalInfo.email && <p className="mb-1">{data.personalInfo.email}</p>}
          {data.personalInfo.phone && <p className="mb-1">{data.personalInfo.phone}</p>}
          {data.personalInfo.jobTitle && <p className="mb-1">{data.personalInfo.jobTitle}</p>}
        </div>
      </div>

      <div>
        {data.personalInfo.summary && (
          <section className={spacing}>
            <h2 className={`fw-bold ${sizes.heading} text-center text-uppercase mb-2`}>
              Mô tả bản thân
            </h2>
            <p className={`${sizes.text} text-justify`}>{data.personalInfo.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className={spacing}>
            <h2 className={`fw-bold ${sizes.heading} text-center text-uppercase mb-3`}>
              Kinh nghiệm làm việc
            </h2>
            <div>
              {data.experience.map((exp) => (
                <div key={exp.id} className="mb-3">
                  <div className="text-center">
                    <h3 className={`fw-bold ${sizes.text}`}>{exp.position}</h3>
                    <p className={`fst-italic ${sizes.text}`}>{exp.company}</p>
                    <p className={`text-secondary ${sizes.text}`}>
                      {exp.startDate} - {exp.endDate || "Hiện tại"}
                    </p>
                  </div>
                  {exp.description && (
                    <p className={`${sizes.text} mt-1 text-justify`}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className={spacing}>
            <h2 className={`fw-bold ${sizes.heading} text-center text-uppercase mb-3`}>
              Học vấn
            </h2>
            <div>
              {data.education.map((edu) => (
                <div key={edu.id} className="text-center mb-3">
                  <h3 className={`fw-bold ${sizes.text}`}>
                    {edu.degree} - {edu.field}
                  </h3>
                  <p className={`fst-italic ${sizes.text}`}>{edu.institution}</p>
                  <p className={`text-secondary ${sizes.text}`}>
                    {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.gpa && <p className={sizes.text}>GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills.length > 0 && (
          <section className={spacing}>
            <h2 className={`fw-bold ${sizes.heading} text-center text-uppercase mb-3`}>
              Kỹ năng
            </h2>
            <div className="text-center">
              <p className={sizes.text}>
                {data.skills.join(" • ")}
              </p>
            </div>
          </section>
        )}

        {data.activities.length > 0 && (
          <section className={spacing}>
            <h2 className={`fw-bold ${sizes.heading} text-center text-uppercase mb-3`}>
              Hoạt động
            </h2>
            <div>
              {data.activities.map((activity) => (
                <div key={activity.id} className="text-center mb-2">
                  <h3 className={`fw-bold ${sizes.text}`}>{activity.title}</h3>
                  <p className={`fst-italic ${sizes.text}`}>{activity.organization}</p>
                  <p className={`text-secondary ${sizes.text}`}>
                    {activity.startDate} - {activity.endDate || "Hiện tại"}
                  </p>
                  {activity.description && (
                    <p className={`${sizes.text} mt-1 text-justify`}>{activity.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.awards.length > 0 && (
          <section className={spacing}>
            <h2 className={`fw-bold ${sizes.heading} text-center text-uppercase mb-3`}>
              Giải thưởng & Chứng chỉ
            </h2>
            <div>
              {data.awards.map((award) => (
                <div key={award.id} className="text-center mb-2">
                  <h3 className={`fw-bold ${sizes.text}`}>{award.title}</h3>
                  <p className={`fst-italic ${sizes.text}`}>{award.issuer}</p>
                  <p className={`text-secondary ${sizes.text}`}>{award.date}</p>
                  {award.description && (
                    <p className={`${sizes.text} mt-1 text-justify`}>{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}