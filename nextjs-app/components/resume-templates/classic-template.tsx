"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ResumeData } from "../resume-builder";
import { type CustomizationOptions, fontOptions } from "../customization-panel";
import styles from "./classic-template.module.css";

type ClassicTemplateProps = {
  data: ResumeData;
  isCompact?: boolean;
  customization?: CustomizationOptions;
};

function getFontSizeClass(size: CustomizationOptions["fontSize"] | undefined) {
  switch (size) {
    case "small":
      return styles.fontSizeSmall;
    case "large":
      return styles.fontSizeLarge;
    default:
      return styles.fontSizeMedium;
  }
}

function getColorSchemeClass(
  colorScheme: CustomizationOptions["colorScheme"] | undefined
) {
  switch (colorScheme) {
    case "blue":
      return styles.colorSchemeBlue;
    case "green":
      return styles.colorSchemeGreen;
    case "purple":
      return styles.colorSchemePurple;
    case "red":
      return styles.colorSchemeRed;
    case "orange":
      return styles.colorSchemeOrange;
    case "gray":
      return styles.colorSchemeGray;
    default:
      return styles.colorSchemeBlue;
  }
}

function getSpacingClass(spacing: CustomizationOptions["spacing"] | undefined) {
  switch (spacing) {
    case "compact":
      return styles.spacingCompact;
    case "relaxed":
      return styles.spacingRelaxed;
    default:
      return styles.spacingNormal;
  }
}

export function ClassicTemplate({
  data,
  isCompact = false,
  customization,
}: ClassicTemplateProps) {
  const selectedFont =
    fontOptions.find((f) => f.value === customization?.font) || fontOptions[0];

  return (
    <div
      style={
        {
          "--font-family": selectedFont.family,
        } as React.CSSProperties
      }
      className={[
        styles.classicResumeRoot,
        "print-safe",
        isCompact ? styles.classicCompact : "",
        getFontSizeClass(customization?.fontSize),
        getColorSchemeClass(customization?.colorScheme),
        getSpacingClass(customization?.spacing),
      ].join(" ")}
    >
      {/* Sidebar trái */}
      <aside className={styles.classicResumeSidebar}>
        {/* Avatar */}
        <Avatar className={styles.classicResumeAvatar}>
          <AvatarImage
            src={data.personalInfo.profileImage || "/placeholder.svg"}
            className={styles.classicResumeAvatar}
            style={{ objectFit: "cover" }}
          />
          <AvatarFallback>
            {data.personalInfo.fullName?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        {/* Thông tin cá nhân */}
        <div className={styles.classicResumeSection}>
          <div className={styles.classicResumeSectionTitle}>
            Thông tin cá nhân
          </div>
          <ul className={styles.classicResumeInfoList}>
            {data.personalInfo.phone && (
              <li>
                <span>📞</span>
                <span>{data.personalInfo.phone}</span>
              </li>
            )}
            {data.personalInfo.email && (
              <li>
                <span>✉️</span>
                <span>{data.personalInfo.email}</span>
              </li>
            )}
            {data.personalInfo.jobTitle && (
              <li>
                <span>🏠</span>
                <span>{data.personalInfo.jobTitle}</span>
              </li>
            )}
            {/* {data.personalInfo.profileImage &&
              data.personalInfo.profileImage !== "/placeholder.svg" && (
                <li>Ảnh đại diện</li>
              )} */}
            {/* {data.personalInfo.summary && <li>{data.personalInfo.summary}</li>} */}
          </ul>
        </div>
        {/* Học vấn */}
        {data.education.length > 0 && (
          <div className={styles.classicResumeSection}>
            <div className={styles.classicResumeSectionTitle}>Học vấn</div>
            {data.education.map((edu, index) => (
              <div
                key={edu.id || index}
                className={styles.classicResumeSubSection}
              >
                <div className={styles.classicResumeSubSectionTitle}>
                  {edu.institution}
                </div>
                <div className={styles.classicResumeMeta}>
                  {edu.startDate} - {edu.endDate}
                </div>
                <div>
                  {edu.degree} - {edu.field}
                </div>
                {edu.gpa && <div>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        )}
        {/* Kỹ năng */}
        {data.skills.length > 0 && (
          <div className={styles.classicResumeSection}>
            <div className={styles.classicResumeSectionTitle}>Kỹ năng</div>
            <ul className={styles.classicResumeSkillList}>
              {data.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Chứng chỉ */}
        {data.awards.length > 0 && (
          <div className={styles.classicResumeSection}>
            <div className={styles.classicResumeSectionTitle}>Chứng chỉ</div>
            <ul className={styles.classicResumeCertList}>
              {data.awards.map((award, index) => (
                <li key={award.id || index}>
                  <div>
                    <b>{award.title}</b> - {award.issuer}
                  </div>
                  <div>{award.date}</div>
                  {award.description && <div>{award.description}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
      {/* Main phải */}
      <main className={styles.classicResumeMain}>
        <div className={styles.classicResumeName}>
          {data.personalInfo.fullName || "Họ và tên"}
        </div>
        {/* {data.personalInfo.jobTitle && (
          <div className={styles.classicResumeJobTitle}>
            {data.personalInfo.jobTitle}
          </div>
        )} */}
        {data.personalInfo.summary && (
          <div className={styles.classicResumeSummary}>
            {data.personalInfo.summary}
          </div>
        )}
        {/* Kinh nghiệm làm việc */}
        {data.experience.length > 0 && (
          <div className={styles.classicResumeSection}>
            <div className={styles.classicResumeSectionTitle}>
              Kinh nghiệm làm việc
            </div>
            {data.experience.map((exp, index) => (
              <div
                key={exp.id || index}
                className={styles.classicResumeSubSection}
              >
                <div className={styles.classicResumeSubSectionTitle}>
                  {exp.company}
                </div>
                <div className={styles.classicResumeMeta}>
                  {exp.startDate} - {exp.endDate || "Hiện tại"}
                </div>
                <div>
                  <b>{exp.position}</b>
                </div>
                {exp.description && <div>{exp.description}</div>}
              </div>
            ))}
          </div>
        )}
        {/* Hoạt động */}
        {data.activities.length > 0 && (
          <div className={styles.classicResumeSection}>
            <div className={styles.classicResumeSectionTitle}>Hoạt động</div>
            {data.activities.map((activity, index) => (
              <div
                key={
                  activity?.id || `${activity?.title || "activity"}-${index}`
                }
                className={styles.classicResumeSubSection}
              >
                <div className={styles.classicResumeSubSectionTitle}>
                  {activity.organization}
                </div>
                <div className={styles.classicResumeMeta}>
                  {activity.startDate} - {activity.endDate || "Hiện tại"}
                </div>
                <div>
                  <b>{activity.title}</b>
                </div>
                {activity.description && <div>{activity.description}</div>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
