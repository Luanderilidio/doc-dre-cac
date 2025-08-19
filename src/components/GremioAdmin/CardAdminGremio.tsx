import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Autocomplete,
  Button,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import moment from "moment/min/moment-with-locales";
import CardGremio from "./CardGremio";
import { GremioWithMember } from "./SchemaGremioAdmin";
import FormGremio from "./Forms/FormGremio";
import {
  useAllGremiosWithMembers,
  useDeleteGremio,
} from "../../services/Gremios";

export default function AdminGremio() {
  const { data, isLoading, error } = useAllGremiosWithMembers();
  const deleteMutation = useDeleteGremio();

  const [idGremio, setIdGremio] = useState<string | null>(null);
  const [viewFormsAddGremio, setViewFormsAddGremio] = useState<boolean>(false);
  const [viewFormsAddMembers, setViewFormsAddMembers] =
    useState<boolean>(false);
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    school: "",
    interlocutor: "",
    status: "all",
  });

  const filteredData = (data ?? []).filter((gremio) => {
    const nameMatch =
      filters.name === "" ||
      gremio.name.toLowerCase().includes(filters.name.toLowerCase());
    const cityMatch =
      filters.city === "" ||
      gremio.school.city.toLowerCase().includes(filters.city.toLowerCase());
    const schoolMatch =
      filters.school === "" ||
      gremio.school.name.toLowerCase().includes(filters.school.toLowerCase());
    const interlocutorMatch =
      filters.interlocutor === "" ||
      gremio.interlocutor.name
        .toLowerCase()
        .includes(filters.interlocutor.toLowerCase());
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "active" && gremio.status) ||
      (filters.status === "inactive" && !gremio.status);

    return (
      nameMatch && cityMatch && schoolMatch && interlocutorMatch && statusMatch
    );
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Grêmio removido com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao deletar Grêmio!");
      },
    });
  };

  const columns: GridColDef<GremioWithMember>[] = [
    { field: "id", headerName: "ID", width: 30 },
    { field: "name", headerName: "Nome", width: 140 },
    {
      field: "approval_date",
      headerName: "Nomeação",
      width: 100,
      renderCell: (params: GridRenderCellParams<any, Date>) => (
        <p>{moment(params.value).format("DD/MM/YYYY")}</p>
      ),
    },
    {
      field: "validity_date",
      headerName: "Vigência",
      width: 100,
      renderCell: (params: GridRenderCellParams<any, Date>) => (
        <p>{moment(params.value).format("DD/MM/YYYY")}</p>
      ),
    },
    {
      field: "school",
      headerName: "Escola",
      width: 120,
      renderCell: (params) => <p>{params.value?.name}</p>,
    },
    {
      field: "interlocutor",
      headerName: "Interlocutor",
      width: 100,
      renderCell: (params) => <p>{params.value?.name}</p>,
    },
    {
      field: "members",
      headerName: "Integrantes",
      width: 100,
      renderCell: (params) => {
        // console.log(params);
        return (
          <div className=" w-full flex justify-end gap-2 ">
            <p>{params.value?.length}</p>
            <IconButton
              color="primary"
              // onClick={() => {
              //   setMembers(params.value)
              //   openViewEditMember()
              // }}
            >
              <EditNoteIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 70,
      renderCell: (params) => (params.value ? "Ativo" : "Inativo"),
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 130,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // console.log("params.row", params.row);
        return (
          <div>
            <IconButton
              // onClick={() => handleViewMember(params.row)}
              color="primary"
            >
              <PersonAddIcon />
            </IconButton>

            <IconButton
              onClick={() => handleDelete(params.row.id)}
              color="error"
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const unique = (arr: string[]) => [...new Set(arr)];

  if (error) return <>deu pau!</>;
  if (isLoading) return <>Carregando</>;

  return (
    <div className="h-full grid grid-cols-12 gap-5  ">
      <div className="col-span-12 border grid grid-cols-12 gap-3 bg-gray-100/60 p-4 rounded-lg">
        <p className="col-span-12 text-xl font-bold">Filtros</p>
        <Autocomplete
          className="col-span-3"
          options={unique(data?.map((gremio) => gremio.name) ?? [])}
          value={filters.name}
          onChange={(_, value) =>
            setFilters((prev) => ({ ...prev, name: value || "" }))
          }
          renderInput={(params) => (
            <TextField {...params} label="Nome do Grêmio" />
          )}
        />

        <Autocomplete
          className="col-span-2"
          options={unique(data?.map((gremio) => gremio.school.city) ?? [])}
          value={filters.city}
          onChange={(_, value) =>
            setFilters((prev) => ({ ...prev, city: value || "" }))
          }
          renderInput={(params) => <TextField {...params} label="Cidade" />}
        />

        <Autocomplete
          className="col-span-2"
          options={unique(data?.map((gremio) => gremio.school.name) ?? [])}
          value={filters.school}
          onChange={(_, value) =>
            setFilters((prev) => ({ ...prev, school: value || "" }))
          }
          renderInput={(params) => <TextField {...params} label="Escola" />}
        />

        <Autocomplete
          className="col-span-2"
          options={unique(
            data?.map((gremio) => gremio.interlocutor.name) ?? []
          )}
          value={filters.interlocutor}
          onChange={(_, value) =>
            setFilters((prev) => ({ ...prev, teacher: value || "" }))
          }
          renderInput={(params) => (
            <TextField {...params} label="Interlocutor" />
          )}
        />

        <TextField
          className="col-span-2"
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

        <Button
          onClick={() => setViewFormsAddGremio(true)}
          className="col-span-1"
          variant="outlined"
          color="primary"
        >
          <AddCircleOutlineIcon sx={{ fontSize: 30 }} />
        </Button>
      </div>
      <div className="col-span-12 grid grid-cols-2 gap-5">
        {viewFormsAddGremio && (
          <div className="bg-gray-100/60 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <p className="col-span-12 text-xl font-bold">Cadastrar Grêmio</p>
              <IconButton
                aria-label=""
                onClick={() => setViewFormsAddGremio(false)}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <FormGremio />
          </div>
        )}
      </div>

      {filteredData?.map((item) => (
        <div className="col-span-3">
          <CardGremio initialDate={item} />
        </div>
      ))}
      <div className="col-span-12 border">
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
    </div>
  );
}
