import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { ExpandMore } from "../utils/colappse";
import { Button, Chip, Collapse, Divider, TextField, Tooltip } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

type CardResponsiveProps = {
  columns: string;
  rows: string;
};

export default function CardResponsive() {
  const [openCard, setOpenCard] = useState(false);
  const [served, setServed] = useState(true)

  return (
    <div className="bg-orange-200 p-4 border-l-4 border-b-4 border-orange-800 rounded-xl shadow-md flex flex-col gap-3 font-Montserrat">
      <div className="flex items-center justify-between text-orange-900 gap-1 relative">
        <div className="flex items-center justify-center gap-2">
          <ApartmentIcon sx={{ fontSize: 15 }} />
          <h1 className="text-xs font-Inter font-bold leading-none">
            COGER - Coordenadoria de Gestão e Rede
          </h1>
        </div>
        <div className="text-xs flex flex-col items-center justify-center bg-orange-600 text-white p-[2px] rounded-sm shadow-sm absolute -top-1 right-0">
          <p className="text-[.7rem] leading-none">Prazo Final</p>
          <p className="font-black leading-none">12/03/2025</p>
        </div>
      </div>
      <h1 className="font-bold text-2xl text-orange-600  font-Montserrat leading-none mt-1">
        Texto super importante aqui
      </h1>
      <p className="leading-tight font-semibold text-orange-900">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius eveniet
        reprehenderit quae, quod aliquid tenetur
      </p>

      <div className="w-full flex items-center justify-between">
        <Button
          size="small"
          variant="outlined"
          target="_blank"
          rel="noopener noreferrer"
          href="https://forms.gle/Nv9pG311dFwXJjky5"
          startIcon={<LinkIcon />}
          onClick={() => setServed(false)}
        >
          Link do Formulário
        </Button>
        <Button size="small" disabled={served} variant="contained" color="success">
        
          Demanda Atendida
        </Button>
      </div>

      {/* <ExpandMore
        className="p-0"
        expand={openCard}
        onClick={() => setOpenCard(!openCard)}
      >
        <ExpandMoreIcon className="text-orange-600 p-0" />
      </ExpandMore>
      <Collapse
        in={openCard}
        timeout="auto"
        unmountOnExit
        className="font-Inter text-orange-800 "
      >
        <div className="flex flex-col gap-3">
          <div className="w-full flex justify-end">

          <Button variant="contained">Enviar</Button>
          </div>
        </div>
      </Collapse> */}
    </div>
  );
}
