import axios from "axios";

import { getSession } from "next-auth/react";

export interface Company {
  id: number;
  companyName: string;
  logoUrl?: string;
  bannerUrl?: string;
  email: string;
  phone: string;
  description: string;
  minEmployees: number;
  maxEmployees: number;
  address: string;
  location: string;
  website: string;
  industry: string;
}

export async function getCompanyById(id: number | string) {
  const response = await axios.get(`http://localhost:8080/api/company/${id}`);
  return response.data;
}

