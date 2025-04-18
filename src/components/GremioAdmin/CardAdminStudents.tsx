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
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useBoolean } from "react-hooks-shareable";
import { z } from "zod";
import PersonIcon from "@mui/icons-material/Person";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import SaveIcon from "@mui/icons-material/Save";

type Student = {
  id: string;
  registration: string;
  name: string;
  contact: string;
  email: string;
  series: string;
  status: boolean;
  shift: string;
  url_profile: string;
  created_at: string;
  disabled_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
};

const formSchema = z.object({
  registration: z.string(),
  name: z.string().min(1),
  contact: z.string(),
  email: z.string().email(),
  series: z.string(),
  shift: z.string(),
  url_profile: z.string().nullable().optional(),
});

export default function CardAdminStudents() {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;
  const [isViewAdd, openViewAdd, closeViewAdd, toggleViewAdd] =
    useBoolean(false);

  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number>();
  const [rows, setRows] = useState<Student[]>([]);

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

  const handleDataDelete = async (id: string) => {
    setLoading(true);
    try {
      console.log(id);
      const response = await axios.delete(`${apiUrl}/students/${id}`);
      setRows((prev) => prev.filter((row) => row.id !== id));
      setStatusCode(response.status);
    } catch (error) {
      console.error("Erro ao deletar escola:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataPath = async (
    newRow: Student,
    oldRow: Student,
    params: { rowId: GridRowId }
  ): Promise<Student> => {
    try {
      // Chama sua API para atualizar o backend
      await axios.patch(`${apiUrl}/students/${newRow.id}`, {
        registration: newRow.registration,
        name: newRow.name,
        contact: newRow.contact,
        email: newRow.email,
        series: newRow.series,
        status: newRow.status,
        shift: newRow.shift,
        url_profile: newRow.url_profile,
      });

      // Atualiza localmente
      const updatedRows = rows.map((row) =>
        row.id === newRow.id ? newRow : row
      );
      setRows(updatedRows);

      return newRow; // 👈 obrigatório retornar a row final
    } catch (error) {
      console.error("Erro ao atualizar escola:", error);
      throw error; // o DataGrid trata esse erro automaticamente
    }
  };

  const handleDataPost = async (data: any) => {
    setLoading(true);
    try {
      console.log({ ...data });
      const response = await axios.post<Student>(`${apiUrl}/students/`, data);

      console.log(response.status);
      setStatusCode(response.status);
      console.log(response.data);

      setRows((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Erro ao cadastrar Escola:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleDataGet();
  }, []);

  const columns: GridColDef<Student>[] = [
    { field: "id", headerName: "ID", width: 30 },
    { field: "name", headerName: "Escola", width: 140, editable: true },
    {
      field: "registration",
      headerName: "Matrícula",
      width: 100,
      editable: true,
    },
    { field: "contact", headerName: "Contato", width: 100, editable: true },
    { field: "email", headerName: "Email", width: 100, editable: true },
    { field: "series", headerName: "Série", width: 100, editable: true },
    { field: "shift", headerName: "Turno", width: 100, editable: true },
    {
      field: "url_profile",
      headerName: "Foto Perfil",
      width: 100,
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 70,
      editable: true,
      renderCell: (params) => (params.value ? "Ativo" : "Inativo"),
      renderEditCell: (params) => (
        <select
          value={params.value ? "true" : "false"}
          onChange={(e) => {
            const value = e.target.value === "true";
            params.api.setEditCellValue(
              { id: params.id, field: params.field, value },
              e
            );
          }}
          autoFocus
        >
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 40,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="flex">
          <IconButton
            onClick={() => handleDataDelete(params.row.id)}
            color="error"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const {
    control,
    register,
    handleSubmit,
    watch,
    // setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  return (
    <div className="w-full flex flex-col items-center justify-between border gap-3 rounded-lg p-4">
      <div className="w-full flex items-center justify-between">
        <h1 className="font-Montserrat font-bold text-gray-400">
          Cadastrar Aluno
        </h1>
        <div className="flex gap-3">
          <Button onClick={openViewAdd} variant="contained" size="small">
            Adicionar
          </Button>
          <Button onClick={handleDataGet} variant="outlined" size="small">
            Atualizar
          </Button>
        </div>
      </div>
      <Dialog open={isViewAdd} onClose={toggleViewAdd} fullWidth maxWidth="xs">
        <div className="p-4 flex flex-col gap-3">
          {statusCode === 201 && (
            <Alert severity="success">Aluno Cadastrado com Sucesso!</Alert>
          )}

          <h1 className="w-full text-3xl font-bold font-Roboto text-center mb-3">
            CADASTRE UM ESTUDANTE
          </h1>
          <div className="grid grid-cols-12 gap-2">
            <TextField
              fullWidth
              required
              size="small"
              label="Nome do Aluno"
              variant="outlined"
              className="col-span-10"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <div className="h-full col-span-2 row-span-2 rounded-md shadow-sm shadow-black/30 flex items-center justify-center">
              <PersonIcon sx={{ fontSize: 50 }} />
            </div>
            <TextField
              fullWidth
              size="small"
              required
              label="Contato"
              variant="outlined"
              className="col-span-5"
              {...register("contact")}
              error={!!errors.contact}
              helperText={errors.contact?.message}
            />
            <TextField
              fullWidth
              required
              size="small"
              label="Matrícula"
              variant="outlined"
              className="col-span-5"
              {...register("registration")}
              error={!!errors.registration}
              helperText={errors.registration?.message}
            />

            <TextField
              fullWidth
              size="small"
              required
              label="Email"
              variant="outlined"
              className="col-span-12"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              size="small"
              required
              label="Série"
              className="col-span-6"
              variant="outlined"
              {...register("series")}
              error={!!errors.series}
              helperText={errors.series?.message}
            />
            <FormControl
              required
              size="small"
              variant="outlined"
              className="col-span-6"
              fullWidth
              error={!!errors.shift}
            >
              <InputLabel>Turno</InputLabel>
              <Controller
                name="shift"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="modalidade-label"
                    label="Turno"
                    onChange={(event) => field.onChange(event.target.value)}
                  >
                    <MenuItem value="" disabled>
                      Selecione...
                    </MenuItem>
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
              fullWidth
              size="small"
              label="Url Perfil"
              variant="outlined"
              className="col-span-12"
              {...register("url_profile")}
              error={!!errors.url_profile}
              helperText={errors.url_profile?.message}
            />
          </div>
          <div className="w-full flex items-center justify-end gap-3">
            <Button
              onClick={closeViewAdd}
              size="small"
              type="submit"
              variant="outlined"
              color="inherit"
            >
              Fechar
            </Button>
            <Button
              onClick={handleSubmit(handleDataPost)}
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
        </div>
      </Dialog>
      <div className="w-full !h-96">
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
          processRowUpdate={handleDataPath}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}
