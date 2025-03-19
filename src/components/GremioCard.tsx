import WarningIcon from "@mui/icons-material/Warning";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useBoolean } from "react-hooks-shareable";
import FormGremioAluno from "./FormGremioAluno";
import FormGremioProfessor from "./FormGremioProfessor";
import FormGremioChapa from "./FormGremioChapa";

export interface AlunosGremio {
  id: string;
  url_foto: string;
  nome: string;
  cargo: string;
  cpf: string;
  contato: string;
  serie: string;
  turno: string;
  email: string;
}

export interface GremioCardProps {
  cidade: string;
  escola: string;
  url_foto_escola: string;
  nome_professor: string;
  contato_professor: string;
  email_professor: string;
  nome_chapa: string;
  data_nomeacao: string;
  data_vigencia: string;
  link_plano_acao: string;
  status: string;
  alunos: AlunosGremio[];
}

export default function GremioCard({
  cidade,
  escola,
  nome_professor,
  contato_professor,
  email_professor,
  nome_chapa,
  data_nomeacao,
  data_vigencia,
  link_plano_acao,
  status,
  alunos,
}: GremioCardProps) {
  const [isView, openView, closeView, toggleView] = useBoolean(false);

  const qtdNAGremio =
    alunos.filter((aluno) => aluno.nome === "N/A").length == 11;

  return (
    <>
      <div className="col-span-4 bg-gray-100 rounded-b-lg shadow-black/30 shadow-md transition ease-in-out hover:scale-105 active:scale-95">
        <div className="relative">
          <div
            className={`px-2 py-1 flex items-center justify-center text-white absolute top-4 right-4 ${
              qtdNAGremio ? "bg-red-600" : "bg-green-600"
            } bg--600/60 rounded-md gap-1 transition ease-in-out hover:scale-105 active:scale-95 `}
          >
            {qtdNAGremio ? (
              <WarningAmberIcon sx={{ fontSize: 18 }} />
            ) : (
              <CheckCircleIcon />
            )}

            <p className="font-Inter font-bold text-xs text-[0.7rem] white">
              {qtdNAGremio ? "Inativo" : "Ativo"}
            </p>
          </div>

          <img
            src="https://img.freepik.com/fotos-premium/um-edificio-com-a-palavra-cafe-no-lado_913495-991.jpg?w=996"
            className="rounded-t-lg w-full object-cover h-36"
            alt=""
          />
        </div>
        <div className="flex flex-col p-4">
          <div className="flex flex-col items-start justify-start gap-3 font-Inter font-black leading-none text-gray-700/70 mt-2 text-xs   z-10">
            <h1 className=" ">
              {cidade} - {escola}
            </h1>
          </div>
          <h1 className="text-2xl font-bold font-inter text-gray-600 ">
            {nome_chapa.slice(0, 25)}
          </h1>
          <div className="w-full flex items-center justify-start  gap-3 mt-3">
            <div className="px-2 py-1 flex items-center justify-center text-white bg-green-600/60 rounded-md gap-1 transition ease-in-out hover:scale-105 active:scale-95">
              <EventAvailableIcon sx={{ fontSize: 18 }} />
              <p className="font-Inter font-bold text-xs text-[0.7rem] white">
                {data_nomeacao}
              </p>
            </div>
            <div className="px-2 py-1 flex items-center justify-center text-white bg-green-600/60 rounded-md gap-1 transition ease-in-out hover:scale-105 active:scale-95">
              <EventBusyIcon sx={{ fontSize: 18 }} />
              <p className="font-Inter font-bold text-xs text-[0.7rem] white">
                {data_vigencia}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 gap-3">
            <h1 className="text-gray-600 font-normal">
              Prof. Interlocutor{" "}
              <span className="font-bold"> {nome_professor.split(" ")[0]}</span>
            </h1>
            <button
              onClick={openView}
              className="px-2 py-2 text-white bg-orange-500 text-xs rounded-md font-bold font-Inter flex items-center transition ease-in-out hover:scale-105 active:scale-95"
            >
              <VisibilityIcon sx={{ fontSize: 20 }} /> VISUALIZAR
            </button>
          </div>
        </div>
      </div>

      <Dialog maxWidth="sm" fullWidth open={isView} onClose={closeView}>
        <DialogTitle>
          <p className="text-3xl text-center">{nome_chapa}</p>
        </DialogTitle>
        <DialogContent className="grid grid-cols-12  gap-3 !pt-2">
          <Divider className="col-span-12 !mt-4 text-sm font-semibold">
            Localização
          </Divider>
          <TextField
            fullWidth
            size="small"
            className="col-span-6"
            value={cidade}
            label="Cidade"
            variant="outlined"
            autoFocus
          />
          <TextField
            fullWidth
            size="small"
            className="col-span-6"
            value={escola}
            label="Escola"
            variant="outlined"
            autoFocus
          />
          <FormGremioProfessor
            contato_professor={contato_professor}
            email_professor={email_professor}
            nome_professor={nome_professor}
            escola={escola}
          />

          {/* <Divider className={`col-span-12 !mt-4 text-sm font-semibold`}>
            Informações da Chapa
          </Divider>
          <TextField
            fullWidth
            size="small"
            className="col-span-9"
            label="Nome da Chapa"
            value={nome_chapa}
            error={nome_chapa === "N/A"}
            variant="outlined"
            autoFocus
          />
          <Button
            className="col-span-3"
            variant="contained"
            color={qtdNAGremio ? "error" : "success"}
            startIcon={
              status === "Ativo" ? (
                <CheckCircleOutlineOutlinedIcon />
              ) : (
                <WarningIcon />
              )
            }
          >
            {status}
          </Button>
          <TextField
            fullWidth
            size="small"
            className="col-span-4"
            label="Data de Nomeação"
            value={data_nomeacao}
            error={data_nomeacao === "N/A"}
            variant="outlined"
            autoFocus
          />
          <TextField
            fullWidth
            size="small"
            className="col-span-4"
            label="Termino da Vigência"
            value={data_vigencia}
            error={data_vigencia === "N/A"}
            variant="outlined"
            autoFocus
          />
          <Button
            className="col-span-4"
            variant="contained"
            color={qtdNAGremio ? "error" : "primary"}
            startIcon={<PictureAsPdfOutlinedIcon />}
            onClick={() => window.open(`${link_plano_acao}`, "_blank")}
          >
            PLANO DE AÇÃO
          </Button> */}
          <FormGremioChapa
            data_nomeacao={data_nomeacao}
            data_vigencia={data_vigencia}
            escola={escola}
            nome_chapa={nome_chapa}
            link_plano_acao={link_plano_acao}
          />

          {alunos.map((aluno) => (
            <FormGremioAluno dadosAluno={aluno} />
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
