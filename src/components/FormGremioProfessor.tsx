import { useState } from "react";
import { Divider, InputAdornment, TextField, Button } from "@mui/material";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

interface FormGremioProfessorProps {
  escola: string;
  nome_professor: string;
  contato_professor: string;
  email_professor: string;
}

export default function FormGremioProfessor({
  escola,
  nome_professor,
  contato_professor,
  email_professor,
}: FormGremioProfessorProps) {
  const apiUrl = import.meta.env.VITE_BACK_END_URL_GREMIOS as string;

  const [professor, setProfessor] = useState({
    escola: escola,
    nome: nome_professor,
    contato: contato_professor,
    email: email_professor,
  });

  const [backupProfessor] = useState({ ...professor });
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfessor((prev) => ({ ...prev, [name]: value }));
  };

  const iniciarEdicao = () => setEditando(true);

  const handleCancel = () => {
    setProfessor(backupProfessor);
    setEditando(false);
  };

  const handleDataTeacher = async () => {
    setLoading(true);
    try {
      const paramsUrl = {
        action: "alterProfessor",
        ...professor,
      };
 
      const response = await axios.get(apiUrl, { params: paramsUrl }); 
    } catch (error) {
      console.error("Erro ao atualizar Professor:", error);
    } finally {
      setLoading(false);
      setEditando(false);
    }
  };

  return (
    <>
      <Divider className="col-span-12 font-semibold">
        Professor Interlocutor / Mediador
      </Divider>

      <TextField
        fullWidth
        className="col-span-6"
        size="small"
        name="nome"
        label="Nome Professor"
        variant="outlined"
        error={professor.nome === "N/A"}
        value={professor.nome}
        onChange={handleChange}
        disabled={!editando}
      />

      <TextField
        fullWidth
        size="small"
        name="contato"
        label="Contato"
        className="col-span-6"
        variant="outlined"
        error={professor.contato === "N/A"}
        value={professor.contato}
        onChange={handleChange}
        disabled={!editando}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <WhatsAppIcon
                sx={{
                  fontSize: 20,
                  cursor: "pointer",
                  color: "green",
                }}
              />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        size="small"
        name="email"
        label="Email"
        className="col-span-12"
        variant="outlined"
        error={professor.email === "N/A"}
        value={professor.email}
        onChange={handleChange}
        disabled={!editando}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <ContentCopyIcon
                className="cursor-pointer hover:text-red-600"
                sx={{ fontSize: 20 }}
              />
              <EmailIcon
                className="cursor-pointer hover:text-red-600 ml-2"
                sx={{ fontSize: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />

      {/* Botões */}
      <div className="col-span-12 flex items-center justify-end gap-3">
        {editando ? (
          <>
            <Button
              variant="contained"
              size="small"
              color="primary"
              startIcon={
                loading ? (
                  <DataSaverOffIcon className="animate-spin" />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={() => handleDataTeacher()}
            >
              Salvar
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<EditIcon />}
            onClick={iniciarEdicao}
          >
            Editar
          </Button>
        )}
      </div>
    </>
  );
}
