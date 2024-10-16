import { useEffect, useMemo, useState } from "react";
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
import { DataGrid, GridRenderCellParams, GridColDef } from "@mui/x-data-grid";
import BasicGauges from "../components/Gauge";
import GraficoEnviaram from "../components/Gauge";
import { Gauge, gaugeClasses } from "@mui/x-charts";

interface Arquivo {
  nome: string;
  link: string;
  tipo: string;
}

interface RelatorioMediacao {
  id: number;
  cidade: string;
  escola: string;
  mes: string;
  linkPasta: string;
  enviou: string;
  arquivos: Arquivo[];
}

export const escolas = [
  {
    id: 0,
    cidade: "CACERES",
    escolas: [
      {
        id: 0,
        nome: "EE 12 DE OUTUBRO",
      },
      {
        id: 1,
        nome: "EE ANA MARIA",
      },
      {
        id: 2,
        nome: "EE DEMETRIO",
      },
      {
        id: 3,
        nome: "EE FREI AMBROSIO",
      },
      {
        id: 4,
        nome: "EE JOAO FLORENTINO",
      },
      {
        id: 5,
        nome: "EE LEOPOLDO AMBROSIO",
      },
      {
        id: 6,
        nome: "EE MARIO MOTTA",
      },
      {
        id: 7,
        nome: "EE MILTON MARQUES",
      },
      {
        id: 8,
        nome: "EE ONZE DE MARCO",
      },
      {
        id: 9,
        nome: "EE SÃO LUIZ",
      },
      {
        id: 10,
        nome: "EE TIRADENTES",
      },
      {
        id: 11,
        nome: "EE UNIAO E FORCA",
      },
    ],
  },
  {
    id: 1,
    cidade: "ARAPUTANGA",
    escolas: [
      {
        id: 0,
        nome: "EE JOAO SATO",
      },
      {
        id: 1,
        nome: "EE NOSSA SENHORA",
      },
      {
        id: 2,
        nome: "EE TANCREDO NEVES",
      },
    ],
  },
  {
    id: 2,
    cidade: "CURVELANDIA",
    escolas: [
      {
        id: 0,
        nome: "EE BOA ESPERANCA",
      },
    ],
  },
  {
    id: 3,
    cidade: "GLORIA D'OESTE",
    escolas: [
      {
        id: 0,
        nome: "EE JOSE BEJO",
      },
      {
        id: 1,
        nome: "EE RUI BARBOSA",
      },
    ],
  },
  {
    id: 4,
    cidade: "INDIAVAI",
    escolas: [
      {
        id: 0,
        nome: "EE PAULINO MODESTO",
      },
    ],
  },
  {
    id: 5,
    cidade: "LAMBARI",
    escolas: [
      {
        id: 0,
        nome: "EE PADRE JOSE ANCHIETA",
      },
    ],
  },
  {
    id: 6,
    cidade: "MIRASSOL",
    escolas: [
      {
        id: 0,
        nome: "EE 12 DE OUTUBRO",
      },
      {
        id: 1,
        nome: "EE BOA VISTA",
      },
      {
        id: 2,
        nome: "EE JOAO DE CAMPOS WIDAL",
      },
      {
        id: 3,
        nome: "EE MADRE CRISTINA",
      },
      {
        id: 4,
        nome: "EE PADRE JOSE DE ANCHIETA",
      },
      {
        id: 5,
        nome: "EE PADRE TIAGO",
      },
      {
        id: 6,
        nome: "EE PEDRO GALHARDO",
      },
    ],
  },
  {
    id: 7,
    cidade: "PORTO ESPERIDIAO",
    escolas: [
      {
        id: 0,
        nome: "EE 13 DE MAIO",
      },
      {
        id: 1,
        nome: "EE INDIGENA CHIQUITANO",
      },
      {
        id: 2,
        nome: "EE INDIGENA JOSE TURIBIO",
      },
      {
        id: 3,
        nome: "EE SAO GERALDO",
      },
    ],
  },
  {
    id: 8,
    cidade: "QUATRO MARCOS",
    escolas: [
      {
        id: 0,
        nome: "EE 15 DE JUNHO",
      },
      {
        id: 1,
        nome: "EE BENTO ALEXANDRE",
      },
      {
        id: 2,
        nome: "EE BERTOLDO FREIRE",
      },
      {
        id: 3,
        nome: "EE LOURENÇO PERUCHI",
      },
      {
        id: 4,
        nome: "EE MIGUEL BARBOSA",
      },
      {
        id: 5,
        nome: "EE SANTA ROSA",
      },
    ],
  },
  {
    id: 9,
    cidade: "RESERVA DO CABACAL",
    escolas: [
      {
        id: 0,
        nome: "EE DEMETRIO PEREIRA",
      },
    ],
  },
  {
    id: 10,
    cidade: "RIO BRANCO",
    escolas: [
      {
        id: 0,
        nome: "EE RANGEL TORRES",
      },
    ],
  },
  {
    id: 11,
    cidade: "SALTO DO CEU",
    escolas: [
      {
        id: 0,
        nome: "EE FRANCISCO VILLANOVA",
      },
      {
        id: 1,
        nome: "EE VILA PROGRESSO",
      },
    ],
  },
];

const meses = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];


export default function Psicossocial() {
  const [data, setData] = useState<RelatorioMediacao[] | null>(null);
  const [cidade, setCidade] = useState(null);
  const [escola, setEscola] = useState(null);
  const [mes, setMes] = useState(null);
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [quantidade, setQuantidade] = useState(0)

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
        "https://script.google.com/macros/s/AKfycbypqdRvOEULH4_YrGWOQXbIRR5jCzIQkk083Fq3jwDCGLB0AbWmJwKN-PGN0F4PCaPfQA/exec",
        {
          params: {
            action: "GET",
            cidade: cidade,
            escola: escola,
            mes: mes,
          },
        }
      );
      setData(response.data);
      const quantidade2 = response.data?.filter(item => item.enviou === "Sim")
      console.log(quantidade2.length)
      setQuantidade(quantidade2.length)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      
    }
  };

  const cidades = useMemo(
    () => escolas.map((escola) => escola.cidade),
    [escolas]
  );

  const escolasFiltradas = useMemo(() => {
    if (cidade) {
      const cidadeEscolas = escolas.find((e) => e.cidade === cidade);
      console.log("cidadeEscolas", cidadeEscolas);
      const nomeEscolas = cidadeEscolas?.escolas.map((item) => item.nome);
      return nomeEscolas;
    }
    return [""];
  }, [cidade, escolas]);

  return (
    <div className="grid grid-cols-12 px-4 pt-5 gap-4">
      <p className="col-span-12 text-4xl font-bold flex items-center justify-center uppercase">Relatório Busca Ativa - Psicossocial</p>
      <div className="col-span-12">{loading && <LinearProgress />}</div>
      <div className="col-span-12 grid grid-cols-12 gap-5 bg-gray-100/60 p-4 rounded-2xl">
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

            console.log(cidade, escola, mes);
          }}
          className="col-span-3"
        >
          Procurar
        </Button>
      </div>

      <div className="col-span-7 h-[500px]">
        <DataGrid rows={data ?? []} columns={columns} />
        <div className="grid grid-cols-3 justify-between !h-[120px]">
          <p className="col-span-2 text-2xl font-bold font-Roboto text-black/80 flex items-center">
            Quantidade de escolas <br /> que enviaram
          </p>
          <div className="col-span-1">
            <Gauge
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
            />
          </div>
        </div>
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
      <div className="col-span-12 border-red-500">

      </div>
    </div>
  );
}
