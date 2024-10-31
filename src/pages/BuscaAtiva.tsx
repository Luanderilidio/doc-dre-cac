import { useMemo, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import {
  Autocomplete,
  Button,
  IconButton,
  LinearProgress,
  TextField,
  Tooltip,
  Zoom,
} from "@mui/material";
import axios from "axios";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { Gauge } from "@mui/x-charts";
import ChartsOverviewDemo from "../components/barChartMediacao";
import { escolas, meses } from "../utils/data_select";

interface Arquivo {
  nome: string;
  link: string;
  tipo: string;
}

export interface RelatorioMediacao {
  id: number;
  cidade: string;
  escola: string;
  mes: string;
  linkPasta: string;
  enviou: string;
  arquivos: Arquivo[];
}

export default function BuscaAtiva() {
  const [data, setData] = useState<RelatorioMediacao[] | null>(null);
  const [cidade, setCidade] = useState(null);
  const [escola, setEscola] = useState(null);
  const [mes, setMes] = useState(null);
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [quantidade, setQuantidade] = useState(0);

  const columns = [
    { field: "cidade", headerName: "Cidade", width: 150 },
    { field: "escola", headerName: "Escola", width: 200 },
    { field: "mes", headerName: "Mês", width: 100 },
    {
      field: "linkPasta",
      headerName: "Pasta",
      width: 80,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          <IconButton>
            <FolderCopyIcon />
          </IconButton>
        </a>
      ),
    },
    {
      field: "arquivos",
      headerName: "Arquivos",
      width: 300,
      renderCell: (
        params: GridRenderCellParams<
          any,
          { nome: string; link: string; tipo: string }[]
        >
      ) => (
        <div className="flex gap-4">
          {params.value?.map((arquivo, index) => (
            <Tooltip
              key={index} // Adicione uma key para cada item do array
              title={arquivo.nome}
              placement="top"
              TransitionComponent={Zoom}
              arrow
            >
              <IconButton onClick={() => setUrl(arquivo.link)}>
                {arquivo.tipo === "DOCX" && <TextSnippetIcon />}
                {arquivo.tipo === "PDF" && <PictureAsPdfIcon />}
              </IconButton>
            </Tooltip>
          ))}
        </div>
      ),
    },
  ];

  const extractFileId = (url: string): string | null => {
    // Para URLs de Google Docs (documentos)
    const docsMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);

    // Para URLs de arquivos no Google Drive (PDFs, etc.)
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);

    // Retorna o ID encontrado
    if (docsMatch) {
      return docsMatch[1];
    } else if (driveMatch) {
      return driveMatch[1];
    }

    return null; // Caso não encontre um ID válido
  };

  const fetchData = async () => {
    try {
      const response = await axios.get<RelatorioMediacao[]>(
        "https://script.google.com/macros/s/AKfycbwkX7hY-xi7631UhFlUsqRUrTgP2ShZzvZErk1ot4TaMvHHVWXbzMY64zUeK9zi0gZU/exec",
        {
          params: {
            action: "getAll",
            cidade: cidade,
            escola: escola,
            mes: mes,
          },
        }
      );
      setData(response.data);
      // console.log(response.data);
      const quantidade2 = response.data?.filter(
        (item) => item.enviou === "Sim"
      );
      // console.log(quantidade2.length);
      setQuantidade(quantidade2.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  // console.log(data);

  const cidades = useMemo(
    () => escolas.map((escola) => escola.cidade),
    [escolas]
  );

  const escolasFiltradas = useMemo(() => {
    if (cidade) {
      const cidadeEscolas = escolas.find((e) => e.cidade === cidade);
      // console.log("cidadeEscolas", cidadeEscolas);
      const nomeEscolas = cidadeEscolas?.escolas.map((item) => item.nome);
      return nomeEscolas;
    }
    return [""];
  }, [cidade, escolas]);

  const cidadesUnicas = new Set(data?.map((row) => row.cidade));
  const escolasUnicas = new Set(data?.map((row) => row.escola));

  const contagemEnvios = data?.reduce(
    (acc, curr) => {
      if (curr.enviou === "Sim") {
        acc.enviaram += 1;
      } else if (curr.enviou === "Não") {
        acc.naoEnviaram += 1;
      }
      return acc;
    },
    { enviaram: 0, naoEnviaram: 0 } // Valores iniciais do acumulador
  );

  // A quantidade de cidades únicas
  const quantidadeCidades = cidadesUnicas.size;
  const quantidadeEscolas = escolasUnicas.size;

  return (
    <div className="grid grid-cols-12 px-4 pt-5 gap-4 ">
      <p className="text-center col-span-12 text-blue-700 font-bold font-Anton text-5xl">
        PAINEL BUSCA ATIVA - DRE CÁCERES
      </p>
      <div className="col-span-12">{loading && <LinearProgress />}</div>
      <div className="col-span-12 grid grid-cols-12 gap-5 border border-black/10 bg-gray-100/60 p-4 rounded-2xl shadow-black/80 drop-shadow-lg">
        <Autocomplete
          className="col-span-3"
          fullWidth
          value={cidade}
          options={cidades}
          onChange={(_event, newValue: any) => setCidade(newValue)}
          renderInput={(params) => <TextField {...params} label="Cidade" />}
        />

        {/* AutoComplete para Escola */}
        <Autocomplete
          className="col-span-3"
          fullWidth
          value={escola} // Agora é o objeto da escola, não apenas o nome
          options={escolasFiltradas || []} // Lista de escolas filtrada pela cidade
          onChange={(_event, newValue: any) => setEscola(newValue)} // Armazena o objeto completo da escola
          renderInput={(params) => <TextField {...params} label="Escola" />}
        />

        {/* AutoComplete para Mês */}
        <Autocomplete
          className="col-span-3"
          fullWidth
          value={mes}
          options={meses}
          onChange={(_event, newValue: any) => setMes(newValue)}
          renderInput={(params) => <TextField {...params} label="Mês" />}
        />

        <Button
          variant="outlined"
          endIcon={<RefreshIcon />}
          onClick={() => {
            setLoading(true);
            fetchData();

            // console.log(cidade, escola, mes);
          }}
          className="col-span-3"
        >
          PESQUISAR
        </Button>
      </div>
      <div className="col-span-2 border border-black/10 bg-gray-100/60 p-4 rounded-2xl shadow-black/80 drop-shadow-lg">
        <p className="font-semibold">Cidades</p>
        <p className="text-3xl font-bold">{quantidadeCidades}</p>
      </div>
      <div className="col-span-2 border border-black/10 bg-gray-100/60 p-4 rounded-2xl shadow-black/80 drop-shadow-lg">
        <p className="font-semibold">Escolas</p>
        <p className="text-3xl font-bold">{quantidadeEscolas}</p>
      </div>
      <div className="col-span-2 border border-black/10 bg-gray-100/60 p-4 rounded-2xl shadow-black/80 drop-shadow-lg">
        <p className="font-semibold">Mês</p>
        <p className="text-3xl font-bold">{data ? mes : "N/D"}</p>
      </div>
      <div className="col-span-2 border border-black/10 bg-gray-100/60 p-4 rounded-2xl shadow-black/80 drop-shadow-lg">
        <p className="font-semibold">Enviaram</p>
        <p className="text-3xl font-bold">
          {data ? contagemEnvios?.enviaram : 0}
        </p>
      </div>
      <div className="col-span-2 border border-black/10 bg-gray-100/60 p-4 rounded-2xl shadow-black/80 drop-shadow-lg">
        <p className="font-semibold">Não Enviaram</p>
        <p className="text-3xl font-bold">
          {data ? contagemEnvios?.naoEnviaram : 0}
        </p>
      </div>
      <div className="col-span-2 border border-black/10 bg-gray-100/60 p-4 rounded-2xl shadow-black/80 drop-shadow-lg">
        {/* <Gauge
          className="w-fit borer-2"
          value={quantidade}
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
        /> */}
         <Gauge value={quantidade} valueMax={41} startAngle={-90} endAngle={90} text={({ value, valueMax }) => `${value} / ${valueMax}`} />
      </div>

      <div className="col-span-7 h-[500px]">
        <DataGrid
          rows={data ?? []}
          columns={columns}
          getRowId={() => Math.random().toString(36).substr(2, 9)}
          getRowClassName={
            (params) =>
              params.row.enviou === "Sim"
                ? "text-green-500  hover:bg-green-700" // Classe Tailwind para fundo verde claro e texto verde escuro
                : "text-red-500 font-bold hover:bg-red-700" // Classe Tailwind para fundo vermelho claro e texto vermelho escuro
          }
        />
        
      </div>
      <div className="col-span-5 pr-4 bg-gray-100/60 p-4 rounded-2xl">
        {url && (
          <div>
            <p className="text-2xl font-Roboto font-semibold mb-4">
              Visualização do Documento
            </p>
            <iframe
              className="col-span-2 w-full !h-[500px]"
              src={`https://drive.google.com/file/d/${extractFileId(
                url
              )}/preview`}
              // src={`https://drive.google.com/file/d/1wJON_dNpneJX2NEI_o8pCiXqcdnhzyrM/preview`}
              allow="autoplay"
            />
          </div>
        )}
      </div>
      <div className="col-span-12">
        <ChartsOverviewDemo data={data ?? []} />
      </div>
    </div>
  );
}
