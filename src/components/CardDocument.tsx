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
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import moment from "moment";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import RefreshIcon from "@mui/icons-material/Refresh";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useBoolean } from "react-hooks-shareable";
import { useState } from "react";
import StatusChip from "./StatusChip";
import api from "../services/api";

// Tipagem para as props do componente
export interface CardDocumentProps {
  id: string;
  timestamp: string;
  nomeCompleto: string;
  nomeDaMae: string;
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
  motivo?: string;
}

interface StatusOrderParams {
  id: string;
  action: string;
  status: string;
  employee: string;
  reason: string;
}

export default function CardDocument({
  id,
  timestamp,
  nomeCompleto,
  nomeDaMae,
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
  motivo,
}: CardDocumentProps) {
  const apiUrl = import.meta.env.VITE_BACK_END_URL as string;

  const dataSolicitada = moment(timestamp);
  const hoje = moment();

  const betwenDays = hoje.diff(dataSolicitada, "days");

  const [isView, openView, closeView, toggleView] = useBoolean(false);

  const [loading, setLoanding] = useState(false);

  const [employee, setEmployee] = useState<string>(funcionario || "");
  const [reason, setReason] = useState<string>(motivo || "");
  const [statusOrder, setStatusOrder] = useState<string>(
    status || "no_service"
  );

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
  const handleStatusOrder = async (
    status: string,
    employee: string,
    reason: string
  ) => {
    try {
      const params: StatusOrderParams = {
        action: "status",
        status: status,
        employee: employee,
        reason: reason,
        id: id + 1,
      };

      console.log(id, status, employee, reason);
      const response = await api.get(apiUrl, { params });

      toggleView();
      setLoanding(false);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Função para extrair o ID de um arquivo do Google Drive
  const extractFileId = (url: string): string | null => {
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  function formatToNumbers(input: String) {
    if (typeof input !== "string") {
      // Converter outros tipos para string ou retornar vazio
      input = String(input || "");
    }
    return input.replace(/[^0-9]/g, "");
  }

  const formattedNumber = formatToNumbers(telefoneContato);

  const getStatusOrder = (statusOrder: string) => {
    switch (statusOrder) {
      case "no_service":
        return 0;
      case "in_service":
        return 1;
      case "delivery":
        return 2;
      case "finished":
        return 3;
      default:
        console.log("Ação desconhecida:");
        return null;
    }
  };

  return (
    <div className="col-span-3 md:col-span-1 font-Montserrat flex flex-col border rounded-lg p-4 shadow-black/30 drop-shadow-sm m-2">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold uppercase">
          {nomeCompleto.substring(0, 12)}...
        </p>
        <StatusChip status={status} />
      </div>
      <div className="flex items-center justify-between">
        <p className="w-8/12 text-md font-semibold lowercase leading-none">
          {nomeEscolaExtinta}
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
                className="col-span-2"
                value={nomeDaMae}
                label="Nome da Mãe"
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
              <Button
                onClick={() =>
                  window.open(
                    `https://api.whatsapp.com/send?phone=${formattedNumber}`,
                    "_blank"
                  )
                }
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
              >
                Avisar no Whatsapp
              </Button>

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
            <Divider className="col-span-2 !mt-4">
              Alterar Status da Solicitação
            </Divider>
            {statusOrder !== "denied" ? (
              <>
                <Stepper
                  className="my-7"
                  activeStep={getStatusOrder(statusOrder) || 0}
                  alternativeLabel
                >
                  <Step key={0}>
                    <StepLabel>
                      Documento sem <br /> Atendimento
                    </StepLabel>
                  </Step>
                  <Step key={1}>
                    <StepLabel>
                      Documento em <br /> Atendimento
                    </StepLabel>
                  </Step>
                  <Step key={2}>
                    <StepLabel>
                      Documento <br /> Liberado
                    </StepLabel>
                  </Step>
                  <Step key={3}>
                    <StepLabel>
                      Documento <br /> Finalizado{" "}
                    </StepLabel>
                  </Step>
                </Stepper>
              </>
            ) : (
              <>
                <Stepper
                  className="my-7"
                  activeStep={getStatusOrder(statusOrder) || 0}
                  alternativeLabel
                >
                  <Step key={0}>
                    <StepLabel>
                      Solicitação <br /> Negada
                    </StepLabel>
                  </Step>
                </Stepper>
              </>
            )}

            <div className="grid grid-cols-6 gap-2 py-2">
              <FormControl variant="outlined" className="col-span-3">
                <InputLabel>Funcionário</InputLabel>
                <Select
                  fullWidth
                  className="col-span-3"
                  value={employee}
                  onChange={(event) => setEmployee(event.target.value)}
                  label="Funcionário"
                >
                  <MenuItem value="Graciane">Graciane</MenuItem>
                  <MenuItem value="Carmelito">Carmelito</MenuItem>
                  <MenuItem value="Luander">Luander</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" className="col-span-3">
                <InputLabel>Status</InputLabel>
                <Select
                  fullWidth
                  value={statusOrder}
                  onChange={(event) => setStatusOrder(event.target.value)}
                  label="Status"
                >
                  <MenuItem value="in_service">Em Atendimento</MenuItem>
                  <MenuItem value="denied">Negado</MenuItem>
                  <MenuItem value="delivery">Liberado</MenuItem>
                  <MenuItem value="finished">Finalizado</MenuItem>
                </Select>
              </FormControl>
              {statusOrder === "denied" && (
                <TextField
                  className="col-span-6"
                  label="Motivo"
                  multiline
                  rows={2}
                  maxRows={4}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  defaultValue="escreva o motivo aqui"
                  variant="outlined"
                />
              )}
              <Button
                onClick={() => {
                  setLoanding(true);
                  handleStatusOrder(statusOrder, employee, reason);
                }}
                variant="contained"
                className="col-span-6"
              >
                {loading === true ? (
                  <>
                    Alterando <RefreshIcon className="animate-spin" />
                  </>
                ) : (
                  <>Alterar</>
                )}
              </Button>
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
