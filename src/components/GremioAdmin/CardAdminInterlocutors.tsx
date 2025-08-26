import {
  Autocomplete,
  Button,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useBoolean } from "react-hooks-shareable";
import { toast } from "react-toastify";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment/min/moment-with-locales";
import "moment/locale/pt-br";
import { Interlocutor, InterlocutorCreate } from "./SchemaGremioAdmin";
import {
  useAllInterlocutors,
  useDeleteInterlocutor,
} from "../../services/Interlocutors";
import FormInterlocutor from "./Forms/FormInterlocutor";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";

export default function CardAdminInterlocutors() {
  const [isView, openView, closeView, toggleView] = useBoolean(false);
  const [isDialog, openDialog, closeDialog, toggleDialog] = useBoolean(false);
  const [interlocutor, setInterlocutor] = useState<Interlocutor>();

  const { data, isLoading, error } = useAllInterlocutors();
  const deleteMutation = useDeleteInterlocutor();

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    status: "all",
  });

  const columns: GridColDef<Interlocutor>[] = [
    { field: "id", headerName: "ID", width: 30 },
    { field: "name", headerName: "Nome", width: 140, editable: true },
    { field: "email", headerName: "Email", width: 100, editable: true },
    { field: "contact", headerName: "Contato", width: 100, editable: true },
    {
      field: "status",
      headerName: "Status",
      width: 70,
      editable: true,
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
            onClick={() => {
              setInterlocutor(params.row);
              openDialog();
            }}
            color="info"
            aria-label="delete"
          >
            <EditNoteIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setInterlocutor(params.row);
              openView();
            }}
            color="info"
            aria-label="delete"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            color="error"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Interlocutor removido com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao deletar Interlocutor!");
      },
    });
  };

  const filteredData = (data ?? []).filter((interlocutor) => {
    const nameMatch =
      filters.name === "" ||
      interlocutor.name.toLowerCase().includes(filters.name.toLowerCase());

    const emailMatch =
      filters.email === "" ||
      interlocutor.email.toLowerCase().includes(filters.email.toLowerCase());

    const statusMatch =
      filters.status === "all" ||
      (filters.status === "active" && interlocutor.status === true) ||
      (filters.status === "inactive" && interlocutor.status === false);

    return nameMatch && emailMatch && statusMatch;
  });

  const unique = (arr: string[]) => [...new Set(arr)];

  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  if (error) return <>deu pau!</>;
  if (isLoading) return <>Carregando</>;

  return (
    <div className="w-full h-full grid grid-cols-12 gap-4">
      <p className="col-span-12 text-start text-3xl font-bold">Interlocutores</p>
      <div className="col-span-8 p-4 gap-4 bg-gray-300/20 rounded-xl border">
        <p className="  text-xl font-Inter font-bold mb-3">Filtros</p>
        <div className="grid grid-cols-12 gap-4">
          <Autocomplete
            className="col-span-4"
            options={unique(
              (data ?? []).map((interlocutor) => interlocutor.name)
            )}
            value={filters.name}
            onChange={(_, value) =>
              setFilters((prev) => ({ ...prev, name: value || "" }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Nome do Interlocutor" />
            )}
          />
          <Autocomplete
            className="col-span-3"
            options={unique(
              (data ?? []).map((interlocutor) => interlocutor.email)
            )}
            value={filters.email}
            onChange={(_, value) =>
              setFilters((prev) => ({ ...prev, city: value || "" }))
            }
            renderInput={(params) => <TextField {...params} label="Email" />}
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
          <Button className="col-span-2" {...bindTrigger(popupState)}>
            Adicionar
          </Button>
          <Menu
            className="!p-4"
            MenuListProps={{
              sx: { p: 0, borderRadius: "12px" }, // padding = 0
            }}
            PaperProps={{
              sx: {
                p: 0, // remove padding do Paper
              },
            }}
            {...bindMenu(popupState)}
          >
            <FormInterlocutor />
          </Menu>
        </div>
      </div>

      <div className="col-span-8">
        <DataGrid
          rows={filteredData}
          columns={columns}
          rowHeight={50}
          getRowId={(row) => row.id}
          loading={isLoading}
          editMode="row"
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
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
            <h1 className="text-sm">{interlocutor?.id}</h1>
          </div>
          <div className="flex gap-3 mt-2">
            <div>
              <h1 className="text-xl font-bold">Interlocutor</h1>
              <h1 className="text-sm">{interlocutor?.name}</h1>
            </div>
            <div>
              <h1 className="text-xl font-bold">Contato</h1>
              <h1 className="text-sm">{interlocutor?.contact}</h1>
            </div>
            <div>
              <h1 className="text-xl font-bold">Status</h1>
              <h1 className="text-sm">
                {interlocutor?.status ? "Ativo" : "Inativo"}
              </h1>
            </div>
          </div>
          <div className="mt-6 flex justify-evenly opacity-70">
            <div>
              <h1 className="text-xs font-bold">Criado em</h1>
              <h1 className="text-xs">
                {interlocutor?.created_at
                  ? moment(interlocutor?.created_at).format("L")
                  : ""}
              </h1>
            </div>
            <div>
              <h1 className="text-xs font-bold">Alterado em</h1>
              <h1 className="text-xs">
                {interlocutor?.updated_at
                  ? moment(interlocutor?.updated_at).format("L")
                  : ""}
              </h1>
            </div>
            <div>
              <h1 className="text-xs font-bold">Desabilitado em</h1>
              <h1 className="text-xs">
                {interlocutor?.disabled_at
                  ? moment(interlocutor?.disabled_at).format("L")
                  : ""}
              </h1>
            </div>
            <div>
              <h1 className="text-xs font-bold">Excluído em</h1>
              <h1 className="text-xs">
                {interlocutor?.deleted_at
                  ? moment(interlocutor?.deleted_at).format("L")
                  : ""}
              </h1>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isDialog} onClose={closeDialog}>
        <FormInterlocutor
          initialDate={{
            name: interlocutor?.name,
            email: interlocutor?.email,
            contact: interlocutor?.contact,
          }}
          interlocutor_id={interlocutor?.id}
        />
      </Dialog>
    </div>
  );
}
