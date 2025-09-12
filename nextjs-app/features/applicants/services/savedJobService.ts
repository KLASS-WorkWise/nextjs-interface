import { apiClient } from "@/lib/api-client";

export const savedJobService = {
  saveJob: (jobPostingId: number) =>
    apiClient.post(`/api/saved-jobs/${jobPostingId}`),

  getMySavedJobs: () =>
    apiClient.get(`/api/saved-jobs`),

  removeSavedJob: (id: number) =>
    apiClient.delete(`/api/saved-jobs/${id}`),
};
