export interface Volunteer {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: "volunteer";
  isActive: boolean;
  createdBy?: { _id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt?: string;
}

export interface VolunteersListResponse {
  success: boolean;
  message: string;
  data: Volunteer[];
}

export interface VolunteerResponse {
  success: boolean;
  message: string;
  data: Volunteer;
}
