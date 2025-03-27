import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import { linearProgressClasses } from "@mui/material/LinearProgress";
import ClearIcon from "@mui/icons-material/Clear";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import api from "../services/api";
import SolicitationChart from "../components/MuiLineChart";
import QtdServiceEmployee from "../components/QtdServiceEmployee";
import CountEmployee from "../utils/countEmployee";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CardDocument, { CardDocumentProps } from "../components/CardDocument";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import { useBoolean } from "react-hooks-shareable";
import FormsDocument from "../components/FormsDocument";

export default function Admin() {
  const apiUrl = import.meta.env.VITE_BACK_END_URL as string;

  // Definindo os tipos dos estados
  const [data, setData] = useState<CardDocumentProps[]>([]);
  const [filteredData, setFilteredData] = useState<CardDocumentProps[]>([]);

  const [dataFinishedAndDenied, setDataFinishedAndDenied] = useState<
    CardDocumentProps[]
  >([]);

  const [nome, setNome] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [employee, setEmployee] = useState<string>("");
  const [documentType, setDocumetType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [isViewAdd, openViewAdd, closeViewAdd, toggleViewAdd] =
    useBoolean(false);

  const [statusCounts, setStatusCounts] = useState({
    no_service: 0,
    in_service: 0,
    delivery: 0,
    denied: 0,
    finished: 0,
  });

  const [documentTypeCounts, setDocumentTypeCounts] = useState({
    Histórico: 0,
    Atestado: 0,
    Certificado: 0,
    Declaração: 0,
  });

  const documentTypes = ["Histórico", "Certificado", "Declaração", "Atestado"];

  const fetchData = async () => {
    try {
      const response = await api.get<{ output: CardDocumentProps[] }>(apiUrl, {
        params: {
          action: "get",
          sheet: "DadosFormulario",
        },
      });

      console.log(response.data);
      setData(response.data.output);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData2 = async () => {
    try {
      const response = await api.get<{ output: CardDocumentProps[] }>(apiUrl, {
        params: {
          action: "deliveryAndDenied",
        },
      });

      console.log("fetchData2", response.data);
      setDataFinishedAndDenied(response.data.output);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading2(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  useEffect(() => {
    setLoading2(true);
    fetchData2();
  }, []);

  useEffect(() => {
    const combinedData = [...data, ...dataFinishedAndDenied];
    const filtro = combinedData.filter((item) => {
      return (
        (nome === null ||
          item.nomeCompleto.toLowerCase().includes(nome.toLowerCase())) &&
        (status === "" || item.status === status) &&
        (documentType === "" || item.tipoDocumento === documentType) &&
        (employee === "" || item.funcionario === employee)
      );
    });
    setFilteredData(filtro);
  }, [nome, status, documentType, employee, data]);

  const combinedData = [...data, ...dataFinishedAndDenied];

  useEffect(() => {
    const combinedData = [...data, ...dataFinishedAndDenied];
    // Contagem de status
    const statusCounts = combinedData.reduce(
      (acc: any, item: any) => {
        if (item.status in acc) {
          acc[item.status] += 1;
        }
        return acc;
      },
      { no_service: 0, in_service: 0, delivery: 0, denied: 0, finished: 0 }
    );

    // Contagem de tipoDocumento
    const documentCounts = combinedData.reduce(
      (acc: any, item: any) => {
        if (item.tipoDocumento in acc) {
          acc[item.tipoDocumento] += 1;
        }
        return acc;
      },
      { Histórico: 0, Atestado: 0, Certificado: 0, Declaração: 0 }
    );

    setStatusCounts(statusCounts);
    setDocumentTypeCounts(documentCounts);
  }, [loading2]);

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 20,
    borderRadius: 3,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[300],
      ...theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[100],
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "#1a90ff",
      ...theme.applyStyles("dark", {
        backgroundColor: "#308fe8",
      }),
    },
  }));

  const countEmployee = CountEmployee(combinedData);

  return (
    <>
      <div className="w-full px-4">
        <div className="col-span-12">{loading && <LinearProgress />}</div>
        <div className="grid grid-cols-12 gap-3 px-2 mt-5">
          <p className="text-center text-blue-700 font-bold font-Anton col-span-12 text-5xl">
            PAINEL DE SOLICITAÇÕES DE DOCUMENTOS - DRE CÁCERES
          </p>
          <div className="col-span-12 border grid grid-cols-12 gap-5 mt-10 bg-gray-100/60 p-4 rounded-lg">
            <p className="col-span-12 font-bold">Filtros</p>

            <Autocomplete
              className="col-span-3"
              fullWidth
              value={nome}
              options={data.map((item) => item.nomeCompleto)}
              onChange={(_event, newValue) => setNome(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Nome Aluno" />
              )}
            />

            <FormControl variant="outlined" className="col-span-2">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                label="Status"
              >
                <MenuItem value="in_service">Em Atendimento</MenuItem>
                <MenuItem value="no_service">Sem Atendimento</MenuItem>
                <MenuItem value="denied">Negado</MenuItem>
                <MenuItem value="finished">Finalizado</MenuItem>
                <MenuItem value="delivery">Liberado</MenuItem>
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

            <FormControl variant="outlined" className="col-span-2">
              <InputLabel>Funcionário</InputLabel>
              <Select
                value={employee}
                onChange={(event) => setEmployee(event.target.value)}
                label="Funcionário"
              >
                <MenuItem value="Luciano">Luciano</MenuItem>
                <MenuItem value="Carmelito">Carmelito</MenuItem>
                <MenuItem value="Graciane">Graciane</MenuItem>
              </Select>
              {employee && (
                <IconButton
                  size="small"
                  onClick={() => setEmployee("")}
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

            <FormControl variant="outlined" className="col-span-2">
              <InputLabel>Tipo de Documento</InputLabel>
              <Select
                value={documentType}
                onChange={(event) => setDocumetType(event.target.value)}
                label="Tipo de Documento"
              >
                {documentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {documentType && (
                <IconButton
                  size="small"
                  onClick={() => setDocumetType("")}
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

            <Button
              className="col-span-2"
              variant="outlined"
              color="primary"
              onClick={openViewAdd}
              startIcon={<AddCircleOutlineIcon sx={{ fontSize: 30 }} />}
            >
              Adicionar
            </Button>
          </div>

          <div className="col-span-12 grid grid-cols-15 gap-3">
            <div className="col-span-2 border border-black/10 bg-orange-100/60 p-4 rounded-lg shadow-black/80 drop-shadow-lg">
              <p className="font-semibold text-md">S/ Atendimento</p>
              <p className="text-5xl font-bold">{statusCounts.no_service}</p>
            </div>
            <div className="col-span-2 border border-black/10 bg-blue-100/60 py-4 pl-4 rounded-lg shadow-black/80 drop-shadow-lg">
              <p className="font-semibold text-lg">Em Atendimento</p>
              <p className="text-4xl font-bold">{statusCounts.in_service}</p>
            </div>
            <div className="col-span-2 border border-black/10 bg-violet-100/60 p-4 rounded-lg shadow-black/80 drop-shadow-lg">
              <p className="font-semibold text-xl">Liberados</p>
              <p className="text-4xl font-bold">{statusCounts.delivery}</p>
            </div>
            <div className="col-span-2 border border-black/10 bg-green-100/60 p-4 rounded-lg shadow-black/80 drop-shadow-lg">
              <p className="font-semibold text-xl">Finalizados</p>
              <p className="text-4xl font-bold">{statusCounts.finished}</p>
            </div>
            <div className="col-span-2 border border-black/10 bg-red-100/60 p-4 rounded-lg shadow-black/80 drop-shadow-lg">
              <p className="font-semibold text-xl">Negados</p>
              <p className="text-4xl font-bold">{statusCounts.denied}</p>
            </div>
            <div className="col-span-5  border border-black/10 bg-gray-100/60 p-2 rounded-lg shadow-black/80 drop-shadow-lg">
              <div className="grid grid-cols-12 gap-2 items-center justify-center ">
                <p className="col-span-3  border-red-500 font-semibold text-right">
                  Certificados
                </p>
                <div className="col-span-8 w-full border-red-500  ">
                  <BorderLinearProgress
                    variant="determinate"
                    value={documentTypeCounts.Certificado}
                  />
                </div>
                <p className="col-span-1 text-center  border-red-500 font-semibold">
                  {documentTypeCounts.Certificado}
                </p>
              </div>
              <div className="grid grid-cols-12 gap-2 items-center justify-center ">
                <p className="col-span-3  border-red-500 font-semibold text-right">
                  Históricos
                </p>
                <div className="col-span-8 w-full  border-red-500  ">
                  <BorderLinearProgress
                    variant="determinate"
                    value={documentTypeCounts.Histórico}
                  />
                </div>
                <p className="col-span-1 text-center  border-red-500 font-semibold">
                  {documentTypeCounts.Histórico}
                </p>
              </div>
              <div className="grid grid-cols-12 gap-2 items-center justify-center ">
                <p className="col-span-3  border-red-500 font-semibold text-right">
                  Declarações
                </p>
                <div className="col-span-8 w-full  border-red-500  ">
                  <BorderLinearProgress
                    variant="determinate"
                    value={documentTypeCounts.Declaração}
                  />
                </div>
                <p className="col-span-1 text-center  border-red-500 font-semibold">
                  {documentTypeCounts.Declaração}
                </p>
              </div>
              <div className="grid grid-cols-12 gap-2 items-center justify-center ">
                <p className="col-span-3  border-red-500 font-semibold text-right">
                  Atestados
                </p>
                <div className="col-span-8 w-full border-red-500  ">
                  <BorderLinearProgress
                    variant="determinate"
                    value={documentTypeCounts.Atestado}
                  />
                </div>
                <p className="col-span-1 text-center  border-red-500 font-semibold">
                  {documentTypeCounts.Atestado}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-6">
            <SolicitationChart
              timestamps={combinedData?.map((item) => item.timestamp)}
            />
          </div>
          <div className="col-span-6">
            <Swiper
              spaceBetween={10}
              slidesPerView={4}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              pagination={{ clickable: true }}
              className=" border-red-500 flex"
            >
              {countEmployee.map((item, index) => (
                <SwiperSlide key={index} className=" border-red-500">
                  <QtdServiceEmployee name={item.nome} qtd={item.quantidade} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="grid grid-cols-3 mt-10">
          {filteredData.length > 0 ? (
            filteredData.map((item: CardDocumentProps, index) => (
              <CardDocument key={index} {...item} />
            ))
          ) : (
            <div className="text-center col-span-3 text-4xl text-blue-600 font-extrabold font-Anton">
              Carregando Dados...
            </div>
          )}
        </div>
      </div>
      <Dialog open={isViewAdd} onClose={toggleViewAdd} fullWidth maxWidth="sm">
        <DialogTitle>
          <div className="w-full flex  items-center justify-between">
            <div />
            <p className="text-3xl">Adicionar nova Solicitação</p>
            <IconButton onClick={closeViewAdd}>
              <CloseIcon sx={{fontSize: 30}} />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className="w-full gap-2 py-2">
              <FormsDocument />
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
