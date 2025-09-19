export interface Applicant {
  id: number;
  jobId: number;
  candidateId: number;
  resumesId: number | null;
  resumeLink: string | null;
  jobTitle: string;
  applicationStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  coverLetter: string | null;
  appliedAt: string;
  description_company: string | null;
  companyName: string | null;
  logoUrl: string | null;
  salaryRange: string | null;
  fullName: string;
  location_company: string | null;
   // ✅ thêm field backend trả về
  missingSkills: string[] | null;
  minExperience: string | null;
  experienceYears: number | null;
  skillMatchPercent: number;
  isSkillQualified: boolean;
  isExperienceQualified: boolean;
  skillMatchMessage: string | null;
  history?: { step: string; date: string | null; status: "done" | "in-progress" | "pending" ;changedAt: Date ;note: string|null,changedBy: string }[];
}
