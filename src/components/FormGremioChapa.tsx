import { useState } from "react";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Divider, InputAdornment, TextField, Button } from "@mui/material";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

interface FormGremioChapaProps {
  escola: string;
  nome_chapa: string;
  data_nomeacao: string;
  data_vigencia: string;
  link_plano_acao: string;
}

export default function FormGremioChapa({
  escola,
  nome_chapa,
  data_nomeacao,
  data_vigencia,
  link_plano_acao,
}: FormGremioChapaProps) {
  const apiUrl = import.meta.env.VITE_BACK_END_URL_GREMIOS as string;

  const [chapa, setChapa] = useState({
    escola: escola,
    chapa: nome_chapa,
    nomeacao: data_nomeacao,
    vigencia: data_vigencia,  
    plano: link_plano_acao,
  });

  const [backupChapa] = useState({ ...chapa });
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChapa((prev) => ({ ...prev, [name]: value }));
  };

  const iniciarEdicao = () => setEditando(true);

  const handleCancel = () => {
    setChapa(backupChapa);
    setEditando(false);
  };

  const handleDataTeacher = async () => {
    setLoading(true);
    try {
      const paramsUrl = {
        action: "alterChapa",
        ...chapa,
      };

      console.log("alterChapa", paramsUrl);
      const response = await axios.get(apiUrl, { params: paramsUrl });
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao atualizar Professor:", error);
    } finally {
      setLoading(false);
      setEditando(false);
    }
  };

  return (
    <>
      <Divider className="col-span-12 font-semibold ">
        Informações da Chapa
      </Divider>

      <TextField
        fullWidth
        className="col-span-12"
        size="small"
        name="chapa"
        label="Nome da Chapa"
        variant="outlined"
        error={chapa.chapa === "N/A"}
        value={chapa.chapa}
        onChange={handleChange}
        disabled={!editando}
      />

      <TextField
        fullWidth
        size="small"
        name="nomeacao"
        label="Nomeação"
        className="col-span-6"
        variant="outlined"
        error={chapa.nomeacao === "N/A"}
        value={chapa.nomeacao}
        onChange={handleChange}
        disabled={!editando}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EventAvailableIcon
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
        name="vigencia"
        label="Término da Vigência"
        className="col-span-6"
        variant="outlined"
        error={chapa.vigencia === "N/A"}
        value={chapa.vigencia}
        onChange={handleChange}
        disabled={!editando}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EventBusyIcon
                sx={{
                  fontSize: 20,
                  cursor: "pointer",
                  color: "red",
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        className="col-span-12"
        size="small"
        name="plano"
        label="Plano de Ação"
        variant="outlined"
        error={chapa.plano === "N/A"}
        value={chapa.plano}
        onChange={handleChange}
        disabled={!editando}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <ContentCopyIcon
                className="cursor-pointer hover:text-red-600"
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
