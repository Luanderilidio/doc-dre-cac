import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Avatar,
  Button,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  Member,
  MemberCreate,
  MemberCreateSchema,
  MemberView,
  Student,
} from "./SchemaGremioAdmin";

import CardMemberGremio from "./CardMemberGremio";

type FormsAddMemberProps = {
  gremio_id: string;
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

export default function FormsAddMember({ gremio_id }: FormsAddMemberProps) {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [members, setMembers] = useState<MemberView[]>([]);
  const [rolesNoActive, setRolesNoActive] = useState<string[]>([""]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberCreate>({
    resolver: zodResolver(MemberCreateSchema),
    mode: "onChange",
    defaultValues: {
      gremio_id: gremio_id,
      student_id: "",
      role: "",
    },
  });

  const handleDataPost = async (data: any) => {
    setLoading(true);
    try {
      const response = await axios.post<Member>(`${apiUrl}/members-gremio`, {
        gremio_id: gremio_id,
        student_id: data.student_id,
        role: data.role,
        status: true,
      });
      toast.success("Membro Cadastado com Sucesso!"); 

      handleDataGetMembers();
    } catch (error) {
      console.error("Erro ao cadastrar Estudante:", error);
    } finally {
      setLoading(false);
      handleDataGetStudents();
      handleDataGetRoles();
      handleDataGetMembers();
    }
  };

  const handleDataGetStudents = async () => {
    try {
      const response = await axios.get<Student[]>(
        `${apiUrl}/students?not_participate_gremio=true`
      );
      setStudents(response.data ?? []);
    } catch (error) {
      console.error("Erro ao buscar Estudantes:", error);
    }
  };

  const handleDataGetRoles = async () => {
    try {
      const response = await axios.get<string[]>(
        `${apiUrl}/members-gremio?only_roles=true&gremio_id=${gremio_id}`
      ); 
      const rolesNotActive = rolesOriginal.filter(
        (role) => !response.data.includes(role)
      ); 
      setRolesNoActive(rolesNotActive);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar cargos:", error);
    }
  };

  const handleDataGetMembers = async () => {
    try {
      const response = await axios.get<MemberView[]>(
        `${apiUrl}/members-gremio?gremio_id=${gremio_id}`
      );  
      setMembers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleDataGetStudents();
    handleDataGetRoles();
    handleDataGetMembers();
  }, []);

  const handleDeleteMember = (memberId: string) => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== memberId)
    );
    handleDataGetRoles();
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4 border-red-500">
        <form
          onSubmit={handleSubmit(handleDataPost)}
          className="col-span-12 grid grid-cols-12 gap-4"
        >
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
                className="col-span-4"
                required
              >
                {rolesNoActive.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="student_id"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={students}
                getOptionLabel={(option) => option.name}
                value={
                  field.value
                    ? students.find((student) => student.id === field.value) ??
                      null
                    : null
                }
                onChange={(_, value) => field.onChange(value?.id ?? "")}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                loading={students.length === 0}
                className="col-span-6"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Estudante"
                    error={!!errors.student_id}
                    helperText={errors.student_id?.message}
                    required
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <div className="flex gap-3 items-start justify-start">
                      <Avatar
                        src={option.url_profile}
                        alt=""
                        variant="rounded"
                      />
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
          <Tooltip title="Adicionar Membro" arrow>
            <Button
              type="submit"
              className="col-span-2"
              variant="outlined"
              color="primary"
            >
              <AddCircleOutlineIcon sx={{ fontSize: 30 }} />
            </Button>
          </Tooltip>
        </form>

        <div className="col-span-12 flex flex-col gap-1">
          {members?.map((member) => (
            <CardMemberGremio
              key={member.id}
              member={member}
              onDelete={handleDeleteMember}
            />
          ))}
        </div>
      </div>
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
    </>
  );
}
