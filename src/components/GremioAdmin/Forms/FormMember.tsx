import { Controller, useForm } from "react-hook-form";
import { MemberCreate, MemberCreateSchema } from "../SchemaGremioAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import {
  Autocomplete,
  Avatar,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";

import {
  useAllRolesFreeByGremioId,
  useCreateMemberGremio,
} from "../../../services/MemberGremio"; 
import { useState } from "react";
import { useAllStudentsFree } from "../../../services/Students";

type FormMemberForms = {
  gremio_id: string;
  // initialDate?: InterlocutorPatch;
};

const rolesOriginal = [
  "DIRETOR",
  "VICE-PRESIDENTE",
  "SECRETÁRIO GERAL I",
  "SECRETÁRIO GERAL II",
  "1° SECRETÁRIO",
  "TESOUREIRO GERAL",
  "1º TESOUREIRO",
  "DIRETOR SOCIAL",
  "DIRETOR DE COMUNICAÇÃO",
  "DIRETOR DE ESPORTES E CULTURA",
  "DIRETOR DE SAÚDE E MEIO AMBIENTE",
];

export default function FormMember({
  gremio_id,
}: // initialDate,
FormMemberForms) {
  const createMutation = useCreateMemberGremio(gremio_id);
  const { data: students } = useAllStudentsFree();
  const { data: roles } = useAllRolesFreeByGremioId(gremio_id);


  // console.log(students)
  // console.log(roles)

  // const updateMutation = usePatchInterlocutor();

  const {
    control, 
    handleSubmit,
    formState: { errors },
  } = useForm<MemberCreate>({
    resolver: zodResolver(MemberCreateSchema),
    mode: "onChange",
    defaultValues: {
      gremio_id: gremio_id,
      status: true,
    },
  });

  const handleDataSubmit = async (formData: MemberCreate) => {
    console.log(formData)
    createMutation.mutate(formData, {
      onSuccess: (response) => {
        toast.success(response.message);
      },
      onError: () => {
        toast.error("Erro ao cadastrar Membro!");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleDataSubmit)}
      className=" p-4  flex flex-col gap-3  "
    >
      <p className="text-xl font-Inter font-bold">
        {/* {interlocutor_id ? "Editar Interlocutor" : "Cadastrar Interlocutor"} */}
      </p>
      <div className="grid grid-cols-12 gap-3">
        <Controller
          name="student_id"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={students ?? []}
              getOptionLabel={(option) => option.name}
              value={
                field.value
                  ? students?.find((student) => student.id === field.value) ??
                    null
                  : null
              }
              onChange={(_, value) => field.onChange(value?.id ?? "")}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              loading={students?.length === 0}
              className="col-span-7"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Estudante"
                  // error={!!errors.student_id}
                  // helperText={errors.student_id?.message}
                  required
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  <div className="flex gap-3 items-start justify-start">
                    <Avatar src={option.url_profile} alt="" variant="rounded" />
                    <div>
                      <strong className="text-sm">
                        {option.name.split(" ")[0]}
                      </strong>
                      <div className="text-[.7rem]">
                        <p>
                          Matrícula{" "}
                          <span className="font-semibold">
                            {option.registration}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              )}
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Cargo"
              fullWidth
              error={!!errors.role}
              helperText={errors.role?.message}
              className="col-span-5"
              required
            >
                {roles?.map((role, index) => (
                  <MenuItem key={index} value={role.toString()}>
                    {role}
                  </MenuItem>
                ))}
            </TextField>
          )}
        />
      </div>
      <Button
        variant="contained"
        type="submit"
        className="col-span-12"
        size="small"
      >
        Adicionar
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
