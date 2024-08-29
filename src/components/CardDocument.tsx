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
import StatusChip, { StatusType } from "./StatusChip";
  
  // Tipagem para as props do componente
  export interface CardDocumentProps {
    id: number;
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
    comprovanteEndereco: string;
    status: StatusType;
  }
  
  export default function CardDocument({
    id,
    timestamp,
    nomeCompleto,
    nomeEscolaExtinta,
    tipoDocumento,
    rgFrenteVerso,
    comprovanteEndereco,
    status,
  }: CardDocumentProps) {
    const apiUrl = import.meta.env.VITE_BACK_END_URL as string;
  
    const dataSolicitada = moment(timestamp);
    const hoje = moment();
    const betwenDays = hoje.diff(dataSolicitada, "days");
  
    const [isView, openView, closeView, toggleView] = useBoolean(false);
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
        const response = await axios.get(apiUrl, {
          params: {
            action: "denied",
            id: id + 1,
            employee,
            reason,
          },
        });
        toggleView();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Função para alterar o status para "Finalizado"
    const handleStatusFinished = async () => {
      try {
        const response = await axios.get(apiUrl, {
          params: {
            action: "finished",
            id: id + 1,
          },
        });
        toggleView();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Função para alterar o status para "Em Atendimento"
    const handleStatusInService = async () => {
      try {
        const response = await axios.get(apiUrl, {
          params: {
            action: "in_service",
            id: id + 1,
            employee,
          },
        });
        toggleView();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Função para alterar o status para "Liberado"
    const handleStatusDelivery = async () => {
      try {
        const response = await axios.get(apiUrl, {
          params: {
            action: "delivery",
            id: id + 1,
          },
        });
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
          <p className="text-md font-semibold">{nomeEscolaExtinta}</p>
          <p className="text-md font-semibold">{tipoDocumento}</p>
        </div>
        <div className="flex items-center justify-between">
          <p>{qtdDaysMessage()}</p>
          <Button onClick={openView} endIcon={<RemoveRedEyeIcon />}>
            Visualizar
          </Button>
        </div>
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
                {/* Outras entradas de texto removidas para brevidade */}
                {comprovanteEndereco && (
                  <div className="col-span-2">
                    <Divider className="col-span-2 !mt-4">
                      Endereço do Aluno
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
                <Divider className="col-span-2 !mt-4">RG Frente e Verso</Divider>
                <iframe
                  className="col-span-2 w-full h-60"
                  src={`https://drive.google.com/file/d/${extractFileId(
                    rgFrenteVerso
                  )}/preview`}
                  allow="autoplay"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 py-2">
                {status === "in_service" && (
                  <>
                    <Divider className="col-span-2 !mt-4">
                      Liberar para Estudante buscar documento
                    </Divider>
                    <FormControl variant="outlined" className="col-span-2">
                      <InputLabel>Funcionário</InputLabel>
                      <Select
                        fullWidth
                        className="col-span-2"
                        value={employee}
                        onChange={(event) => setEmployee(event.target.value)}
                        label="Funcionário"
                      >
                        <MenuItem value="Funcionario1">Funcionário 1</MenuItem>
                        <MenuItem value="Funcionario2">Funcionário 2</MenuItem>
                        <MenuItem value="Funcionario3">Funcionário 3</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      className="col-span-2"
                      fullWidth
                      color="secondary"
                      variant="contained"
                      onClick={handleStatusDelivery}
                    >
                      Liberar
                    </Button>
                  </>
                )}
                {/* Outros controles de status removidos para brevidade */}
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
  