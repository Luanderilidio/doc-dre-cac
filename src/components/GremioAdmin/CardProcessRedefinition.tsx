import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { ExpandMore } from "../../utils/colappse";
import { CardContent, Collapse } from "@mui/material";
import { ProcessRedefinition } from "./SchemaGremioAdmin";

type Props = {
  data: ProcessRedefinition;
};

export default function CardProcessRedefinition({ data }: Props) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="p-4 rounded-lg bg-gray-300/30 border">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center justify-start gap-3">
          <h1 className="text-xl font-bold">{data.observation}</h1>
          <p className="font-bold text-[0.7rem] text-white z-50 capitalize bg-green-500 px-2 py-1 rounded-md shadow-md">
            {data.year}
          </p>
        </div>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </div>

      <Collapse in={expanded} timeout="auto" unmountOnExit></Collapse>
    </div>
  );
}
