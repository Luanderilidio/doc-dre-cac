import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

export default function Contatos () {
  const series = [
    {
      data: [
        {
          x: "Department A",
          y: 10,
          children: [
            { x: "Team A1", y: 4 },
            { x: "Team A2", y: 3 },
            { x: "Team A3", y: 3 },
          ],
        },
        {
          x: "Department B",
          y: 20,
          children: [
            { x: "Team B1", y: 5 },
            { x: "Team B2", y: 7 },
            { x: "Team B3", y: 8 },
          ],
        },
        {
          x: "Department C",
          y: 15,
          children: [
            { x: "Team C1", y: 6 },
            { x: "Team C2", y: 5 },
            { x: "Team C3", y: 4 },
          ],
        },
      ],
    },
  ];

  const options = {
    chart: {
      type: "treemap",
    },
    title: {
      text: "Tree Chart Example",
    },
  } as ApexOptions;

  return (
    <div>
      <Chart options={options} series={series} type="treemap" height={350} />
    </div>
  );
};

