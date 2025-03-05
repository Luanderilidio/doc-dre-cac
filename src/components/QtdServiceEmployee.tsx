import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

interface QtdServiceEmployeeProps {
    name: string;
    qtd: number;
}

export default function QtdServiceEmployee({name, qtd}: QtdServiceEmployeeProps) {
  return (
    <div className="flex flex-col items-center justify-evenly h-full border border-black/10 bg-gray-100/60 py-3 rounded-lg shadow-black/80 drop-shadow-lg ">
      <AssignmentIndIcon sx={{ fontSize: 60 }} className="text-4xl text-blue-800" />
      <h1 className="font-Inter font-light text-2xl">{name}</h1>
      <h1 className="text-6xl font-black">{qtd}</h1>
    </div>
  );
}
