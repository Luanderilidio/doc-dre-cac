import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Dialog, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useBoolean } from "react-hooks-shareable"; 
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import SaveIcon from "@mui/icons-material/Save";
import {
  School,
  SchoolCreate,
  SchoolCreateSchema,
} from "./SchemaGremioAdmin";


export default function CardAdminSchools() {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;
  const [isViewAdd, openViewAdd, closeViewAdd, toggleViewAdd] =
    useBoolean(false);

  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number>();
  const [rows, setRows] = useState<School[]>([]);

  const handleDataGet = async () => {
    setLoading(true);
    try {
      const response = await axios.get<School[]>(`${apiUrl}/schools`);
      setRows(response.data);
      setStatusCode(response.status);
    } catch (error) {
      console.error("Erro ao buscar escolas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataDelete = async (id: string) => {
    setLoading(true);
    try { 
      const response = await axios.delete(`${apiUrl}/schools/${id}`);
      setRows((prev) => prev.filter((row) => row.id !== id));
      setStatusCode(response.status);
    } catch (error) {
      console.error("Erro ao deletar escola:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataPath = async (
    newRow: School,
    _oldRow: School,
    _params: { rowId: GridRowId }
  ): Promise<School> => {
    try {
      // Chama sua API para atualizar o backend
      await axios.patch(`${apiUrl}/schools/${newRow.id}`, {
        name: newRow.name,
        city: newRow.city,
        status: newRow.status,
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

  useEffect(() => {
    handleDataGet();
  }, []);

  const columns: GridColDef<School>[] = [
    { field: "id", headerName: "ID", width: 30 },
    { field: "name", headerName: "Escola", width: 140, editable: true },
    { field: "city", headerName: "Cidade", width: 100, editable: true },
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
  } = useForm<SchoolCreate>({
    resolver: zodResolver(SchoolCreateSchema),
    mode: "onChange",
  });

  const handleDataPost = async (data: any) => {
    setLoading(true);
    try { 
      const response = await axios.post<School>(`${apiUrl}/schools`, {
        ...data,
      });
 
      setStatusCode(response.status); 
      setRows((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Erro ao cadastrar Escola:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-between border gap-3 rounded-lg p-4">
      <div className="w-full flex items-center justify-between">
        <h1 className="font-Montserrat font-bold text-gray-400">
          Cadastrar Escola
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
            <Alert severity="success">Escola Cadastrada com Sucesso!</Alert>
          )}

          <h1 className="w-full text-3xl font-bold font-Roboto text-center mb-3">
            CADASTRE UMA ESCOLA
          </h1>
          <TextField
            fullWidth
            size="small"
            required
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
            variant="outlined"
            {...register("city")}
            error={!!errors.city}
            helperText={errors.city?.message}
          />
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
