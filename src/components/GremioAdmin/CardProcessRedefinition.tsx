import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import CloseIcon from "@mui/icons-material/Close";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import { useEffect, useState } from "react";
import { ExpandMore } from "../../utils/colappse";
import {
  Collapse,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import {
  ProcessRedefinitionStages,
  ProcessRedefinitionWithStages,
  Stage,
} from "./SchemaGremioAdmin";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { generateShortId } from "../../utils/generate-id";
import moment from "moment";
import { useBoolean } from "react-hooks-shareable";
import FormsAddRedefinitionStages from "./FormsProcessRedefinitionStages";

type Props = {
  data?: ProcessRedefinitionWithStages;
};

const stagesBase = [
  {
    id: generateShortId(),
    order: 1,
    gremio_process_id: "123456",
    stage: "Comissão Pró-Grêmio",
    status: false,
    started_at: "2025-07-01T08:00:00.000Z",
    finished_at: "2025-07-01T12:00:00.000Z",
    observation: "Defina as datas",
    created_at: "2025-06-26T08:00:00.000Z",
    updated_at: "2025-06-30T08:00:00.000Z",
  },
  {
    id: generateShortId(),
    order: 2,
    gremio_process_id: "123456",
    stage: "Assembleia Geral",
    status: false,
    started_at: "2025-07-02T08:00:00.000Z",
    finished_at: "2025-07-02T12:00:00.000Z",
    observation: "Defina as datas",
    created_at: "2025-06-26T08:00:00.000Z",
    updated_at: "2025-06-30T08:00:00.000Z",
  },
  {
    id: generateShortId(),
    order: 3,
    gremio_process_id: "123456",
    stage: "Comissão Eleitoral",
    status: false,
    started_at: "2025-07-03T08:00:00.000Z",
    finished_at: "2025-07-03T12:00:00.000Z",
    observation: "Defina as datas",
    created_at: "2025-06-26T08:00:00.000Z",
    updated_at: "2025-06-30T08:00:00.000Z",
  },
  {
    id: generateShortId(),
    order: 4,
    gremio_process_id: "123456",
    stage: "Homologação das Chapas",
    status: false,
    started_at: "2025-07-04T08:00:00.000Z",
    finished_at: "2025-07-04T12:00:00.000Z",
    observation: "Defina as datas",
    created_at: "2025-06-26T08:00:00.000Z",
    updated_at: "2025-06-30T08:00:00.000Z",
  },
  {
    id: generateShortId(),
    order: 5,
    gremio_process_id: "123456",
    stage: "Campanha Eleitoral",
    status: false,
    started_at: "2025-07-05T08:00:00.000Z",
    finished_at: "2025-07-05T12:00:00.000Z",
    observation: "Defina as datas",
    created_at: "2025-06-26T08:00:00.000Z",
    updated_at: "2025-06-30T08:00:00.000Z",
  },
  {
    id: generateShortId(),
    order: 6,
    gremio_process_id: "123456",
    stage: "Votação",
    status: false,
    started_at: "2025-07-06T08:00:00.000Z",
    finished_at: "2025-07-06T12:00:00.000Z",
    observation: "Defina as datas",
    created_at: "2025-06-26T08:00:00.000Z",
    updated_at: "2025-06-30T08:00:00.000Z",
  },
  {
    id: generateShortId(),
    order: 7,
    gremio_process_id: "123456",
    stage: "Posse",
    status: false,
    started_at: "2025-07-07T08:00:00.000Z",
    finished_at: "2025-07-07T12:00:00.000Z",
    observation: "Defina as datas",
    created_at: "2025-06-26T08:00:00.000Z",
    updated_at: "2025-06-30T08:00:00.000Z",
  },
];

export default function CardProcessRedefinition({ data }: Props) {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;
  const [expanded, setExpanded] = useState(false);

  const [redefinitionStages, setRedefinitionStages] = useState<any[]>();
  const [redefinitionStage, setRedefinitionStage] =
    useState<ProcessRedefinitionStages>();
  const [stagesFromApi, setStagesFromApi] = useState<string[]>([]);
  const [isDialog, openDialog, closeDialog, toggleDialog] = useBoolean(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getProcessRefefinitionStages = async () => {
    console.log(data);
    try {
      const response = await axios.get<ProcessRedefinitionStages[]>(
        `${apiUrl}/gremio-process-redefinition-stages/${data?.id}`
      );

      const apiMapByStage = new Map(
        response.data.map((obj) => [obj.stage, obj])
      );

      const mergedArray = stagesBase.map((baseObj) => {
        const stageKey = baseObj.stage as Stage;
        const apiObj = apiMapByStage.get(stageKey);

        return {
          ...baseObj,
          ...(apiObj || {}),
          gremio_process_id: data?.id,
        };
      });

      // console.log(mergedArray);
      setRedefinitionStages(mergedArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProcessRefefinitionStages();
  }, []);

  return (
    <div className="p-4 rounded-lg bg-gray-300/30 border">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center justify-start gap-3">
          <h1 className="text-xl font-bold">{data?.observation}</h1>
          <p className="font-bold text-[0.7rem] text-white z-50 capitalize bg-green-500 px-2 py-1 rounded-md shadow-md">
            {data?.year}
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

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List>
          {redefinitionStages?.map(
            (stage: ProcessRedefinitionStages, index) => (
              <div>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <div
                      className={`font-bold text-3xl ${
                        stage.status ? "" : "text-red-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </ListItemAvatar>
                  <ListItemText
                    className={`${!stage.status && "opacity-45 "}`}
                    primary={<p className="font-bold">{stage.stage}</p>}
                    secondary={
                      <div className="">
                        <p className="">{stage.observation}</p>
                        {stage.status && (
                          <div className="flex items-center gap-1">
                            <InsertInvitationIcon sx={{ fontSize: 13 }} />
                            <p className="text-xs">
                              {moment(stage.started_at).format("MM/YY")} até{" "}
                              {moment(stage.finished_at).format("MM/YY")}
                            </p>
                          </div>
                        )}
                      </div>
                    }
                  />
                  <ListItemIcon className="flex items-center justify-end">
                    <IconButton
                      onClick={() => {
                        setRedefinitionStage(stage);
                        toggleDialog();
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            )
          )}
        </List>
      </Collapse>
      <Dialog open={isDialog} onClose={closeDialog}>
        <DialogTitle className="flex items-center justify-between">
          <IconButton className="invisible">
            <CloseIcon />
          </IconButton>
          {redefinitionStage?.stage}
          <IconButton onClick={closeDialog}>
            <CloseIcon color="error" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="flex flex-col gap-5">
          <DialogContentText>
            Escreva uma observação e defina as datas de começo e fim desse
            estágio.
          </DialogContentText>
          <FormsAddRedefinitionStages data={redefinitionStage!} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
