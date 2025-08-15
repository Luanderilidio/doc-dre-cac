import { useForm } from "react-hook-form";
import { useCreateSchool, usePatchSchool } from "../../../services/School";
import {
  PatchSchool,
  SchoolCreate,
  SchoolCreateSchema,
} from "../SchemaGremioAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import { Button, TextField } from "@mui/material"; 

type FormSchoolForms = {
  school_id?: string;
  initialDate?: PatchSchool;
};

export default function FormSchool({
  school_id,
  initialDate,
}: FormSchoolForms) {
  const createMutation = useCreateSchool();
  const updateMutation = usePatchSchool();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchoolCreate>({
    resolver: zodResolver(SchoolCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: initialDate?.name || "",
      city: initialDate?.city || "",
    },
  });

  const handleDataSubmit = async (formData: SchoolCreate) => {
    if (school_id) {
      //update
      updateMutation.mutate(
        { id: school_id, data: formData as PatchSchool },
        {
          onSuccess: (response) => {
            toast.success("Escola atualizada com sucesso!");
          },
          onError: () => {
            toast.error("Erro ao atualizar Escola!");
          },
        }
      );
    } else {
      // create
      createMutation.mutate(formData, {
        onSuccess: (response) => {
          toast.success(response.message);
        },
        onError: () => {
          toast.error("Erro ao cadastrar Escola!");
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleDataSubmit)}
      className=" p-4  flex flex-col gap-3 bg-gray-300/30 rounded-xl border "
    >
      <p className="text-xl font-Inter font-bold">
        {school_id ? "Editar Escola" : "Cadastrar Escola"}
      </p>
      <div className="flex gap-3">
        <TextField
          fullWidth
          size="small"
          required
          className="col-span-12"
          label="Nome da Escola"
          variant="outlined"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          fullWidth
          size="small"
          required
          label="Cidade"
          className="col-span-12"
          variant="outlined"
          {...register("city")}
          error={!!errors.city}
          helperText={errors.city?.message}
        />
      </div>
      <Button
        variant="contained"
        type="submit"
        className="col-span-12"
        size="small"
      >
        {school_id ? "Salvar Alterações" : "Adicionar"}
      </Button>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </form>
  );
}
