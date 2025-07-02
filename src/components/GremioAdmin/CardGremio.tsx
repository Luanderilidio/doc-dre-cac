import {
  AppBar,
  Avatar,
  AvatarGroup,
  Button,
  Dialog,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useBoolean } from "react-hooks-shareable";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PlaceIcon from "@mui/icons-material/Place";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { faker } from "@faker-js/faker";
import CloseIcon from "@mui/icons-material/Close";
import { Gremio } from "./SchemaGremioAdmin";
import { Transition } from "../../utils/transition";
import FormsAddGremio from "./FormsAddGremio";
import { SetStateAction } from "react";
import FormsAddMember from "./FormsAddMember";
import moment from "moment/min/moment-with-locales";
import FormsAddProcessRedefinition from "./FormsAddProcessRedefinition";
moment.locale("pt-br");

type Props = {
  data: Gremio;
};

export default function CardGremio({ data }: Props) {
  const [isViewDialog, openViewDialog, closeViewDialog, toggleViewDialog] =
    useBoolean(false);

  return (
    <div className="shadow-md rounded-xl font-Inter">
      <div
        style={{
          backgroundImage: `url(${data.url_folder})`,
        }}
        className="!h-28 bg-cover w-full relative  rounded-t-xl"
      >
        <p className=" font-bold text-[0.7rem] text-white z-50 capitalize top-3  right-3 absolute bg-green-500 px-2 py-1 rounded-md">
          {data.status === true ? "Ativo" : "Inativo"}
        </p>
        <div className="text-[0.7rem] font-bold absolute bottom-2 text-white z-50 right-3">
          {moment(data.approval_date).format("MM/YY")} até {moment(data.validity_date).format("MM/YY")}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-b-lg" />
      </div>
      <div className="rounded-b-md border p-4 flex flex-col gap-3 bg-gray-200/30">
        <div className="flex items-center justify-start gap-2 text-[.7rem] font-bold">
          <h1 className="flex items-center justify-start">
            {" "}
            <PlaceIcon sx={{ fontSize: 13 }} /> {data.school.city}
          </h1>
          <h1 className="flex items-center justify-start gap-1">
            <HomeWorkIcon sx={{ fontSize: 13 }} /> {data.school.name}
          </h1>
        </div>
        <div className="w-full flex items-center justify-between">
          <h1 className="text-3xl font-bold">{data.name}</h1>
          {data.members && (
            <>
              <AvatarGroup max={3}>
                {data.members.map((member) => (
                  <Avatar alt="Remy Sharp" src={member.student.url_profile} />
                ))}
              </AvatarGroup>
            </>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={faker.image.avatar()}
              sx={{ width: 30, height: 30 }}
            />
            <div className="flex flex-col">
              <h1 className="text-xs font-semibold">
                {data.interlocutor.name.split(" ")[0]}
              </h1>
              <h1 className="text-[.6rem] font-semibold">
                {data.interlocutor.contact}
              </h1>
            </div>
          </div>
          <Button
            onClick={openViewDialog}
            size="small"
            startIcon={<RemoveRedEyeIcon />}
          >
            Administrar
          </Button>
        </div>
      </div>
      <Dialog
        fullScreen
        open={isViewDialog}
        onClose={closeViewDialog}
        TransitionComponent={Transition}
      >
        <AppBar position="static" className="mb-10">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Edite as informações do Grêmio
            </Typography>
            <IconButton aria-label="" onClick={toggleViewDialog}>
              <CloseIcon className="text-white" sx={{ fontSize: 30 }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className="grid grid-cols-13 gap-3 p-5">
          <div className="col-span-4 bg-gray-100/60 p-4 rounded-lg border ">
            <h1 className="font-bold text-xl mb-3">Edite os Dados do Grêmio</h1>
            <FormsAddGremio
              setIdGremio={function (_id: string): void {
                throw new Error("Function not implemented.");
              }}
              setViewFormsAddMembers={function (
                _value: SetStateAction<boolean>
              ): void {
                throw new Error("Function not implemented.");
              }}
              gremioEditData={data}
            />
          </div>
          <div className="col-span-5 bg-gray-100/60 p-4 rounded-lg border ">
            <h1 className="font-bold text-xl mb-3">
              Edite os membros do Grêmio
            </h1>
            <FormsAddMember gremio_id={data.id} />
          </div>
          <div className="col-span-4 ">
          
          <FormsAddProcessRedefinition gremio_id={data.id} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
