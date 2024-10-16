
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";



export default function GraficoEnviaram(enviaram: number) {
  return (
      <Gauge
      className="w-fit borer-2"
        value={enviaram}
        startAngle={-110}
        endAngle={110}
        valueMax={41}
        sx={{
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 20,
            transform: "translate(0px, 0px)",
          },
        }}
        text={({ value, valueMax }) => `${value} / ${valueMax}`}
      />
  );
}
