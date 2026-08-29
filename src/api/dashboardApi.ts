import axiosInstance from "./axiosInstance";
import type { DashboardSummaryResponse } from "@/types/dashboard";

export const getDashboardSummaryApi =
  async (): Promise<DashboardSummaryResponse> => {
    const { data } =
      await axiosInstance.get<DashboardSummaryResponse>("/dashboard/summary");
    return data;
  };
