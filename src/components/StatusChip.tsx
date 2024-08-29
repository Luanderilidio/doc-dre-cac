import { Chip } from "@mui/material";

// Defining the accepted types for status

// Interface to type the props for the component
interface StatusChipProps {
  status: string;
}

export default function StatusChip({ status }: StatusChipProps) {
  // Function to return the Chip based on the status
  const statusColor = (status: string) => {
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
