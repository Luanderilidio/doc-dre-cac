import { 
  Autocomplete, 
  Dialog, 
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useBoolean } from "react-hooks-shareable";
import { toast } from "react-toastify";
import EditNoteIcon from "@mui/icons-material/EditNote";
import moment from "moment/min/moment-with-locales";
import "moment/locale/pt-br";
import { School } from "./SchemaGremioAdmin";
import { useAllSchools, useDeleteSchool } from "../../services/School";
import FormSchool from "./Forms/FormSchool";

export default function CardAdminSchools() {
  const [isDialog, openDialog, closeDialog, toggleDialog] = useBoolean(false);
  const [isView, openView, closeView, toggleView] = useBoolean(false);
  const [school, setSchool] = useState<School>();
  const { data, isLoading, error } = useAllSchools();
  const deleteMutation = useDeleteSchool();

  const [filters, setFilters] = useState({
    name: "",
    city: "",
    status: "all",
  });

  const columns: GridColDef<School>[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Escola", width: 300 },
    { field: "city", headerName: "Cidade", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 70,
      renderCell: (params) => (params.value ? "Ativo" : "Inativo"),
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="flex">
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            color="error"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setSchool(params.row);
              openDialog();
            }}
            color="info"
            aria-label="delete"
          >
            <EditNoteIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setSchool(params.row);
              openView();
            }}
            color="info"
            aria-label="delete"
          >
            <VisibilityIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Escola removida com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao deletar escola!");
      },
    });
  };

  if (error) return <>deu pau!</>;
  if (isLoading) return <>Carregando</>;

  const filteredData = (data ?? []).filter((school) => {
    const nameMatch =
      filters.name === "" ||
      school.name.toLowerCase().includes(filters.name.toLowerCase());

    const cityMatch =
      filters.city === "" ||
      school.city.toLowerCase().includes(filters.city.toLowerCase());

    const statusMatch =
      filters.status === "all" ||
      (filters.status === "active" && school.status === true) ||
      (filters.status === "inactive" && school.status === false);

    return nameMatch && cityMatch && statusMatch;
  });

  const unique = (arr: string[]) => [...new Set(arr)];

  return (
    <div className="w-full h-full grid grid-cols-12 gap-4">
      <p className="col-span-12 text-start text-3xl font-bold">Escolas</p>
      <div className="col-span-8 p-4 gap-4 bg-gray-300/20 rounded-xl border">
        <p className="  text-xl font-Inter font-bold mb-3">Filtros</p>
        <div className="grid grid-cols-12 gap-4">
          <Autocomplete
            className="col-span-4"
            options={unique((data ?? []).map((school) => school.name))}
            value={filters.name}
            onChange={(_, value) =>
              setFilters((prev) => ({ ...prev, name: value || "" }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Nome da Escola" />
            )}
          />
          <Autocomplete
            className="col-span-3"
            options={unique((data ?? []).map((school) => school.city))}
            value={filters.city}
            onChange={(_, value) =>
              setFilters((prev) => ({ ...prev, city: value || "" }))
            }
            renderInput={(params) => <TextField {...params} label="Cidade" />}
          />
          <TextField
            className="col-span-3"
            select
            label="Status"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="active">Ativos</MenuItem>
            <MenuItem value="inactive">Inativos</MenuItem>
          </TextField>
        </div>
      </div>
      <div className="col-span-4">
        <FormSchool />
      </div>

      <div className="col-span-8 rounded-xl ">
        <DataGrid
          rows={filteredData}
          columns={columns}
          rowHeight={50}
          getRowId={(row) => row.id}
          loading={isLoading}
          editMode="row"
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      </div>
      {isView && (
        <div className="col-span-4 rounded-xl bg-gray-300/10 p-4 h-fit border">
          <div className="flex items-center justify-between">
            <IconButton className="invisible">
              <CloseIcon />
            </IconButton>
            <h1 className="w-full text-xl font-bold text-center">
              Visualização
            </h1>
            <IconButton onClick={closeView}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="">
            <h1 className="text-xl font-bold">ID</h1>
            <h1 className="text-sm">{school?.id}</h1>
          </div>
          <div className="flex gap-3 mt-2">
            <div>
              <h1 className="text-xl font-bold">Escola</h1>
              <h1 className="text-sm">{school?.name}</h1>
            </div>
            <div>
              <h1 className="text-xl font-bold">Cidade</h1>
              <h1 className="text-sm">{school?.city}</h1>
            </div>
            <div>
              <h1 className="text-xl font-bold">Status</h1>
              <h1 className="text-sm">
                {school?.status ? "Ativo" : "Inativo"}
              </h1>
            </div>
          </div>
          <div className="mt-6 flex justify-evenly opacity-70">
            <div>
              <h1 className="text-xs font-bold">Criado em</h1>
              <h1 className="text-xs">
                {school?.created_at
                  ? moment(school?.created_at).format("L")
                  : ""}
              </h1>
            </div>
            <div>
              <h1 className="text-xs font-bold">Alterado em</h1>
              <h1 className="text-xs">
                {school?.updated_at
                  ? moment(school?.updated_at).format("L")
                  : ""}
              </h1>
            </div>
            <div>
              <h1 className="text-xs font-bold">Desabilitado em</h1>
              <h1 className="text-xs">
                {school?.disabled_at
                  ? moment(school?.disabled_at).format("L")
                  : ""}
              </h1>
            </div>
            <div>
              <h1 className="text-xs font-bold">Excluído em</h1>
              <h1 className="text-xs">
                {school?.deleted_at
                  ? moment(school?.deleted_at).format("L")
                  : ""}
              </h1>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isDialog} onClose={closeDialog}>
        <FormSchool
          initialDate={{
            city: school?.city,
            name: school?.name,
          }}
          school_id={school?.id}
        />
      </Dialog>
    </div>
  );
}
