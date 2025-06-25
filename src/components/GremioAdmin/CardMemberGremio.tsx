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
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import { MemberView, Message } from "./SchemaGremioAdmin";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import { useBoolean } from "react-hooks-shareable";

interface MemberViewProps {
  member: MemberView;
  onDelete: (id: string) => void;
}

export default function CardMemberGremio({
  member,
  onDelete,
}: MemberViewProps) {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

  const [isViewDialog, openViewDialog, closeViewDialog, toggleViewDialog] =
    useBoolean(false);

  const handleDeleteMember = async () => {
    try {
      const response = await axios.delete<Message>(
        `${apiUrl}/members-gremio/${member.id}`
      );
      toast.success(response.data.message);
      console.log(response.status, response.data);
      onDelete(member.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-gray-300/30 rounded-lg border shadow-md font-Inter">
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
            Tem certeza que deseja excluir o membro(a) <span className="font-bold">{member.student.name}</span>  do
            Grêmio?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={closeViewDialog}>Fechar</Button>
          <Button
          color="error"
          variant="contained"
            onClick={() => {
              handleDeleteMember();
              toggleViewDialog();
            }}
            autoFocus
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
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
