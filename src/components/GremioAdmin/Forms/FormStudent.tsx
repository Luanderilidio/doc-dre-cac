import { Controller, useForm } from "react-hook-form";
import {
  StudentCreate,
  StudentCreateSchema,
  StudentPatch,
} from "../SchemaGremioAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { faker } from "@faker-js/faker";
import PersonIcon from "@mui/icons-material/Person";

import { useCreateStudent, usePatchStudent } from "../../../services/Students";

type FormStudentForms = {
  student_id?: string;
  initialDate?: StudentPatch;
};

export default function FormStudent({
  student_id,
  initialDate,
}: FormStudentForms) {
  const createMutation = useCreateStudent();
  const updateMutation = usePatchStudent();

  const {
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentCreate>({
    resolver: zodResolver(StudentCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: initialDate?.name || faker.person.fullName(),
      registration:
        initialDate?.registration || faker.string.alphanumeric(8).toUpperCase(),
      contact:
        initialDate?.contact || faker.phone.number({ style: "national" }),
      email: initialDate?.email || faker.internet.email(),
      series:
        initialDate?.series ||
        faker.helpers.arrayElement(["1º Ano", "2º Ano", "3º Ano"]),
      shift:
        initialDate?.shift ||
        faker.helpers.arrayElement([
          "matutino",
          "vespertino",
          "noturno",
          "integral",
        ]),
      url_profile: initialDate?.url_profile || faker.image.avatar(),
    },
  });

  const handleDataSubmit = async (formData: StudentCreate) => {
    if (student_id) {
      //update
      updateMutation.mutate(
        { id: student_id, data: formData as StudentPatch },
        {
          onSuccess: (_response) => {
            toast.success("Estudante atualizado com sucesso!");
          },
          onError: () => {
            toast.error("Erro ao atualizar Estudante!");
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
          toast.error("Erro ao cadastrar Estudante!");
        },
      });
    }
  };

  const urlProfile = watch("url_profile");

  return (
    <form
      onSubmit={handleSubmit(handleDataSubmit)}
      className=" p-4  flex flex-col gap-3 bg-gray-300/30 rounded-xl border "
    >
      <p className="text-xl font-Inter font-bold">
        {student_id ? "Editar Estudante" : "Cadastrar Estudante"}
      </p>

      <div className="grid grid-cols-12 grid-rows-3 gap-2">
        <TextField
          label="Nome completo"
          size="small"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          className="col-span-9"
          required
        />

        <div className="col-span-3 row-span-3 flex items-center justify-center">
          {urlProfile ? (
            <img
              className="w-full h-full object-cover rounded-xl"
              src={urlProfile}
              alt=""
            />
          ) : (
            <PersonIcon sx={{ fontSize: 60 }} />
          )}
        </div>

        <TextField
          size="small"
          label="Matrícula"
          {...register("registration")}
          error={!!errors.registration}
          helperText={errors.registration?.message}
          className="col-span-4"
          required
        />

        <TextField
          size="small"
          label="Contato"
          {...register("contact")}
          error={!!errors.contact}
          helperText={errors.contact?.message}
          className="col-span-5"
        />

        <TextField
          size="small"
          label="Email"
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          className="col-span-9"
        />

        <TextField
          size="small"
          label="Série"
          {...register("series")}
          error={!!errors.series}
          helperText={errors.series?.message}
          className="col-span-6"
        />

        <FormControl className="col-span-6" error={!!errors.shift}>
          <InputLabel>Turno *</InputLabel>
          <Controller
            name="shift"
            control={control}
            render={({ field }) => (
              <Select {...field} size="small" label="Turno *">
                <MenuItem value="matutino">Matutino</MenuItem>
                <MenuItem value="vespertino">Vespertino</MenuItem>
                <MenuItem value="noturno">Noturno</MenuItem>
                <MenuItem value="integral">Integral</MenuItem>
              </Select>
            )}
          />
          <FormHelperText>{errors.shift?.message}</FormHelperText>
        </FormControl>

        <TextField
          size="small"
          label="URL da Foto"
          {...register("url_profile")}
          error={!!errors.url_profile}
          helperText={errors.url_profile?.message}
          className="col-span-12"
        />
      </div>

      <Button
        variant="contained"
        type="submit"
        className="col-span-12"
        size="small"
      >
        {student_id ? "Salvar Alterações" : "Adicionar"}
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
