import { useEffect } from "react";
import axios from "axios";
import ChartProgress from "../components/ChartProgress";


export interface DataItem {
    id: string;
    timestamp:string;
    nomeCompleto: string;
    nomeEscolaExtinta:string;
    tipoDocumento: string;
    status: string;
    funcionario:string;
  }
export default function Home() {

  return <div>

    {/* <ChartProgress /> */}
  </div>;
}
