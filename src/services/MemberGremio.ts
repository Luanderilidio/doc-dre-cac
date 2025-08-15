import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MemberCreate,
  MemberView,
  MemberViewList,
  Message,
  PatchMember,
} from "../components/GremioAdmin/SchemaGremioAdmin";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

export const CreateMemberGremio = async (data: MemberCreate) => {
  const response = await axios.post<Message>(`${apiUrl}/members-gremio`, data);
  return response.data;
};

export const GetAllMembers = async (
): Promise<MemberViewList[]> => {
  const response = await axios.get<MemberViewList[]>(
    `${apiUrl}/members-gremio`
  );
  return response.data;
};

export const GetAllMembersById = async (
  id: string
): Promise<MemberView> => {
  const response = await axios.get<MemberView>(
    `${apiUrl}/members-gremio/${id}`
  );
  return response.data;
};

export const GetAllMembersByGremioId = async (
  gremio_id: string
): Promise<MemberViewList[]> => {
  const response = await axios.get<MemberViewList[]>(
    `${apiUrl}/members-gremio?gremio_id=${gremio_id}`
  );
  return response.data;
};

export const PathMemberGremio = async (id: string, data: PatchMember) => {
    const response = await axios.patch(`${apiUrl}/members-gremio/${id}`, data)
    return response.data
}

export const DeleteMemberGremio = async (id: string) => {
    const response = await axios.delete(`${apiUrl}/members-gremio/${id}`)
    return response.data
}


/* ==================== HOOKS ==================== */

export const useAllMembersGremio = () => {
  return useQuery<MemberViewList[]>({
    queryKey: ["AllMemberGremio"],
    queryFn: () => GetAllMembers()
  });
};

export const useMembersGremioByGremioId = (gremio_id: string) => {
  return useQuery<MemberViewList[]>({
    queryKey: ["memberGremio"],
    queryFn: () => GetAllMembersByGremioId(gremio_id)
  });
};


export const useCreateMemberGremio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberCreate) =>
      CreateMemberGremio(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["memberGremio", variables.gremio_id],
      });
    },
  });
};

export const usePatchMemberGremio = (gremio_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PatchMember }) =>
      PathMemberGremio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["memberGremio", gremio_id],
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
    },
  });
};
