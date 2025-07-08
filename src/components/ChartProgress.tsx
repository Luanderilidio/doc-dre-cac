import { Tooltip, Zoom } from "@mui/material";

interface ChartProgressProps {
  escola: string;
  enviou: string;
  cidade: string;
}

interface ChartProgressPropsComponent {
  data: ChartProgressProps[];
}

export default function ChartProgress({ data }: ChartProgressPropsComponent) {
  const qtdEnviou = data.filter((item) => item.enviou === "Sim");

  const sortedData = data.sort((a, b) => {
    if (a.enviou === "Sim" && b.enviou === "nao") return 1;
    if (a.enviou === "nao" && b.enviou === "Sim") return -1;
    return 0;
  }); 
 

  return (
    <div className="">
      <div className="h-full flex flex-col items-end justify-end gap-[4px] mx-[4px]">
        <p className="text-xs font-bold font-Montserrat text-center w-full">
          {qtdEnviou.length} / {data.length}{" "}
        </p>
        {sortedData.map((item, index) => (
          <div
            className={`transition ease-in-out cursor-pointer w-full rounded-sm px-1 ${
              item.enviou === "Sim"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
            key={index}
          >
            <Tooltip
              title={item.escola}
              placement="top"
              TransitionComponent={Zoom}
              arrow
            >
              <p className="font-bold font-Montserrat text-[.6rem] text-white text-nowrap text-center leading-none py-1 ">
                {item.escola.slice(3).substring(0, 14)}
              </p>
            </Tooltip>
          </div>
        ))}
      </div>

      <p className="text-[.5rem] border-t-[1px] mt-[2px] border-black/30 font-semibold font-Montserrat text-center w-full flex flex-col items-center justify-center">
      <div className="h-[5px] w-[1px] bg-black/30" />
        {data[0].cidade}
      </p>
    </div>
  );
}
