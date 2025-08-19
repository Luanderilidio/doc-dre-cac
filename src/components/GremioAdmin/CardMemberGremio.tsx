import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { ptBR } from "@mui/x-data-grid/locales";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import { MemberWithStudent, Student } from "./SchemaGremioAdmin";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import { useBoolean } from "react-hooks-shareable";
import {
  useAllMembersGremioWithStudentsByGremioId,
  useDeleteMemberGremio,
} from "../../services/MemberGremio";

interface MemberViewProps {
  gremio_id: string;
}

export default function CardMemberGremio({ gremio_id }: MemberViewProps) {
  const deleteMutation = useDeleteMemberGremio(gremio_id);

  const { data, refetch, isLoading } =
    useAllMembersGremioWithStudentsByGremioId(gremio_id);

  console.log(data);

  const [isViewDialog, openViewDialog, closeViewDialog, toggleViewDialog] =
    useBoolean(false);

  const handleDelete = (id: string) => {
    refetch();
    deleteMutation.mutate(id, {
      onSuccess: async () => {
        toast.success("Membro removido com sucesso!");
        await refetch();
      },
      onError: () => {
        toast.error("Erro ao deletar Membro!");
      },
    });
  };

  const columns: GridColDef<MemberWithStudent>[] = [
    // { field: "id", headerName: "ID", width: 30 },
    {
      field: "url_photo",
      headerName: "Foto",
      width: 70,
      renderCell: (params) => (
        <div className="h-full flex items-center justify-center">
          <img
            className="rounded-full w-10 h-10"
            src={params.row.student.url_profile}
            alt=""
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Nome",
      width: 120,
      renderCell: (params) => <p>{params.row.student.name}</p>,
    },
    {
      field: "role",
      headerName: "Cargo",
      width: 160,
      renderCell: (params) => <p>{params.row.role}</p>,
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 60,
      sortable: false,
      renderCell: (params) => (
        <div className="flex">
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

  return (
    <>
      {/* <Button onClick={() => refetch()}>Atualizar</Button> */}
      <div className="w-full">
      <DataGrid
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        rows={data}
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
      {/* <div className="flex items-center justify-between p-4 bg-gray-300/30 rounded-lg border shadow-md font-Inter">
        <div className="flex items-center gap-4">
          <Avatar
            src={member.student.url_profile}
            sx={{ width: 70, height: 70 }}
            variant="rounded"
          />
          <div className="flex flex-col items-start justify-start gap-1">
            <div className="flex items-center justify-start gap-2">
              <div className="bg-green-500 px-2 text-white uppercase leading-none pb-[2px] pt-1 font-bold rounded-sm w-fit text-[.6rem] flex items-center justify-center">
                {member.role}
              </div>
              <div className="bg-orange-500 px-2 text-white uppercase leading-none pb-[2px] pt-1  font-bold rounded-sm w-fit text-[.6rem]">
                {member.student.shift}
              </div>
              <div className="bg-yellow-500 px-2 text-white uppercase leading-none pb-[2px] pt-1  font-bold rounded-sm w-fit text-[.6rem]">
                {member.student.series}
              </div>
            </div>
            <h1 className="font-bold font-Inter text-[1.3rem]">
              {member.student.name}
            </h1>
            <div className="flex text-[.8rem] gap-4">
              <p className="font-bold">
                ID:{" "}
                <span className="font-normal">
                  {member.student.registration}
                </span>
              </p>
              <div className="w-fit flex items-center justify-center gap-1">
                <EmailIcon sx={{ fontSize: 15 }} />
                <p className="leading-none">{member.student.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <IconButton onClick={openViewDialog} aria-label="Deletar">
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
      <Dialog
        open={isViewDialog}
        onClose={closeViewDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Excluir membro do Grêmio
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o membro(a){" "}
            <span className="font-bold">{member.student.name}</span> do Grêmio?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={closeViewDialog}>
            Fechar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              handleDelete(member.id);
              toggleViewDialog();
              refetch()
            }}
            autoFocus
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog> */}
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
