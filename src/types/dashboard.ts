export interface StatusBreakdown {
  PENDING: number;
  PARTIALLY_PAID: number;
  PAID: number;
  CANCELLED: number;
}

export interface DashboardSummary {
  totalPromised: number;
  totalReceived: number;
  pendingAmount: number;
  totalDonations: number;
  volunteerCount: number;
  statusBreakdown: StatusBreakdown;
}

export interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: DashboardSummary;
}
