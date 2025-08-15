import { useForm } from "react-hook-form"; 
import {
  InterlocutorCreate,
  InterlocutorCreateSchema,
  InterlocutorPatch, 
} from "../SchemaGremioAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import { Button, TextField } from "@mui/material"; 
import { useCreateInterlocutor, usePatchInterlocutor } from "../../../services/Interlocutors";

type FormInterlocutorForms = {
  interlocutor_id?: string;
  initialDate?: InterlocutorPatch;
};

export default function FormInterlocutor({
  interlocutor_id,
  initialDate,
}: FormInterlocutorForms) {
  const createMutation = useCreateInterlocutor();
  const updateMutation = usePatchInterlocutor();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InterlocutorCreate>({
    resolver: zodResolver(InterlocutorCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: initialDate?.name || "",
      email: initialDate?.email || "",
      contact: initialDate?.contact || "",
    },
  });


  const handleDataSubmit = async (formData: InterlocutorCreate) => {
    if (interlocutor_id) {
      //update
      updateMutation.mutate(
        { id: interlocutor_id, data: formData as InterlocutorPatch },
        {
          onSuccess: (response) => {
            toast.success("Escola atualizada com sucesso!");
          },
          onError: () => {
            toast.error("Erro ao atualizar Interlocutor!");
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
          toast.error("Erro ao cadastrar Interlocutor!");
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleDataSubmit)}
      className=" p-4  flex flex-col gap-3  "
    >
      <p className="text-xl font-Inter font-bold">
        {interlocutor_id ? "Editar Interlocutor" : "Cadastrar Interlocutor"}
      </p>
      <div className="flex flex-col gap-3">
        <TextField
          fullWidth
          size="small"
          required
          className="col-span-12"
          label="Nome"
          variant="outlined"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <div className="flex gap-4">

        <TextField
          fullWidth
          size="small"
          required
          label="Email"
          className="col-span-6"
          variant="outlined"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          fullWidth
          size="small"
          required
          label="Contato"
          className="col-span-6"
          variant="outlined"
          {...register("contact")}
          error={!!errors.contact}
          helperText={errors.contact?.message}
        />
        </div>
      </div>
      <Button
        variant="contained"
        type="submit"
        className="col-span-12"
        size="small"
      >
        {interlocutor_id ? "Salvar Alterações" : "Adicionar"}
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
