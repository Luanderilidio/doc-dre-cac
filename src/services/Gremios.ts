import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { 
  GremioCreate,
  GremioPatch,
  GremioWithMember,
  GremioWithMembersList,
  Message,
} from "../components/GremioAdmin/SchemaGremioAdmin";

const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

export const CreateGremios = async (data: GremioCreate) => {
  const response = await axios.post<Message>(`${apiUrl}/gremios`, data);
  return response.data;
};

export const GetAllGremiosWithMembers = async (): Promise<GremioWithMembersList> => {
  const response = await axios.get<GremioWithMembersList>(`${apiUrl}/gremios`);
  console.log(response.data)
  return response.data;
};

export const GetGremiosWithMembersById = async (id: string): Promise<GremioWithMember> => {
  const response = await axios.get<GremioWithMember>(`${apiUrl}/gremios/${id}`);
  return response.data;
};

export const PatchGremios = async (id: string, data: GremioPatch) => {
  const response = await axios.patch(`${apiUrl}/gremios/${id}`, data);
  return response.data;
};

export const DeleteGremios = async (id: string) => {
  const response = await axios.delete(`${apiUrl}/gremios/${id}`);
  return response.data;
};

// ===================== HOOOKS ===================== \\

export const useAllGremiosWithMembers = () => {
  return useQuery<GremioWithMembersList>({
    queryKey: ["AllGremiosWithMembers"],
    queryFn: () => GetAllGremiosWithMembers(),
  });
};


export const useGremiosWithMembersById = (id: string) => {
  return useQuery<GremioWithMember>({
    queryKey: ["GremioWithMember", id],
    queryFn: () => GetGremiosWithMembersById(id),
  });
};

export const useCreateGremio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GremioCreate) => CreateGremios(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllGremiosWithMembers"] });
    },
  });
};

export const usePatchGremio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GremioPatch }) =>
      PatchGremios(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["GremioWithMember", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["AllGremiosWithMembers"] });
    },
  });
};

export const useDeleteGremio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteGremios(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["GremioWithMember", id] });
      queryClient.invalidateQueries({queryKey: ['AllGremiosWithMembers']})
    },
  });
};
