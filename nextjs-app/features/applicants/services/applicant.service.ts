/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api-client";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Applicant } from "@/types/applicant";

export type ApplicantHistory = {
  id: number;
  status: string;
  note: string;
  changedAt: string;
  // changedBy: string;
};

export type ApplicantTimeline = {
  stepOrder: number;
  status: string;
  events: ApplicantHistory[];
  currentStep: boolean;
  completed: boolean;
};

export const applicantService = {
  applyJobWithFile: (jobId: number, formData: FormData, config?: any) =>
    apiClient.post<ApiResponse<Applicant>>(`/api/applicant/${jobId}/apply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    }),

 getAllApplicantsByPage: ({
  page = 0,
  size = 5,
  sortBy = "appliedAt",
  sortDir = "desc",
}: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}) =>
  apiClient.get<PaginatedResponse<Applicant>>(`/api/applicant`, {
    params: { page, size, sortBy, sortDir },
  }),

  getApplicantDetail: (id: number) =>
    apiClient.get<Applicant>(`/api/applicant/detail/${id}`),

  deleteApplicant: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/api/applicant/delete/${id}`),

  getResumeLink: (filename: string) =>
    apiClient.get(`/api/applicant/resume-link/${filename}`, { responseType: "blob" }),

    getMyResumes: () =>
    apiClient.get(`/api/resumes`),
    
    getTimeline: (id: number) =>
    apiClient.get<ApplicantTimeline[]>(`/api/applicants/${id}/timeline`),
    addHistory: (applicantId: number, data: { step: string; status: string; note?: string }) =>
  apiClient.post(`/api/applicant/${applicantId}/history`, data),

     // ✅ HR update status
  updateStatus: (id: number, data: { status: string; note?: string }) =>
    apiClient.put(`/api/applicants/${id}/status`, data),


};
