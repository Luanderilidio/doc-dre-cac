import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { 
  Message,
  Student,
  StudentCreate,
  StudentList,
  StudentPatch
} from "../components/GremioAdmin/SchemaGremioAdmin";

const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

export const CreateStudents = async (data: StudentCreate) => {
  const response = await axios.post<Message>(`${apiUrl}/students`, data);
  return response.data;
};

export const GetAllStudents = async (): Promise<StudentList> => {
  const response = await axios.get<StudentList>(`${apiUrl}/students`);
  return response.data;
};

export const GetAllStudentsFree = async (): Promise<StudentList> => {
  const response = await axios.get<StudentList>(`${apiUrl}/students?free=true`);
  return response.data;
};

export const GetStudentsById = async (id: string): Promise<Student> => {
  const response = await axios.get<Student>(`${apiUrl}/students/${id}`);
  return response.data;
};

export const PatchStudents = async (id: string, data: StudentPatch) => {
  const response = await axios.patch(`${apiUrl}/students/${id}`, data);
  return response.data;
};

export const DeleteStudents = async (id: string) => {
  const response = await axios.delete(`${apiUrl}/students/${id}`);
  return response.data;
};

// ===================== HOOOKS ===================== \\

export const useAllStudents = () => {
  return useQuery<StudentList>({
    queryKey: ["AllStudents"],
    queryFn: () => GetAllStudents(),
  });
};

export const useAllStudentsFree = () => {
  return useQuery<StudentList>({
    queryKey: ["AllStudentsFree"],
    queryFn: () => GetAllStudentsFree(),
  });
};

export const useStudentsById = (id: string) => {
  return useQuery<Student>({
    queryKey: ["student", id],
    queryFn: () => GetStudentsById(id),
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudentCreate) => CreateStudents(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllStudents"] });
    },
  });
};

export const usePatchStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StudentPatch }) =>
      PatchStudents(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["student", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["AllStudents"] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteStudents(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["student", id] });
      queryClient.invalidateQueries({queryKey: ['AllStudents']})
    },
  });
};
