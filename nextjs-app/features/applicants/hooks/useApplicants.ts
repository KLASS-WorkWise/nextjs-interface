// hooks/useApplicants.ts
"use client";
import { useEffect, useState } from "react";
import { applicantService } from "../services/applicant.service";
import { Applicant } from "@/types/applicant";
import { PaginatedResponse } from "@/types/api";
import { toast } from "react-toastify";

export const useApplicants = (pageSize: number, page: number) => {
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await applicantService.getAllApplicantsByPage(page, pageSize);
        const apiRes: PaginatedResponse<Applicant> = res.data;

        setApplications(apiRes.data ?? []);
        setTotalPages(apiRes.totalPages ?? 1); // dùng totalPages từ API
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [page, pageSize]);

  // const handlePageChange = (newPage: number) => {
  //   if (newPage >= 0 && newPage < totalPages) {
  //     setPage(newPage);
  //   }
  // };

 const handleDeleteApplicant = async (id: number) => {
  try {
    const confirmed = confirm("Bạn có chắc muốn xoá ứng tuyển này?");
    if (!confirmed) return false; // nếu hủy, thoát luôn

    await applicantService.deleteApplicant(id);
    setApplications((prev) => prev.filter((app) => app.id !== id));
    
    toast.success("Deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting applicant:", error);
    toast.error("Delete failed!");
    return false;
  }
};


  return { applications, loading, totalPages, handleDeleteApplicant };
}
