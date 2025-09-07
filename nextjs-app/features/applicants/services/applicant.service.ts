/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api-client";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Applicant } from "@/types/applicant";

export const applicantService = {
  applyJobWithFile: (jobId: number, formData: FormData, config?: any) =>
    apiClient.post<ApiResponse<Applicant>>(`/applicant/${jobId}/apply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    }),

  getAllApplicantsByPage: (page = 0, size = 5, sortBy = "appliedAt", sortDir = "desc") =>
    apiClient.get<PaginatedResponse<Applicant>>(`/applicant`, {
      params: { page, size, sortBy, sortDir },
    }),

  getApplicantDetail: (id: number) =>
    apiClient.get<Applicant>(`/applicant/detail/${id}`),

  deleteApplicant: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/applicant/delete/${id}`),

  getResumeLink: (filename: string) =>
    apiClient.get(`/applicant/resume-link/${filename}`, { responseType: "blob" }),

    updateStep: (id: number, step: string, status: string = "done") =>
    apiClient.patch(`/applicant/${id}/history`, null, {
      params: { step, status },
    }),
};
