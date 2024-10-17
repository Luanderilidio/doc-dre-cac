import { BarChart } from '@mui/x-charts/BarChart';
import { RelatorioMediacao } from '../pages/Psicossocial';

interface Props {
  data: RelatorioMediacao[];
}

export default function ChartsOverviewDemo({ data }: Props) {


 console.log(data)
    
  // Processa os dados para contar quantas escolas enviaram por cidade
  const escolaPorCidade = data.reduce<Record<string, number>>((acc, curr) => {
    if (curr.enviou === "Sim") {
      acc[curr.cidade] = (acc[curr.cidade] || 0) + 1;
    }
    return acc;
  }, {});
  
  const cidades = Object.keys(escolaPorCidade);

  const quantidades = Object.values(escolaPorCidade);

console.log(data)
console.log("escolaPorCidade",escolaPorCidade)
console.log("quantidades", quantidades)
console.log("cidades", cidades)



  return (
    <BarChart
      series={[
        { data: quantidades, label: 'Enviaram', stack: 'total' },
      ]}
      barLabel="value"
      height={290}
      xAxis={[{ data: cidades, label: "Cidades", scaleType: 'band' }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
}
