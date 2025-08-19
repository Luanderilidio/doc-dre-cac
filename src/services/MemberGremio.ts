import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MemberCreate,
  MemberPatch,
  MemberWithStudent,
  MemberWithStudentList,
  Message,
} from "../components/GremioAdmin/SchemaGremioAdmin";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

export const CreateMemberGremio = async (data: MemberCreate) => {
  const response = await axios.post<Message>(`${apiUrl}/members-gremio`, data);
  return response.data;
};

export const GetAllMembersWithStudentsByGremoId = async (
  id: string
): Promise<MemberWithStudentList> => {
  const response = await axios.get<MemberWithStudentList>(
    `${apiUrl}/members-gremio?only_roles=false&gremio_id=${id}`
  );
  console.log(response.data);

  if (response.status === 404) {
    return [];
  }
  return response.data;
};

export const GetAllRolesFreeByGremioId = async (
  id: string
): Promise<String[]> => {
  const response = await axios.get<String[]>(
    `${apiUrl}/members-gremio?only_roles=true&gremio_id=${id}`
  );
  return response.data;
};

export const GetMemberGremioWithStudentById = async (
  id: string
): Promise<MemberWithStudent> => {
  const response = await axios.get<MemberWithStudent>(
    `${apiUrl}/members-gremio/${id}`
  );
  return response.data;
};

 

export const PathMemberGremio = async (id: string, data: MemberPatch) => {
  const response = await axios.patch(`${apiUrl}/members-gremio/${id}`, data);
  return response.data;
};

export const DeleteMemberGremio = async (id: string) => {
  const response = await axios.delete(`${apiUrl}/members-gremio/${id}`);
  return response.data;
};

/* ==================== HOOKS ==================== */

export const useAllMembersGremioWithStudentsByGremioId = (
  gremio_id: string
) => {
  return useQuery<MemberWithStudentList>({
    queryKey: ["AllMembersGremio"],
    queryFn: () => GetAllMembersWithStudentsByGremoId(gremio_id),
  });
};

export const useAllRolesFreeByGremioId = (gremio_id: string) => {
  return useQuery<String[]>({
    queryKey: ["AllRolesByGremio", gremio_id],
    queryFn: () => GetAllRolesFreeByGremioId(gremio_id),
  });
};

export const useCreateMemberGremio = (gremio_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberCreate) => CreateMemberGremio(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["memberGremio", variables.gremio_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["AllMembersGremio"],
      });
      queryClient.invalidateQueries({
        queryKey: ["AllRolesByGremio", gremio_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["AllStudentsFree"],
      });
    },
  });
};

export const usePatchMemberGremio = (gremio_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MemberPatch }) =>
      PathMemberGremio(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["memberGremio", gremio_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["AllMembersGremio"],
      });
    },
  });
};

export const useDeleteMemberGremio = (gremio_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteMemberGremio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["memberGremio", gremio_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["AllMembersGremio"],
      });
      queryClient.invalidateQueries({
        queryKey: ["AllRolesByGremio", gremio_id],
      });
      queryClient.invalidateQueries({ queryKey: ["AllStudentsFree"] });
    },
  });
};
