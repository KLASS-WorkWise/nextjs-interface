/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api-client";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Applicant } from "@/types/applicant";
import { EventSourcePolyfill } from "event-source-polyfill";
// import { EventSourcePolyfill } from "event-source-polyfill";


export type ApplicantHistory = {
  id: number;
  status: string;
  note: string;
  changedAt: string;
  changedBy?: string;
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
  size = 6,
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

  getResumeLink: (firebaseUrl: string) =>
    apiClient.get(`/api/applicant/resume-preview`, { responseType: "blob" , params: { url: firebaseUrl }}),

    getMyResumes: () =>
    apiClient.get(`/api/resumes`),
    
    addHistory: (applicantId: number, data: { step: string; status: string; note?: string }) =>
  apiClient.post(`/api/applicant/${applicantId}/history`, data),

     // ✅ HR update status
  updateStatus: (id: number, data: { status: string; note?: string }) =>
    apiClient.put(`/api/applicants/${id}/status`, data),
  
  
  // ✅ Dùng endpoint tracking để lấy timeline + detail + history
  getTimeline: (id: number) =>
    apiClient
      .get<{ detail: any; history: any[]; timeline: ApplicantTimeline[] }>(`/api/applicant/${id}/tracking`)
      .then(res => res.data.timeline),

  getApplicantTracking: (id: number) =>
    apiClient.get(`/api/applicant/${id}/tracking`),

  
subscribeApplicant(id: number, onMessage: (data: any) => void) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("");
    return () => {};
  }

  const eventSource: EventSource = new EventSourcePolyfill(
    `http://localhost:8080/api/applicant/${id}/subscribe`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      heartbeatTimeout: 60000,
    }
  ) as unknown as EventSource; // ép 1 lần duy nhất để TS hiểu như EventSource chuẩn

  // ✅ Helper bắt custom event
  const addSSEListener = <T = any>(
    source: EventSource,
    eventName: string,
    handler: (data: T) => void
  ) => {
    source.addEventListener(eventName, (ev: Event) => {
      const msg = ev as MessageEvent;
      try {
        handler(JSON.parse(msg.data));
      } catch (err) {
        console.error(`❌ Error parsing SSE for ${eventName}:`, err);
      }
    });
  };

  // Lắng nghe custom event
  addSSEListener(eventSource, "statusUpdated", onMessage);

  // ✅ Bắt lỗi SSE
  eventSource.onerror = function (this: EventSource, ev: Event) {
    console.error("❌ SSE error:", ev);
  };

  // Hàm cleanup
  return () => eventSource.close();
}
};
