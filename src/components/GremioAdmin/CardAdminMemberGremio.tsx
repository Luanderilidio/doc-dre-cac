import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Autocomplete,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Member,
  MemberCreate,
  MemberCreateSchema,
  Student,
} from "./SchemaGremioAdmin";

export default function CardAdminMemberGremio({
  gremio_id,
  students,
  role,
  onStudentSelect,
  onRemoveRole,
}: {
  gremio_id: string;
  students: Student[];
  role: string;
  onStudentSelect: (student: Student | null) => void;
  onRemoveRole: (role: string) => void;
}) {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number>();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  console.log(role, students);

  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MemberCreate>({
    resolver: zodResolver(MemberCreateSchema),
    mode: "onChange",
  });

  const selectedStudentId = useWatch({ control, name: "student_id" });
  
  const handleDataPost = async (data: MemberCreate) => {
    setLoading(true);
    console.log(data);
    try {
      console.log("data Post Membros", {
        gremio_id: gremio_id,
        student_id: data.student_id,
        role: role,
      });
      const response = await axios.post<Member>(`${apiUrl}/members-gremio`, {
        gremio_id: gremio_id,
        student_id: data.student_id,
        role: role,
        status: true,
      });

      setSelectedStudent(
        students.find((s) => s.id === data.student_id) || null
      );

      console.log("data Post Membros", response.status);
      onRemoveRole(role);

      console.log("set member", {
        gremio_id: gremio_id,
        student_id: data.student_id,
        role: role,
        status: true,
        // student: data.student,
      });

      setStatusCode(response.status);
      onStudentSelect(selectedStudent);
    } catch (error) {
      console.error("Erro ao cadastrar Estudante:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleDataPost)}
      className="grid grid-cols-12 gap-3 border-2 rounded-2xl px-4 pb-4 pt-7 relative mt-5 font-Roboto"
    >
      {statusCode === 201 && (
        <Alert className="col-span-12" severity="success">
          <span className="capitalize">{role}</span> Cadastrado com Sucesso!
        </Alert>
      )}

      <div className="col-span-12 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <p className="bg-white px-3 font-semibold text-center leading-none text-nowrap w-fit">
          {role}
        </p>
      </div>

      {statusCode === 201 ? (
        <>
          <TextField
            className="col-span-6"
            disabled
            InputLabelProps={{ shrink: true }}
            size="small"
            label="Escola"
            value={selectedStudent?.name}
          />
        </>
      ) : (
        <>
          <Controller
            name="student_id"
            control={control}
            render={({ field }) => (
              <Autocomplete
                disabled={statusCode === 201}
                className="col-span-6"
                size="small"
                options={students}
                getOptionLabel={(option) => option.name || ""}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                value={students.find((i) => i.id === selectedStudentId) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.id || ""); // Armazena apenas o ID
                  setSelectedStudent(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    className="col-span-6"
                    {...params}
                    label="Aluno"
                    error={!!errors.student_id}
                    helperText={errors.student_id?.message}
                    required
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <div className="flex gap-2">
                      <img
                        src={option.url_profile}
                        className="w-10 h-10 rounded-md"
                        alt=""
                      />
                      <div>
                        <strong>{option.name}</strong>
                        <p className="text-sm">{option.registration}</p>
                      </div>
               
                    </div>
                  </li>
                )}
              />
            )}
          />
        </>
      )}

      <FormControl fullWidth className="col-span-3" size="small">
        <InputLabel>Cargo</InputLabel>
        <Select disabled value={role} label="Cargo">
          <MenuItem value={role}>{role}</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth className="col-span-3" size="small">
        <InputLabel>Status</InputLabel>
        <Select disabled value={1} label="Status">
          <MenuItem value={1}>Ativo</MenuItem>
          <MenuItem value={2}>Inativo</MenuItem>
        </Select>
      </FormControl>

      <TextField
        className="col-span-3"
        disabled
        InputLabelProps={{ shrink: true }}
        size="small"
        label="Matrícula"
        value={selectedStudent?.registration}
      />

      <TextField
        disabled
        InputLabelProps={{ shrink: true }}
        className="col-span-3"
        size="small"
        label="Contato"
        value={selectedStudent?.contact}
      />

      <TextField
        disabled
        InputLabelProps={{ shrink: true }}
        className="col-span-3"
        size="small"
        label="Série"
        value={selectedStudent?.series}
      />

      <TextField
        disabled
        InputLabelProps={{ shrink: true }}
        className="col-span-3"
        size="small"
        label="Turno"
        value={selectedStudent?.shift}
      />

      <TextField
        disabled
        InputLabelProps={{ shrink: true }}
        className="col-span-12"
        size="small"
        label="Email"
        value={selectedStudent?.email}
      />

      <div className="col-span-12 flex items-center justify-end gap-3">
        <Button variant="contained" color="error" size="small">
          Excluir
        </Button>
        <Button
          disabled={statusCode === 201}
          size="small"
          type="submit"
          variant="contained"
          color="primary"
          startIcon={
            loading ? (
              <DataSaverOffIcon className="animate-spin" />
            ) : (
              <SaveIcon />
            )
          }
        >
          Cadastrar
        </Button>
      </div>
    </form>
  );
}
