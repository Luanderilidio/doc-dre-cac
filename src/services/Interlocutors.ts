import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Interlocutor, InterlocutorCreate, InterlocutorList, InterlocutorPatch, Message } from "../components/GremioAdmin/SchemaGremioAdmin";

const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

export const CreateInterlocutors = async (data: InterlocutorCreate) => {
  const response = await axios.post<Message>(`${apiUrl}/interlocutors`, data);
  return response.data;
};

export const GetAllInterlocutors = async (): Promise<InterlocutorList> => {
  const response = await axios.get<InterlocutorList>(`${apiUrl}/interlocutors`);
  return response.data;
};

export const GetAllInterlocutorsFree = async (): Promise<InterlocutorList> => {
  const response = await axios.get<InterlocutorList>(`${apiUrl}/interlocutors?free=true`);
  return response.data;
};

export const GetInterlocutorsById = async (id: string): Promise<Interlocutor> => {
  const response = await axios.get<Interlocutor>(`${apiUrl}/interlocutors/${id}`);
  return response.data;
};

export const PatchInterlocutors = async (id: string, data: InterlocutorPatch) => {
  const response = await axios.patch(`${apiUrl}/interlocutors/${id}`, data);
  return response.data;
};

export const DeleteInterlocutors = async (id: string) => {
  const response = await axios.delete(`${apiUrl}/interlocutors/${id}`);
  return response.data;
};

// ===================== HOOOKS ===================== \\

export const useAllInterlocutors = () => {
  return useQuery<InterlocutorList>({
    queryKey: ["AllInterlocutors"],
    queryFn: () => GetAllInterlocutors(),
  });
};

export const useAllInterlocutorsFree = () => {
  return useQuery<InterlocutorList>({
    queryKey: ["AllInterlocutorsFree"],
    queryFn: () => GetAllInterlocutorsFree(),
  });
};

export const useInterlocutorsById = (id: string) => {
  return useQuery<Interlocutor>({
    queryKey: ["interlocutor", id],
    queryFn: () => GetInterlocutorsById(id),
  });
};

export const useCreateInterlocutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InterlocutorCreate) => CreateInterlocutors(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllInterlocutors"] });
    },
  });
};

export const usePatchInterlocutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InterlocutorPatch }) =>
      PatchInterlocutors(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["interlocutor", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["AllInterlocutors"] });
    },
  });
};

export const useDeleteInterlocutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteInterlocutors(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["interlocutor", id] });
      queryClient.invalidateQueries({queryKey: ['AllInterlocutors']})
    },
  });
};
