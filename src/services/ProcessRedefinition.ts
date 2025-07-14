import axios from "axios";
import {
  MessageWithId,
  ProcessRedefinitionCreate,
  ProcessRedefinitionWithStages,
  Message,
  ProcessRedefinitionPatch,
} from "../components/GremioAdmin/SchemaGremioAdmin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

export const AllProcessRedefinitionByGremioId = async (
  gremio_id: string
): Promise<ProcessRedefinitionWithStages[]> => {
  const response = await axios.get<ProcessRedefinitionWithStages[]>(
    `${apiUrl}/gremio-process-redefinition`,
    {
      params: {
        filter: "gremio_id",
        gremio_id: gremio_id,
      },
    }
  );
  return response.data;
};

export const CreateProcessRedefinition = async (
  data: ProcessRedefinitionCreate
) => {
  const response = await axios.post<MessageWithId>(
    `${apiUrl}/gremio-process-redefinition`,
    data
  );

  return response.data;
};

export const DeleteProcessRedefinition = async (id: string) => {
  const response = await axios.delete<Message>(
    `${apiUrl}/gremio-process-redefinition/${id}`
  );

  return response.data;
};

export const PatchProcessRedefinition = async (
  id: string,
  data: ProcessRedefinitionPatch
) => {
  const response = await axios.patch<Message>(
    `${apiUrl}/gremio-process-redefinition/${id}`,
    data
  );
  return response.data;
};
/* ===== HOOKS ===== */

export const useProcessRedefinitions = (gremio_id: string) => {
  return useQuery<ProcessRedefinitionWithStages[]>({
    queryKey: ["processRedefinitions", gremio_id],
    queryFn: () => AllProcessRedefinitionByGremioId(gremio_id),
    enabled: !!gremio_id,
  });
};

export const useCreateProcessRedefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProcessRedefinitionCreate) =>
      CreateProcessRedefinition(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["processRedefinitions", variables.gremio_id],
      });
    },
  });
};

export const usePatchProcessRedefinition = (gremio_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProcessRedefinitionPatch }) =>
      PatchProcessRedefinition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["processRedefinitions", gremio_id],
      });
    },
  });
};

export const useDeleteProcessRedefinition = (gremio_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteProcessRedefinition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["processRedefinitions", gremio_id],
      });
    },
  });
};