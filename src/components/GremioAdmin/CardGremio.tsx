import {
  AppBar,
  Avatar,
  AvatarGroup,
  Button,
  Dialog,
  Divider,
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
import {  GremioWithMember } from "./SchemaGremioAdmin";
import { Transition } from "../../utils/transition"; 
import moment from "moment/min/moment-with-locales";
import FormsAddProcessRedefinition from "./FormsAddProcessRedefinition"; 
import FormGremio from "./Forms/FormGremio";
import FormMember from "./Forms/FormMember";
import CardMemberGremio from "./CardMemberGremio";
import { useAllMembersGremioWithStudentsByGremioId } from "../../services/MemberGremio";
moment.locale("pt-br");

type Props = {
  initialDate: GremioWithMember;
};

export default function CardGremio({ initialDate }: Props) {
  const [isViewDialog, openViewDialog, closeViewDialog, toggleViewDialog] =
    useBoolean(false);

  const { data: members } = useAllMembersGremioWithStudentsByGremioId(
    initialDate.id
  );

  return (
    <div className="shadow-md rounded-xl font-Inter ">
      <div
        style={{
          backgroundImage: `url(${initialDate.url_folder})`,
        }}
        className="!h-28 bg-cover w-full relative  !rounded-t-xl"
      >
        <p className=" font-bold text-[0.7rem] text-white z-50 capitalize top-3  right-3 absolute bg-green-500 px-2 py-1 rounded-md">
          {initialDate.status === true ? "Ativo" : "Inativo"}
        </p>
        <div className="text-[0.7rem] font-bold absolute bottom-2 text-white z-50 right-3">
          {moment(initialDate.approval_date).format("MM/YY")} até{" "}
          {moment(initialDate.validity_date).format("MM/YY")}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-lg" />
      </div>
      <div className="rounded-b-md h-48 border p-4 flex flex-col justify-around gap-3 bg-gray-200/30">
        <div className="flex items-center justify-start gap-2 text-[.6rem] font-bold   h-10">
          <h1 className="flex items-center justify-start whitespace-nowrap overflow-hidden text-ellipsis">
            <PlaceIcon sx={{ fontSize: 13 }} /> {initialDate.school.city}
          </h1>
          <h1 className="flex items-center justify-start gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
            <HomeWorkIcon sx={{ fontSize: 13 }} />{" "}
            {initialDate.school.name.slice(0, 25)}
          </h1>
        </div>
        <div className="w-full flex items-start justify-start h-40">
          <h1 className="text-2xl font-bold leading-none">{initialDate.name}</h1>
          {/* {initialDate.members && (
            <>
              <AvatarGroup max={3}>
                {initialDate.members.map((member) => (
                  <Avatar alt="Remy Sharp" src={member.student.url_profile} />
                ))}
              </AvatarGroup>
            </>
          )} */}
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
                {initialDate.interlocutor.name.split(" ")[0]}
              </h1>
              <h1 className="text-[.6rem] font-semibold">
                {initialDate.interlocutor.contact}
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
        className=""
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
        <div className="grid grid-cols-13 gap-3 p-5 !h-full overflow-y-auto">
          <div className="col-span-4 bg-gray-100/60 p-4 rounded-lg border ">
            <h1 className="font-bold text-xl mb-3">Edite os Dados do Grêmio</h1>
            <FormGremio gremio_id={initialDate.id} initialDate={initialDate} />
          </div>
          <div className="col-span-5 bg-gray-100/60 p-4 rounded-lg border ">
            <h1 className="font-bold text-xl mb-3">
              Edite os membros do Grêmio
            </h1>
            <FormMember gremio_id={initialDate.id} />
            <CardMemberGremio gremio_id={initialDate.id} />
          </div>
          <div className="col-span-4 ">
            <div className="flex flex-col gap-3 bg-gray-300/30 rounded-xl  p-4  h-fit">
              <h1 className="font-bold text-xl">Cadastre um novo processo</h1>
              <FormsAddProcessRedefinition gremio_id={initialDate.id} />
            </div>

            {/* <ListProcessRedefinition gremio_id={data.id} /> */}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
