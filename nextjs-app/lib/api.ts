/* eslint-disable */
import axios from "axios";

import { getSession } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để gắn token trước khi gửi request
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  const accessToken = session?.accessToken;
  console.log("accessToken:", accessToken);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export interface ApiResumeData {
  fullName: string;
  email: string;
  phone: string;
  profilePicture?: string;
  summary: string;
  jobTitle: string;
  educations: Array<{
    schoolName: string;
    degree: string;
    major: string;
    startYear: string;
    endYear: string;
    GPA?: string;
  }>;
  awards: Array<{
    awardName: string;
    awardYear: string;
    donViTrao: string;
    description: string;
  }>;
  activities: Array<{
    activityName: string;
    organization: string;
    startYear: string;
    endYear: string;
    description: string;
  }>;
  experiences: Array<{
    companyName: string;
    position: string;
    startYear: string;
    endYear: string;
    description: string;
  }>;
  skillsResumes: string[];
}

export function mapFormToApi(formData: any): ApiResumeData {
  return {
    fullName: formData.personalInfo?.fullName || "",
    email: formData.personalInfo?.email || "",
    phone: formData.personalInfo?.phone || "",
    profilePicture: formData.personalInfo?.profileImage || "",
    summary: formData.personalInfo?.summary || "",
    jobTitle: formData.personalInfo?.jobTitle || "",
    educations: (formData.education || []).map((edu: any) => ({
      schoolName: edu.institution || "",
      degree: edu.degree || "",
      major: edu.field || "",
      startYear: edu.startDate || "",
      endYear: edu.endDate || "",
      GPA: edu.gpa || "",
    })),
    
    awards: (formData.awards || []).map((award: any) => ({
      awardName: award.title || "",
      // Chỉ lấy năm (YYYY) từ chuỗi "YYYY-MM" để gửi lên backend dạng số hoặc chuỗi năm
      awardYear: award.date ? parseInt(award.date.slice(0, 4)) : null,
      donViTrao: award.issuer || "",
      description: award.description || "",
    })),
    activities: (formData.activities || []).map((activity: any) => ({
      activityName: activity.title || "",
      organization: activity.organization || "",
      startYear: activity.startDate || "",
      endYear: activity.endDate || "",
      description: activity.description || "",
    })),
    experiences: (formData.experience || []).map((experience: any) => ({
      companyName: experience.company || "",
      position: experience.position || "",
      startYear: experience.startDate || "",
      endYear: experience.endDate || "",
      description: experience.description || "",
    })),
    skillsResumes: formData.skills || [],
  };
}

export function mapApiToForm(apiData: ApiResumeData & { id?: number }): any {
  return {
    id: apiData.id,
    personalInfo: {
      fullName: apiData.fullName,
      email: apiData.email,
      phone: apiData.phone,
      profileImage: apiData.profilePicture,
      summary: apiData.summary,
      jobTitle: apiData.jobTitle,
    },
    education: apiData.educations.map((edu) => ({
      institution: edu.schoolName,
      degree: edu.degree,
      field: edu.major,
      startDate: edu.startYear,
      endDate: edu.endYear,
      gpa: edu.GPA,
    })),
    awards: apiData.awards.map((award) => ({
      title: award.awardName,
      // Convert awardYear (number or string) to 'YYYY-MM' string for form field compatibility
      date: award.awardYear ? `${award.awardYear}-01` : "",
      issuer: award.donViTrao,
      description: award.description,
    })),
    activities: apiData.activities.map((activity) => ({
      title: activity.activityName,
      organization: activity.organization,
      startDate: activity.startYear,
      endDate: activity.endYear,
      description: activity.description,
    })),
    experience: (apiData.experiences ?? []).map((experience) => ({
      company: experience.companyName,
      position: experience.position,
      startDate: experience.startYear ? `${experience.startYear}` : "",
      endDate: experience.endYear ? `${experience.endYear}` : "",
      description: experience.description,
    })),
    skills: apiData.skillsResumes,
  };
}

export const resumeApi = {
  getMyResume: async (): Promise<ApiResumeData> => {
    const session = await getSession();
    const accessToken = session?.accessToken;
    const response = await api.get("/api/resumes", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  getResumeById: async (id: number | string): Promise<ApiResumeData> => {
    const session = await getSession();
    const accessToken = session?.accessToken;
    const response = await api.get(`/api/resumes/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  saveMyResume: async (data: ApiResumeData): Promise<any> => {
    const session = await getSession();
    const accessToken = session?.accessToken;
    const response = await api.post("/api/resumes/me", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  updateMyResume: async (id: number, data: ApiResumeData): Promise<any> => {
    const session = await getSession();
    const accessToken = session?.accessToken;
    const response = await api.patch(`/api/resumes/me/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  deleteResume: async (id: number | string): Promise<void> => {
    const session = await getSession();
    const accessToken = session?.accessToken;
    await api.delete(`/api/resumes/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};
