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

  subscribeApplicant(
  id: number,
  onMessage: (data: any) => void,
  reconnectInterval = 5000 // 5s
) {
  let eventSource: EventSource | null = null;
  let reconnectTimer: NodeJS.Timeout;

  const startSSE = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("❌ No access token, SSE cannot subscribe. Retrying...");
      reconnectTimer = setTimeout(startSSE, reconnectInterval);
      return;
    }

    // Close old connection nếu có
    if (eventSource) eventSource.close();

    eventSource = new EventSourcePolyfill(
      `http://localhost:8080/api/applicant/${id}/subscribe`,
      {
        headers: { Authorization: `Bearer ${token}` },
        heartbeatTimeout: 60000,
      }
    ) as unknown as EventSource;

    // Custom event listener
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

    addSSEListener(eventSource, "statusUpdated", onMessage);

    // Bắt lỗi SSE & reconnect
    eventSource.onerror = (ev) => {
      console.error("❌ SSE error, reconnecting...", ev);
      if (eventSource) eventSource.close();
      reconnectTimer = setTimeout(startSSE, reconnectInterval);
    };
  };

  startSSE();

  // Cleanup khi component unmount
  return () => {
    if (eventSource) eventSource.close();
    clearTimeout(reconnectTimer);
  };
}

};
