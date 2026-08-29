import axiosInstance from "./axiosInstance";
import type {
  VolunteersListResponse,
  VolunteerResponse,
} from "@/types/volunteer";

export const getVolunteersApi = async (): Promise<VolunteersListResponse> => {
  const { data } =
    await axiosInstance.get<VolunteersListResponse>("/volunteers");
  return data;
};

export const getVolunteerByIdApi = async (
  id: string,
): Promise<VolunteerResponse> => {
  const { data } = await axiosInstance.get<VolunteerResponse>(
    `/volunteers/${id}`,
  );
  return data;
};

export interface CreateVolunteerPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export const createVolunteerApi = async (
  payload: CreateVolunteerPayload,
): Promise<VolunteerResponse> => {
  const { data } = await axiosInstance.post<VolunteerResponse>(
    "/volunteers/create",
    payload,
  );
  return data;
};

export interface UpdateVolunteerPayload {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  isActive?: boolean;
}

export const updateVolunteerApi = async (
  id: string,
  payload: UpdateVolunteerPayload,
): Promise<VolunteerResponse> => {
  const { data } = await axiosInstance.put<VolunteerResponse>(
    `/volunteers/${id}`,
    payload,
  );
  return data;
};

export const updateVolunteerStatusApi = async (
  id: string,
  isActive: boolean,
): Promise<VolunteerResponse> => {
  const { data } = await axiosInstance.patch<VolunteerResponse>(
    `/volunteers/${id}/status`,
    {
      isActive,
    },
  );
  return data;
};
