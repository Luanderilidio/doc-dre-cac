import { useEffect } from "react";
import axios from "axios";


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

    // const [data, setData] = useState<DataItem[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get<{ output: DataItem[] }>(
        "https://script.google.com/macros/s/AKfycbwPpSCjmeVJSY44k8iKaErp0AKuX4j7XTszeDPOfuNkWlAziF-hXav2TT1JDDLOAfxRag/exec",
        {
          params: {
            action: "get",
          },
        }
      );
      // console.log("API Response:", response.data.output);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return <div>Luander</div>;
}
