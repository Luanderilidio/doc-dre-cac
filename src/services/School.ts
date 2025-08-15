import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  MemberView,
  Message,
  PatchSchool,
  School,
  SchoolCreate,
  SchoolList,
} from "../components/GremioAdmin/SchemaGremioAdmin";

const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

export const CreateSchools = async (data: SchoolCreate) => {
  const response = await axios.post<Message>(`${apiUrl}/schools`, data);
  return response.data;
};

export const GetAllSchools = async (): Promise<SchoolList> => {
  const response = await axios.get<SchoolList>(`${apiUrl}/schools`);
  return response.data;
};

export const GetAllSchoolsFree = async (): Promise<SchoolList> => {
  const response = await axios.get<SchoolList>(`${apiUrl}/schools?free=true`);
  return response.data;
};

export const GetSchoolsById = async (id: string): Promise<School> => {
  const response = await axios.get<School>(`${apiUrl}/schools/${id}`);
  return response.data;
};

export const PatchSchools = async (id: string, data: PatchSchool) => {
  const response = await axios.patch(`${apiUrl}/schools/${id}`, data);
  return response.data;
};

export const DeleteSchools = async (id: string) => {
  const response = await axios.delete(`${apiUrl}/schools/${id}`);
  return response.data;
};

// ===================== HOOOKS ===================== \\

export const useAllSchools = () => {
  return useQuery<SchoolList>({
    queryKey: ["AllSchools"],
    queryFn: () => GetAllSchools(),
  });
};

export const useAllSchoolsFree = () => {
  return useQuery<SchoolList>({
    queryKey: ["AllSchoolsFree"],
    queryFn: () => GetAllSchoolsFree(),
  });
};

export const useSchoolsById = (id: string) => {
  return useQuery<School>({
    queryKey: ["school", id],
    queryFn: () => GetSchoolsById(id),
  });
};

export const useCreateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SchoolCreate) => CreateSchools(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllSchools"] });
    },
  });
};

export const usePatchSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PatchSchool }) =>
      PatchSchools(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["school", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["AllSchools"] });
    },
  });
};

export const useDeleteSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteSchools(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["school", id] });
      queryClient.invalidateQueries({queryKey: ['AllSchools']})
    },
  });
};
