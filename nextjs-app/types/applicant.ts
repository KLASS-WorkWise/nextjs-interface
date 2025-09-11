export interface Applicant {
  id: number;
  jobId: number;
  candidateId: number;
  resumesId: number | null;
  resumeLink: string | null;
  applicationStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  coverLetter: string | null;
  appliedAt: string;
  missingSkills: string[] | null;
  minExperience: string | null;
  history?: { step: string; date: string | null; status: "done" | "in-progress" | "pending" }[];
}
