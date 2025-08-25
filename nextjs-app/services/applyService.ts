import { apiClient } from "@/lib/api-client";
interface PaginatedAppResponse {
  data: any[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
interface Applicant {
  id: number;
  jobId: number;
  candidateId: number;
  resumesId: number;
  resumeLink: string;
  applicationStatus: "PENDING" | "ACCEPTED" | "REJECTED"; // có thể thêm các trạng thái khác
  coverLetter: string;
  appliedAt: Date; // hoặc Date nếu bạn muốn dùng Date object
  missingSkills: string[];
  minExperience: string;
}

export const applyService = {
  applyJobWithFile(jobId: number, formData: FormData, config?: any) {
    return apiClient.post(`/applicant/${jobId}/apply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    })  as Promise<Applicant>;
  },

  getAllAppsByPage(page = 0, size = 5, sortBy = "appliedAt", sortDir = "desc") {
    return apiClient.get(`/applicant`, { params: { page, size, sortBy, sortDir } })as Promise<PaginatedAppResponse>;
  },

  getApplicantDetail(id: number) {
    return apiClient.get(`/applicant/detail/${id}`);
  },

  deleteApplicant(id: number) {
    return apiClient.delete(`/applicant/delete/${id}`);
  },

  getAllResumes() {
    return apiClient.get(`/api/resumes`);
  },
};
