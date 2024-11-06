import GaugeComponent from "react-gauge-component";
import { Button, Tooltip, Zoom } from "@mui/material";

interface ChartProgressProps {
  escola: string;
  enviou: string;
}

interface ChartProgressPropsComponent {
  data: ChartProgressProps[];
}

export default function ChartProgress({ data }: ChartProgressPropsComponent) {
  const qtdEnviou = data.filter((item) => item.enviou === "Sim");

  const sortedData = data.sort((a, b) => {
    if (a.enviou === "Sim" && b.enviou === "nao") return -1;
    if (a.enviou === "nao" && b.enviou === "Sim") return 1;
    return 0;
  });

  console.log("sortedData", sortedData);
  console.log("qtdEnviou", qtdEnviou.length);

  return (
    <div className="flex items-center justify-start w-full h-full">
      <div className="h-24 flex items-center justify-start gap-[6px]">
        {sortedData.map((item, index) => (
          <div className="h-14 !w-22" key={index}>
            <Tooltip
              title={item.escola}
              placement="top"
              TransitionComponent={Zoom}
              arrow
            >
              <Button
                variant="contained"
                size="small"
                className="h-14"
                color={item.enviou === "Sim" ? "success" : "error"} // Corrigido a comparação com "sim"
              >
                <p className="font-bold font-Montserrat text-[.6rem]">
                  {item.escola.slice(3).substring(0, 14)}
                </p>
              </Button>
            </Tooltip>

          </div>
        ))}
      </div>
      <div className="!w-[200px]">
        <GaugeComponent
          type="semicircle"
          arc={{
            colorArray: ["#FF2121", "#00FF15"],
            padding: 0.02,
            subArcs: [
              { limit: data.length * 0.4 },
              { limit: data.length * 0.6 },
              { limit: data.length * 0.8 },
            ],
          }}
          pointer={{ type: "arrow", animationDelay: 0 }}
          value={qtdEnviou.length}
          maxValue={data.length}
        />
      </div>
    </div>
  );
}
