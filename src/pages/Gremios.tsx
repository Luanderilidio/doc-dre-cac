import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import ClearIcon from "@mui/icons-material/Clear";
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
  const [filteredData, setFilteredData] = useState<GremioCardProps[]>([]);
  const [nome, setNome] = useState<string | null>(null);
  const [cidade, setCidade] = useState<string | null>(null);
  const [escola, setEscola] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<GremioCardProps[]>(apiUrl, {
        params: { action: "get" },
      });  
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

  useEffect(() => {
    const combinedData = [...data];
    const filtro = combinedData.filter((item) => {
      return (
        (nome === null ||
          item.nome_chapa.toLowerCase().includes(nome.toLowerCase())) &&
        (status === "" || item.status === status) &&
        (cidade === null ||
          item.cidade.toLowerCase().includes(cidade.toLowerCase())) &&
        (escola === null ||
          item.escola.toLowerCase().includes(escola.toLowerCase()))
      );
    });
    setFilteredData(filtro);
  }, [nome, cidade, status, escola, data]);

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
            className="col-span-3"
            fullWidth
            value={nome}
            options={[...new Set(data.map((item) => item.nome_chapa))]}
            onChange={(_event, newValue) => setNome(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Nome da Chapa" />
            )}
          />
          <Autocomplete
            className="col-span-2"
            fullWidth
            value={cidade}
            options={[...new Set(data.map((item) => item.cidade))]}
            onChange={(_event, newValue) => setCidade(newValue)}
            renderInput={(params) => <TextField {...params} label="Cidade" />}
          />
          <Autocomplete
            className="col-span-3"
            fullWidth
            value={escola}
            options={[...new Set(data.map((item) => item.escola))]}
            onChange={(_event, newValue) => setEscola(newValue)}
            renderInput={(params) => <TextField {...params} label="Escola" />}
          />
          <FormControl fullWidth className="col-span-2">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              label="Cidade"
            >
              <MenuItem value="ativo">Em Vigência</MenuItem>
              <MenuItem value="inativo">Sem Vigência</MenuItem>
            </Select>
            {status && (
              <IconButton
                size="small"
                onClick={() => setStatus("")}
                style={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </FormControl>
          <Button
            onClick={() => fetchData()}
            className="col-span-1"
            variant="contained"
            color="primary"
          >
            {loading ? (
              <DataSaverOffIcon className="animate-spin" />
            ) : (
              <RefreshIcon sx={{ fontSize: 30 }} />
            )}
          </Button>

          <Button className="col-span-1" variant="outlined" color="primary">
            <AddCircleOutlineIcon sx={{ fontSize: 30 }} />
          </Button>
        </div>
        {filteredData.map((item, index) => (
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
