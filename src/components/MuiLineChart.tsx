import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import moment from "moment";
import "moment/locale/pt-br";

interface SolicitationChartProps {
  timestamps: string[]; // Lista de timestamps
}

// Função para processar os timestamps e agrupar por mês
const processTimestamps = (timestamps: string[]) => {
  const counts: Record<string, number> = {};

  timestamps.forEach((timestamp) => {
    const monthYear = moment(timestamp).locale("pt-br").format("MMM-YY"); // Exemplo: "jun-24"
    counts[monthYear] = (counts[monthYear] || 0) + 1;
  });

  // Ordenar os meses corretamente
  const sortedEntries = Object.entries(counts).sort(
    ([a], [b]) => moment(a, "MMM-YY").valueOf() - moment(b, "MMM-YY").valueOf()
  );

  return {
    xLabels: sortedEntries.map(([month]) => month),
    yValues: sortedEntries.map(([, count]) => count),
  };
};

const SolicitationChart: React.FC<SolicitationChartProps> = ({
  timestamps,
}) => {
  const { xLabels, yValues } = processTimestamps(timestamps);

  return (
    <div className="w-full border  border-black/10 bg-blue-100/60 rounded-lg shadow-black/80 drop-shadow-lg">
      <LineChart
        xAxis={[{ scaleType: "band", data: xLabels }]} // Eixo X com meses formatados
        series={[
          {
            curve: "linear",
            data: yValues,
            label: "Solicitações",
            color: "#007BFF",
          },
        ]}
        height={200}
      />
    </div>
  );
};

export default SolicitationChart;
