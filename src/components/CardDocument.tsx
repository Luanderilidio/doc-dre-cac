import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import moment from "moment";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useBoolean } from "react-hooks-shareable";
import { useState } from "react";
import StatusChip from "./StatusChip";
import api from "../services/api";

// Tipagem para as props do componente
export interface CardDocumentProps {
  id: string;
  timestamp: string;
  nomeCompleto: string;
  nomeEscolaExtinta: string;
  municipioEscolaExtinta: string;
  anoConclusao: string;
  modalidadeEnsino: string;
  modalidadeSolicitada: string;
  tipoDocumento: string;
  via: string;
  cpf: string;
  numeroRg: string;
  orgaoExpedidorRg: string;
  naturalidade: string;
  email: string;
  telefoneContato: string;
  rgFrenteVerso: string;
  comprovanteEndereco?: string;
  status: string;
  funcionario?: string;
}

export default function CardDocument({
  id,
  timestamp,
  nomeCompleto,
  nomeEscolaExtinta,
  municipioEscolaExtinta,
  anoConclusao,
  modalidadeEnsino,
  modalidadeSolicitada,
  tipoDocumento,
  via,
  cpf,
  numeroRg,
  orgaoExpedidorRg,
  naturalidade,
  email,
  telefoneContato,
  rgFrenteVerso,
  comprovanteEndereco,
  status,
  funcionario,
}: CardDocumentProps) {
  const apiUrl = import.meta.env.VITE_BACK_END_URL as string;

  const dataSolicitada = moment(timestamp);
  const hoje = moment();
  const betwenDays = hoje.diff(dataSolicitada, "days");

  const [isView, openView, closeView, toggleView] = useBoolean(false);

  const [isViewAccept, openViewAccept, closeViewAccept, toggleViewAccept] =
    useBoolean(false);
  const [isViewDenied, openViewDenied, closeViewDenied, toggleViewDenied] =
    useBoolean(false);

  const [employee, setEmployee] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  // Função para calcular a mensagem de diferença de dias
  const qtdDaysMessage = (): string => {
    if (betwenDays === 0) {
      return "Enviado Hoje";
    } else if (betwenDays === 1) {
      return "Enviado Ontem";
    } else {
      return `há ${betwenDays} dias atrás`;
    }
  };

  // Função para alterar o status para "Negado"
  const handleStatusDenied = async () => {
    try {
      const response = await api.get(apiUrl, {
        params: {
          action: "denied",
          id: id + 1,
          employee,
          reason,
        },
      });
      toggleViewDenied();
      toggleView();
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Função para alterar o status para "Finalizado"
  const handleStatusFinished = async () => {
    try {
      const response = await api.get(apiUrl, {
        params: {
          action: "finished",
          id: id + 1,
        },
      });
      toggleView();
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Função para alterar o status para "Em Atendimento"
  const handleStatusInService = async () => {
    try {
      const response = await api.get(apiUrl, {
        params: {
          action: "in_service",
          id: id + 1,
          employee,
        },
      });
      toggleViewAccept();
      closeView();
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Função para alterar o status para "Liberado"
  const handleStatusDelivery = async () => {
    try {
      const response = await api.get(apiUrl, {
        params: {
          action: "delivery",
          id: id + 1,
        },
      });
      console.log(response);
      toggleView();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Função para extrair o ID de um arquivo do Google Drive
  const extractFileId = (url: string): string | null => {
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="col-span-1 font-Montserrat flex flex-col border rounded-lg p-4 shadow-black/30 drop-shadow-sm m-2">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">{nomeCompleto.substring(0, 12)}...</p>
        <StatusChip status={status} />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-md font-semibold !capitalize">
          {nomeEscolaExtinta}{" "}
        </p>
        <p className="text-md font-semibold">{tipoDocumento}</p>
      </div>

      <div className="flex items-center justify-between">
        <p>{qtdDaysMessage()}</p>

        <Button onClick={openView} endIcon={<RemoveRedEyeIcon />}>
          Visualizar
        </Button>
      </div>
      {funcionario && (
        <p className="text-md text-blue-500 font-semibold">[{funcionario}]</p>
      )}
      <Dialog open={isView} onClose={closeView}>
        <DialogTitle>
          <p className="text-3xl">
            {tipoDocumento} para {nomeCompleto}
          </p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className="grid grid-cols-2 gap-2 py-2">
              <TextField
                size="small"
                className="col-span-2"
                value={nomeCompleto}
                label="Nome Completo"
                variant="outlined"
                autoFocus
              />
              <Divider className="col-span-2 !mt-4">
                Sobre o Documento Solicitado
              </Divider>
              <TextField
                size="small"
                className="col-span-1"
                defaultValue={nomeEscolaExtinta}
                label="Nome da Escola Extinta"
                variant="outlined"
                autoFocus
              />
              <TextField
                size="small"
                className="col-span-1"
                value={municipioEscolaExtinta}
                label="Município da Escola Extinta"
                variant="outlined"
                autoFocus
              />
              <TextField
                size="small"
                className="col-span-1"
                value={anoConclusao}
                label="Ano de Conclusão"
                variant="outlined"
                autoFocus
              />
              <TextField
                size="small"
                className="col-span-1"
                value={modalidadeEnsino}
                label="Modalidade de Ensino"
                variant="outlined"
                autoFocus
              />
              <TextField
                size="small"
                className="col-span-1"
                value={modalidadeSolicitada}
                label="Modalidade Solicitada"
                variant="outlined"
                autoFocus
              />
              <TextField
                size="small"
                className="col-span-1"
                value={tipoDocumento}
                label="Tipo de Documento"
                variant="outlined"
                autoFocus
              />
              <TextField
                size="small"
                className="col-span-1"
                value={via}
                label="Via"
                variant="outlined"
                autoFocus
              />
              <Divider className="col-span-2 !mt-4">Dados do Aluno</Divider>
              <TextField
                size="small"
                className="col-span-2"
                value={nomeCompleto}
                label="Nome Completo"
                variant="outlined"
                autoFocus
              />
              <TextField
                size="small"
                className="col-span-1"
                value={cpf}
                label="CPF"
                variant="outlined"
                autoFocus
              />
              <TextField
                size="small"
                className="col-span-1"
                value={numeroRg}
                label="Número do RG"
                variant="outlined"
                autoFocus
              />
              <TextField
                size="small"
                className="col-span-1"
                value={orgaoExpedidorRg}
                label="Órgão Expedidor do RG"
                variant="outlined"
                autoFocus
              />
              <TextField
                size="small"
                className="col-span-1"
                value={naturalidade}
                label="Naturalidade"
                variant="outlined"
                autoFocus
              />
              <TextField
                size="small"
                className="col-span-2"
                value={email}
                label="E-mail"
                variant="outlined"
                autoFocus
              />
              <TextField
                size="small"
                className="col-span-1"
                value={telefoneContato}
                label="Telefone para Contato"
                variant="outlined"
                autoFocus
              />

              {comprovanteEndereco && (
                <div className="col-span-2">
                  <Divider className="col-span-2 !mt-4">
                    Enderço do Aluno
                  </Divider>

                  <iframe
                    className="col-span-2 w-full h-60"
                    src={`https://drive.google.com/file/d/${extractFileId(
                      comprovanteEndereco
                    )}/preview`}
                    allow="autoplay"
                  />
                </div>
              )}
            </div>
            <Divider className="col-span-2 !mt-4">RG Frente e Verso</Divider>
            <iframe
              className="col-span-2 w-full h-60"
              src={`https://drive.google.com/file/d/${extractFileId(
                rgFrenteVerso
              )}/preview`}
              allow="autoplay"
            />
            <div className="grid grid-cols-2 gap-2 py-2">
              {status === "" && (
                <>
                  <Button
                    onClick={() => {
                      openViewAccept();
                      closeViewDenied();
                    }}
                    variant="contained"
                    className="col-span-1"
                  >
                    Atender
                  </Button>
                  <Button
                    onClick={() => {
                      openViewDenied();
                      closeViewAccept();
                    }}
                    variant="contained"
                    color="error"
                    className="col-span-1"
                  >
                    Negada
                  </Button>
                </>
              )}
              {status === "in_service" && (
                <>
                  <Divider className="col-span-2 !mt-4">
                    Liberar para Estudante buscar documento
                  </Divider>
                  <FormControl variant="outlined" className="col-span-2">
                    <InputLabel>Funcionario</InputLabel>
                    <Select
                      fullWidth
                      className="col-span-2"
                      value={employee}
                      onChange={(event) => setEmployee(event.target.value)}
                      label="Funcionário"
                    >
                      <MenuItem value="Luciano">Luciano</MenuItem>
                      <MenuItem value="Carmelito">Carmelito</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    className="col-span-2"
                    fullWidth
                    color="secondary"
                    variant="contained"
                    onClick={() => handleStatusDelivery()}
                  >
                    Enviar Email de Liberação
                  </Button>
                </>
              )}

              {status === "delivery" && (
                <>
                  <Divider className="col-span-2 !mt-4">
                    Finalizar Solicitação de Documento
                  </Divider>
                  <FormControl variant="outlined" className="col-span-1">
                    <InputLabel>Funcionario</InputLabel>
                    <Select
                      fullWidth
                      className="col-span-2"
                      value={employee}
                      onChange={(event) => setEmployee(event.target.value)}
                      label="Funcionário"
                    >
                      <MenuItem value="Luciano">Luciano</MenuItem>
                      <MenuItem value="Carmelito">Carmelito</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    className="col-span-1"
                    color="success"
                    variant="contained"
                    onClick={() => handleStatusFinished()}
                  >
                    Finalizar
                  </Button>
                </>
              )}

              {isViewAccept && (
                <>
                  <Divider className="col-span-2 !mt-4">
                    Atender essa solicitação
                  </Divider>
                  <FormControl variant="outlined" className="col-span-2">
                    <InputLabel>Funcionario</InputLabel>
                    <Select
                      fullWidth
                      className="col-span-2"
                      value={employee}
                      onChange={(event) => setEmployee(event.target.value)}
                      label="Funcionário"
                    >
                      <MenuItem value="Luciano">Luciano</MenuItem>
                      <MenuItem value="Carmelito">Carmelito</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    className="col-span-2"
                    fullWidth
                    variant="contained"
                    onClick={() => handleStatusInService()}
                  >
                    Atender
                  </Button>
                </>
              )}

              {isViewDenied && (
                <>
                  <Divider className="col-span-2 !mt-4">
                    Solicitalição de documento Negada
                  </Divider>

                  <TextField
                    className="col-span-2"
                    label="Motivo"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    multiline
                    rows={4}
                    defaultValue="escreva o motivo aqui"
                  />
                  <FormControl variant="outlined" className="col-span-1">
                    <InputLabel>Funcionario</InputLabel>
                    <Select
                      fullWidth
                      className="col-span-2"
                      value={employee}
                      onChange={(event) => setEmployee(event.target.value)}
                      label="Funcionário"
                    >
                      <MenuItem value="Luciano">Luciano</MenuItem>
                      <MenuItem value="Carmelito">Carmelito</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    className="col-span-1"
                    color="error"
                    variant="contained"
                    onClick={() => handleStatusDenied()}
                  >
                    Negado
                  </Button>
                </>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="info" onClick={toggleView}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
