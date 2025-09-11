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
   // ✅ thêm field backend trả về
  missingSkills: string[] | null;
  minExperience: string | null;
  experienceYears: number | null;
  skillMatchPercent: number;
  isSkillQualified: boolean;
  isExperienceQualified: boolean;
  history?: { step: string; date: string | null; status: "done" | "in-progress" | "pending" ;changedAt: Date ;note: string|null }[];
}
