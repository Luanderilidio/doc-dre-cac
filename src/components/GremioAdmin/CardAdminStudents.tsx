import {
  Autocomplete,
  Button,
  Dialog,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ptBR } from "@mui/x-data-grid/locales";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { useBoolean } from "react-hooks-shareable";
import { Student, StudentWithSchool } from "./SchemaGremioAdmin";
import { useAllStudents, useDeleteStudent } from "../../services/Students";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import FormStudent from "./Forms/FormStudent";

export default function CardAdminStudents() {
  const [isView, openView, closeView, toggleView] = useBoolean(false);
  const [isDialog, openDialog, closeDialog, toggleDialog] = useBoolean(false);
  const [student, setStudent] = useState<StudentWithSchool>();

  const { data, isLoading, error } = useAllStudents();
  const deleteMutation = useDeleteStudent();

  const [filters, setFilters] = useState({
    name: "",
    registration: "",
    school: "",
    series: "",
    shift: "all",
  });

  const columns: GridColDef<StudentWithSchool>[] = [
    { field: "id", headerName: "ID", width: 40 },
    {
      field: "url_profile",
      headerName: "Foto",
      width: 70,
      renderCell: (params) => (
        <div className="h-full flex items-center justify-center">
          <img className="rounded-full w-10" src={params.value} alt="" />
        </div>
      ),
    },
    { field: "name", headerName: "Nome", width: 150 },
    { field: "registration", headerName: "Matrícula", width: 80 },
    { field: "contact", headerName: "Contato", width: 120 },
    { field: "email", headerName: "Email", width: 140 },
    { field: "series", headerName: "Série", width: 80 },
    {
      field: "shift",
      headerName: "Turno",
      width: 80,
    },
    {
      field: "school",
      headerName: "Escola",
      width: 160,
      renderCell: (params) => <p>{params.row.school.name}</p>,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (params.value ? "Ativo" : "Inativo"),
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div className="flex">
          <IconButton
            onClick={() => {
              setStudent(params.row);
              openDialog();
            }}
            color="info" 
          >
            <EditNoteIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setStudent(params.row);
              openView();
            }}
            color="info" 
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
        toast.error("Erro ao deletar Estudante!");
      },
    });
  };

  const filteredData = (data ?? []).filter((student) => {
    const nameMatch =
      filters.name === "" ||
      student.name.toLowerCase().includes(filters.name.toLowerCase());
    const schoolMatch =
      filters.school === "" ||
      student.school.name.toLowerCase().includes(filters.school.toLowerCase());

    const registrationMatch =
      filters.registration === "" ||
      student.registration
        .toLowerCase()
        .includes(filters.registration.toLowerCase());

    const seriesMatch =
      filters.series === "" ||
      student.series.toLowerCase().includes(filters.series.toLowerCase());

    const shiftMatch =
      filters.shift === "all" ||
      (filters.shift === "matutino" && student.shift === "matutino") ||
      (filters.shift === "vespertino" && student.shift === "vespertino") ||
      (filters.shift === "noturno" && student.shift === "noturno") ||
      (filters.shift === "integral" && student.shift === "integral");

    // const statusMatch =
    //   filters.status === "all" ||
    //   (filters.status === "active" && student.status === true) ||
    //   (filters.status === "inactive" && student.status === false);

    return nameMatch && schoolMatch && registrationMatch && seriesMatch && shiftMatch;
  });

  const unique = (arr: string[]) => [...new Set(arr)];

  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  // if (isLoading) return <>Carregando</>;

  return (
    <div className="w-full h-full grid grid-cols-12 gap-4">
      <p className="col-span-12 text-start text-3xl font-bold">Estudantes</p>
      <div className="col-span-12 p-4 gap-4 bg-gray-300/20 rounded-xl border">
        <p className="text-xl font-Inter font-bold mb-3">Filtros</p>
        <div className="grid grid-cols-14 gap-4">
          <Autocomplete
            className="col-span-3"
            options={unique(
              (data ?? []).map((interlocutor) => interlocutor.name)
            )}
            value={filters.name}
            onChange={(_, value) =>
              setFilters((prev) => ({ ...prev, name: value || "" }))
            }
            renderInput={(params) => <TextField {...params} label="Nome" />}
          />
          <Autocomplete
            className="col-span-3"
            options={unique((data ?? []).map((student) => student.school.name))}
            value={filters.school}
            onChange={(_, value) =>
              setFilters((prev) => ({ ...prev, school: value || "" }))
            }
            renderInput={(params) => <TextField {...params} label="Escola" />}
          />
          <Autocomplete
            className="col-span-2"
            options={unique(
              (data ?? []).map((student) => student.registration)
            )}
            value={filters.registration}
            onChange={(_, value) =>
              setFilters((prev) => ({ ...prev, registration: value || "" }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Matrícula" />
            )}
          />

          <Autocomplete
            className="col-span-2"
            options={unique((data ?? []).map((student) => student.series))}
            value={filters.series}
            onChange={(_, value) =>
              setFilters((prev) => ({ ...prev, series: value || "" }))
            }
            renderInput={(params) => <TextField {...params} label="Série" />}
          />

          <TextField
            className="col-span-2"
            select
            label="Turno"
            value={filters.shift}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, shift: e.target.value }))
            }
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="matutino">Matutino</MenuItem>
            <MenuItem value="vespertino">Vespertino</MenuItem>
            <MenuItem value="noturno">Noturno</MenuItem>
            <MenuItem value="Integral">integral</MenuItem>
          </TextField>
          <Button className="col-span-2" variant="outlined" {...bindTrigger(popupState)}>
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
            <FormStudent />
          </Menu>
        </div>
      </div>

      <div className="col-span-12">
        <DataGrid
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          rows={filteredData}
          columns={columns}
          rowHeight={50}
          getRowId={(row) => row.id}
          loading={isLoading}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
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

      <Dialog open={isDialog} onClose={closeDialog}>
        <FormStudent
          initialDate={student}
          student_id={student?.id}
        />
      </Dialog>
    </div>
  );
}
