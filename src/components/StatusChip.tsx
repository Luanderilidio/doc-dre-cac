import { Chip } from "@mui/material";
import { useEffect, useState } from "react";

interface StatusChipProps {
  status: string;
}

export default function StatusChip({ status }: StatusChipProps) {
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      setIsMobile(window.innerWidth < 768); // Se a largura for menor que 768px, é mobile
    }, []);
  // Function to return the Chip based on the status
  const statusColor = (status: string) => {
    switch (status) {
      case "denied":
        return <Chip label="NEGADO" color="error" size={isMobile ? 'small' : 'medium'} />;
      case "finished":
        return <Chip label="FINALIZADO" color="success"  size={isMobile ? 'small' : 'medium'}/>;
      case "in_service":
        return <Chip label="EM ATENDIMENTO" color="primary"  size={isMobile ? 'small' : 'medium'}/>;
      case "delivery":
        return <Chip label="LIBERADO" color="secondary" size={isMobile ? 'small' : 'medium'} />;
      default:
        return <Chip label="SEM ATENDIMENTO" color="warning" size={isMobile ? 'small' : 'medium'} />;
    }
  };

  return <>{statusColor(status)}</>;
}
