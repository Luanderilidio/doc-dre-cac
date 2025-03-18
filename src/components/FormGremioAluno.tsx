import { useEffect, useState } from "react";
import axios from "axios";
import { Divider, InputAdornment, TextField, Button } from "@mui/material";
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import { AlunosGremio } from "./GremioCard";

interface FormGremioAlunoProps {
  dadosAluno: AlunosGremio;
}

export default function FormGremioAluno({ dadosAluno }: FormGremioAlunoProps) {
  const [aluno, setAluno] = useState<AlunosGremio>(dadosAluno);
  const [backupAluno, setBackupAluno] = useState<AlunosGremio>({
    ...dadosAluno,
  });
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_BACK_END_URL_GREMIOS as string;

  useEffect(() => {
    setAluno(dadosAluno);
    setBackupAluno(dadosAluno);
  }, [dadosAluno]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAluno((prev) => ({ ...prev, [name]: value }));
  };

  const iniciarEdicao = () => setEditando(true);

  const handleCancel = () => {
    setAluno(backupAluno);
    setEditando(false);
  };

  const handleDataStudent = async () => {
    setLoading(true);
    try {
      const paramsUrl = {
        action: "alterStudant",
        ...aluno,
      };

      console.log("handleDataStudent", paramsUrl);
      const response = await axios.get(apiUrl, { params: paramsUrl });
      console.log(response);
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
    } finally {
      setLoading(false);
      setEditando(false);
    }
  };

  return (
    <>
      <Divider className="col-span-12 !mt-10 text-sm font-semibold">
        {aluno.cargo}
      </Divider>

      <TextField
        fullWidth
        size="small"
        className="col-span-5"
        name="nome"
        value={aluno.nome}
        error={aluno.nome === "N/A"}
        label="Nome do Diretor"
        variant="outlined"
        autoFocus
        onChange={handleChange}
        disabled={!editando}
      />

      <TextField
        fullWidth
        size="small"
        className="col-span-5"
        name="cpf"
        label="CPF"
        value={aluno.cpf}
        error={aluno.cpf === "N/A"}
        variant="outlined"
        autoFocus
        onChange={handleChange}
        disabled={!editando}
      />

      <div className="h-full col-span-2 row-span-2 rounded-md shadow-sm shadow-black/30 flex items-center justify-center">
        <PersonIcon sx={{ fontSize: 50 }} />
        {/* <img
        src={aluno.url_foto}
        alt="Foto do aluno"
        className="object-cover object-top h-full col-span-2 row-span-2 rounded-md shadow-sm shadow-black/30"
      /> */}
      </div>

      <TextField
        fullWidth
        size="small"
        className="col-span-4"
        name="contato"
        label="Contato"
        value={aluno.contato}
        error={aluno.contato === "N/A"}
        variant="outlined"
        autoFocus
        onChange={handleChange}
        disabled={!editando}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <WhatsAppIcon
                className="text-green-600 cursor-pointer"
                sx={{ fontSize: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        size="small"
        className="col-span-3"
        name="serie"
        label="Série/Ano/Turma"
        value={aluno.serie}
        error={aluno.serie === "N/A"}
        variant="outlined"
        autoFocus
        onChange={handleChange}
        disabled={!editando}
      />

      <TextField
        fullWidth
        size="small"
        className="col-span-3"
        name="turno"
        label="Turno"
        value={aluno.turno}
        error={aluno.turno === "N/A"}
        variant="outlined"
        autoFocus
        onChange={handleChange}
        disabled={!editando}
      />

      <TextField
        fullWidth
        size="small"
        className="col-span-12"
        name="email"
        label="Email"
        value={aluno.email}
        error={aluno.email === "N/A"}
        variant="outlined"
        autoFocus
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
              size="small"
              variant="contained"
              color="primary"
              startIcon={loading ? <DataSaverOffIcon className="animate-spin" /> : <SaveIcon />}
              onClick={() => handleDataStudent()}
            >
              Salvar
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <Button
            size="small"
            variant="contained"
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
