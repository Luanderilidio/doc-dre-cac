import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Dialog,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { faker } from "@faker-js/faker";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useBoolean } from "react-hooks-shareable";
import PersonIcon from "@mui/icons-material/Person";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import SaveIcon from "@mui/icons-material/Save";
import {
  Student,
  StudentCreate,
  StudentCreateSchema,
} from "./SchemaGremioAdmin";

export default function CardAdminStudents() {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

  console.log(import.meta.env.VITE_BACK_END_API_DRE);
  const [isViewAdd, openViewAdd, closeViewAdd] = useBoolean(false);
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number>();
  const [rows, setRows] = useState<Student[]>([]);

  // Buscar estudantes
  const handleDataGet = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Student[]>(`${apiUrl}/students`);
      setRows(response.data);
      setStatusCode(response.status);
    } catch (error) {
      console.error("Erro ao buscar estudantes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Deletar estudante
  const handleDataDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${apiUrl}/students/${id}`);
      setRows((prev) => prev.filter((row) => row.id !== id));
      setStatusCode(response.status);
    } catch (error) {
      console.error("Erro ao deletar estudante:", error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar estudante
  const handleDataUpdate = async (newRow: Student, oldRow: Student) => {
    try {
      await axios.patch(`${apiUrl}/students/${newRow.id}`, newRow);
      setRows((prev) =>
        prev.map((row) => (row.id === newRow.id ? newRow : row))
      );
      return newRow;
    } catch (error) {
      console.error("Erro ao atualizar estudante:", error);
      throw error;
    }
  };

  // Cadastrar novo estudante
  const handleDataPost = async (data: StudentCreate) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await axios.post<Student>(`${apiUrl}/students`, data);
      setRows((prev) => [...prev, response.data]);
      setStatusCode(response.status);
      
      reset();
      console.log("POST ESTUDANTE", response.data);
    } catch (error) {
      console.error("Erro ao cadastrar estudante:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleDataGet();
  }, []);

  const columns: GridColDef<Student>[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nome", width: 150, editable: true },
    { field: "registration", headerName: "Matrícula", width: 120, editable: true },
    { field: "contact", headerName: "Contato", width: 120, editable: true },
    { field: "email", headerName: "Email", width: 180, editable: true },
    { field: "series", headerName: "Série", width: 100, editable: true },
    {
      field: "shift",
      headerName: "Turno",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: ["matutino", "vespertino", "noturno", "integral"],
    },
    {
      field: "url_profile",
      headerName: "Foto",
      width: 150,
      editable: true,
      renderCell: (params) => (
        params.value ? <a href={params.value} target="_blank" rel="noopener noreferrer">Ver foto</a> : "Nenhuma"
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      editable: true,
      type: "boolean",
      renderCell: (params) => (params.value ? "Ativo" : "Inativo"),
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDataDelete(params.row.id)}
          color="error"
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  // Configuração do formulário
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<StudentCreate>({
    resolver: zodResolver(StudentCreateSchema),
    defaultValues: {
      name: faker.person.fullName(),
      registration: faker.string.alphanumeric(8).toUpperCase(),
      contact: faker.phone.number({ style: "national" }),
      email: faker.internet.email(),
      series: faker.helpers.arrayElement(["1º Ano", "2º Ano", "3º Ano"]),
      shift: "matutino" as const,
      url_profile: faker.image.avatar(),
    },
  });

  const urlProfile = watch("url_profile");
  return (
    <div className="w-full flex flex-col items-center justify-between border gap-3 rounded-lg p-4">
      <div className="w-full flex items-center justify-between">
        <h1 className="font-bold text-gray-400">Cadastrar Aluno</h1>
        <div className="flex gap-3">
          <Button onClick={openViewAdd} variant="contained" size="small">
            Adicionar
          </Button>
          <Button onClick={handleDataGet} variant="outlined" size="small">
            Atualizar
          </Button>
        </div>
      </div>

      <Dialog open={isViewAdd} onClose={closeViewAdd} fullWidth maxWidth="sm">
        <form
          onSubmit={handleSubmit(handleDataPost)}
          className="p-4 flex flex-col "
        >
          {statusCode === 201 && (
            <Alert severity="success">Aluno cadastrado com sucesso!</Alert>
          )}

          <h1 className="w-full text-2xl font-bold text-center mb-3">
            CADASTRO DE ESTUDANTE
          </h1>

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
              {urlProfile !== "" ? (
                <img className="w-full h-full object-cover rounded-xl" src={urlProfile} alt="" />
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

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={closeViewAdd} variant="outlined" color="inherit">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={
                loading ? (
                  <DataSaverOffIcon className="animate-spin" />
                ) : (
                  <SaveIcon />
                )
              }
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Dialog>

      <div className="w-full ">
       <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={50}
          getRowId={(row) => row.id}
          loading={loading}
          editMode="row"
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          processRowUpdate={handleDataUpdate}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}
