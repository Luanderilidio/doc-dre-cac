import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import GremioCard, { GremioCardProps } from "../components/GremioCard";
import { useEffect, useState } from "react";
import axios from "axios";

// const gremio2: GremioCardProps = {
//   cidade: "Rio de Janeiro",
//   escola: "Colégio Novo Horizonte",
//   url_foto_escola:
//     "https://img.freepik.com/fotos-premium/exterior-da-casa_1048944-29403890.jpg?w=996",
//   nome_professor: "Ana Souza",
//   contato_professor: "21955553333",
//   email_professor: "contato@novohorizonte.com",
//   nome_chapa: "Chapa Revolução",
//   data_nomeacao: "2023-09-10",
//   data_vigencia: "2024-09-10",
//   link_plano_acao:
//     "https://drive.google.com/file/d/1nn7X_67ginqS1EUypq4P5oFxaPIC0jhC/view?usp=drive_link",
//   status: "Ativo",
//   alunos: [
//     {
//       url_foto:
//         "https://img.freepik.com/fotos-gratis/mulher-gravida-sorridente-segurando-uma-prancheta-e-apontando-para-cima_23-2148765096.jpg?t=st=1741899861~exp=1741903461~hmac=1edf453cd37ce901500316c9aa36b840270f44ebaee97f2648fc297712b6a7a5&w=740",
//       nome: "José Santos",
//       cargo: "Presidente",
//       cpf: "321.654.987-00",
//       contato: "21999998888",
//       serie: "3º ano",
//       turno: "Noturno",
//       email: "jose@email.com",
//     },
//     {
//       url_foto:
//         "https://img.freepik.com/fotos-gratis/mulher-gravida-sorridente-segurando-uma-prancheta-e-apontando-para-cima_23-2148765096.jpg?t=st=1741899861~exp=1741903461~hmac=1edf453cd37ce901500316c9aa36b840270f44ebaee97f2648fc297712b6a7a5&w=740",
//       nome: "Luiza Almeida",
//       cargo: "Secretária",
//       cpf: "654.321.987-00",
//       contato: "21988887777",
//       serie: "1º ano",
//       turno: "Matutino",
//       email: "luiza@email.com",
//     },
//   ],
// };

export default function Gremios() {
  const apiUrl = import.meta.env.VITE_BACK_END_URL_GREMIOS as string;

  const [data, setData] = useState<GremioCardProps[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get<GremioCardProps[]>(apiUrl, {
        params: { action: "get" },
      });

      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  return (
    <div className="w-full px-4 ">
      
      <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">{loading && <LinearProgress />}</div>
        <div className="col-span-12 mt-3">
          <p className="text-center text-blue-700 font-bold font-Anton col-span-12 text-5xl">
            PAINEL DE GESTÃO DOS GRÊMIOS - DRE CÁCERES
          </p>
        </div>
        <div className="col-span-12 border grid grid-cols-12 gap-5 mt-10 bg-gray-100/60 p-4 rounded-lg">
          <p className="col-span-12 font-bold">Filtros</p>
          <Autocomplete
            fullWidth
            className="col-span-2"
            disablePortal
            options={["Luamnder", "Brenda"]}
            renderInput={(params) => (
              <TextField {...params} label="Nome do Gremio" />
            )}
          />
          <FormControl fullWidth className="col-span-2">
            <InputLabel id="demo-simple-select-label">Cidade</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Cidade"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth className="col-span-2">
            <InputLabel>Status</InputLabel>
            <Select label="Cidade">
              <MenuItem value={10}>Em Vigência</MenuItem>
              <MenuItem value={12}>Sem Vigência</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            endIcon={<RefreshIcon />}
            className="col-span-3"
          >
            Atualizar
          </Button>
        </div>
        {data.map((item, index) => (
          <GremioCard
            key={index}
            cidade={item.cidade}
            escola={item.escola}
            url_foto_escola={item.url_foto_escola}
            nome_professor={item.nome_professor}
            contato_professor={item.contato_professor}
            email_professor={item.email_professor}
            nome_chapa={item.nome_chapa}
            data_nomeacao={item.data_nomeacao}
            data_vigencia={item.data_vigencia}
            link_plano_acao={item.link_plano_acao}
            status={item.status}
            alunos={item.alunos}
          />
        ))}
      </div>
    </div>
  );
}
