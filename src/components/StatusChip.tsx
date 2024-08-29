import { Chip } from "@mui/material";

// Definindo os tipos aceitos para o status
export type StatusType = "denied" | "finished" | "in_service" | "delivery" | "";

// Interface para tipar as props do componente
interface StatusChipProps {
  status: StatusType;
}

export default function StatusChip({ status }: StatusChipProps) {
  // Função para definir o chip de acordo com o status
  const statusColor = (status: StatusType) => {
    switch (status) {
      case "denied":
        return <Chip label="NEGADO" color="error" />;
      case "finished":
        return <Chip label="FINALIZADO" color="success" />;
      case "in_service":
        return <Chip label="EM ATENDIMENTO" color="primary" />;
      case "delivery":
        return <Chip label="DOCUMENTO LIBERADO" color="secondary" />;
      default:
        return <Chip label="SEM ATENDIMENTO" color="warning" />;
    }
  };

  return <>{statusColor(status)}</>;
}
