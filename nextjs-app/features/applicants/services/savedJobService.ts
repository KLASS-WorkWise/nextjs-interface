import { apiClient } from "@/lib/api-client";

export const savedJobService = {
  saveJob: (jobPostingId: number) =>
    apiClient.post(`/saved-jobs/${jobPostingId}`),

  getMySavedJobs: () =>
    apiClient.get(`/saved-jobs`),

  removeSavedJob: (id: number) =>
    apiClient.delete(`/saved-jobs/${id}`),
};
