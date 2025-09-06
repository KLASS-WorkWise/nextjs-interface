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
    compact: isCompact ? "mb-3" : "mb-4",
    normal: isCompact ? "mb-5" : "mb-6",
    relaxed: isCompact ? "mb-6" : "mb-7",
  };

  const sizes = sizeClasses[customization.fontSize];
  const spacing = spacingClasses[customization.spacing];

  console.log(
    "ClassicTemplate - spacing:",
    customization.spacing,
    "spacing class:",
    spacing,
    "isCompact:",
    isCompact
  );

  return (
    <div
      className={`${fontFamily} bg-white text-dark p-3 ${
        isCompact ? "" : "p-4"
      } print-safe`}
      style={{ borderRadius: "8px", border: "1px solid #dee2e6" }}
    >
      {/* Header: avatar left, info right */}
      <div className="d-flex align-items-center bg-primary text-white rounded-4 p-3 mb-4">
        <div
          style={{
            width: isCompact ? 48 : 80,
            height: isCompact ? 48 : 80,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #fff",
            background: "#fff",
            flexShrink: 0,
            marginRight: isCompact ? 16 : 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            style={{
              width: isCompact ? 40 : 72,
              height: isCompact ? 40 : 72,
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <AvatarImage
              src={data.personalInfo.profileImage || "/placeholder.svg"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
            <AvatarFallback className="bg-light text-dark">
              {data.personalInfo.fullName?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h1 className={`fw-bold ${sizes.name} mb-1 text-white`}>
            {data.personalInfo.fullName || "Họ và tên"}
          </h1>
          {data.personalInfo.email && (
            <div className="small">{data.personalInfo.email}</div>
          )}
          {data.personalInfo.phone && (
            <div className="small">{data.personalInfo.phone}</div>
          )}
          {data.personalInfo.jobTitle && (
            <div className="small">{data.personalInfo.jobTitle}</div>
          )}
        </div>
      </div>

      <div>
        {data.personalInfo.summary && (
          <section className={spacing}>
            <h2
              className={`fw-bold ${sizes.heading} text-center text-uppercase mb-2`}
            >
              Mô tả bản thân
            </h2>
            <p className={`${sizes.text} text-justify`}>
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className={spacing}>
            <h2
              className={`fw-bold ${sizes.heading} text-center text-uppercase mb-3`}
            >
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
                    <p className={`${sizes.text} mt-1 text-justify`}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className={spacing}>
            <h2
              className={`fw-bold ${sizes.heading} text-center text-uppercase mb-3`}
            >
              Học vấn
            </h2>
            <div>
              {data.education.map((edu) => (
                <div key={edu.id} className="text-center mb-3">
                  <h3 className={`fw-bold ${sizes.text}`}>
                    {edu.degree} - {edu.field}
                  </h3>
                  <p className={`fst-italic ${sizes.text}`}>
                    {edu.institution}
                  </p>
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
            <h2
              className={`fw-bold ${sizes.heading} text-center text-uppercase mb-3`}
            >
              Kỹ năng
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {data.skills.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: isCompact ? "0.5rem" : "0.75rem",
                      height: isCompact ? "0.5rem" : "0.75rem",
                      backgroundColor: "#388FF3",
                      borderRadius: "2px",
                      marginRight: "8px",
                      verticalAlign: "middle",
                    }}
                  ></span>
                  <span
                    className={sizes.text}
                    style={{ verticalAlign: "middle" }}
                  >
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.activities.length > 0 && (
          <section className={spacing}>
            <h2
              className={`fw-bold ${sizes.heading} text-center text-uppercase mb-3`}
            >
              Hoạt động
            </h2>
            <div>
              {data.activities.map((activity) => (
                <div key={activity.id} className="text-center mb-2">
                  <h3 className={`fw-bold ${sizes.text}`}>{activity.title}</h3>
                  <p className={`fst-italic ${sizes.text}`}>
                    {activity.organization}
                  </p>
                  <p className={`text-secondary ${sizes.text}`}>
                    {activity.startDate} - {activity.endDate || "Hiện tại"}
                  </p>
                  {activity.description && (
                    <p className={`${sizes.text} mt-1 text-justify`}>
                      {activity.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.awards.length > 0 && (
          <section className={spacing}>
            <h2
              className={`fw-bold ${sizes.heading} text-center text-uppercase mb-3`}
            >
              Giải thưởng & Chứng chỉ
            </h2>
            <div>
              {data.awards.map((award) => (
                <div key={award.id} className="text-center mb-2">
                  <h3 className={`fw-bold ${sizes.text}`}>{award.title}</h3>
                  <p className={`fst-italic ${sizes.text}`}>{award.issuer}</p>
                  <p className={`text-secondary ${sizes.text}`}>{award.date}</p>
                  {award.description && (
                    <p className={`${sizes.text} mt-1 text-justify`}>
                      {award.description}
                    </p>
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
