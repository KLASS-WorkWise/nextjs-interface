"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { applicantService } from "@/features/applicants/services/applicant.service";
import { Applicant } from "@/types/applicant";
import ApplicantDetail from "@/features/applicants/components/ApplicantDetail";

export default function ApplicantDetailPage() {
  const { id } = useParams();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await applicantService.getApplicantDetail(Number(id));
        setApplicant(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (!applicant) return <div className="p-6 text-red-500">Applicant not found</div>;

  return <ApplicantDetail applicant={applicant} />;
}
