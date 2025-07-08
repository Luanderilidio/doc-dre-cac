import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import { linearProgressClasses } from "@mui/material/LinearProgress";
import ClearIcon from "@mui/icons-material/Clear";
import { Swiper, SwiperSlide } from "swiper/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import {
  Autocomplete,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
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
import GradientText from "../components/reactbits/GradientText";
import { ExpandMore } from "../utils/colappse";

export default function Arquivo() {
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
  const [openFilter, setOpenFilter] = useState(false);
  const [openDashboard, setOpenDashboard] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    setIsMobile(window.innerWidth < 768); // Se a largura for menor que 768px, é mobile
  }, []);

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
        <div className="grid grid-cols-12 gap-3  mt-5">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#ff5608", "#4079ff", "#7940ff"]}
            animationSpeed={3}
            showBorder={false}
            className="text-center font-bold font-Anton col-span-12 text-3xl md:text-5xl"
          >
            PAINEL DE SOLICITAÇÕES DE DOCUMENTOS - DRE CÁCERES
          </GradientText>
          <div className="col-span-12 mt-5 md:mt-10 bg-gray-100/60 p-4 rounded-lg border">
            <div className="flex justify-between items-center md:mb-3">
              <p className="col-span-12 font-bold">Filtros</p>
              <div className="block md:hidden">
                <ExpandMore
                  expand={openFilter}
                  onClick={() => setOpenFilter(!openFilter)}
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </div>
            </div>
            <Collapse
              in={isMobile ? openFilter : true}
              timeout="auto"
              unmountOnExit
            >
              <div className="grid grid-cols-12 gap-2 md:gap-2  ">
                <Autocomplete
                  className="col-span-12 md:col-span-3"
                  fullWidth
                  value={nome}
                  options={data.map((item) => item.nomeCompleto)}
                  onChange={(_event, newValue) => setNome(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Nome Aluno" />
                  )}
                />

                <FormControl
                  variant="outlined"
                  className="col-span-6 md:col-span-2"
                >
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

                <FormControl
                  variant="outlined"
                  className="col-span-6 md:col-span-2"
                >
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

                <FormControl
                  variant="outlined"
                  className="col-span-6 md:col-span-2"
                >
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
                  className="col-span-3 md:col-span-1"
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
                  className="col-span-3 md:col-span-2"
                  variant="outlined"
                  color="primary"
                  onClick={openViewAdd}
                >
                  <div className="flex items-center justify-evenly gap-0 md:gap-3">
                    <AddCircleOutlineIcon sx={{ fontSize: 30 }} />
                    <p className="hidden md:block">Adicionar</p>
                  </div>
                </Button>
              </div>
            </Collapse>
          </div>

          <div className="col-span-12 bg-gray-100/60 p-4 rounded-lg border">
            <div className="flex justify-between items-center md:mb-3">
              <p className="font-bold">Dashboard</p>
              <div className="block md:hidden">
                <ExpandMore
                  expand={openDashboard}
                  onClick={() => setOpenDashboard(!openDashboard)}
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </div>
            </div>
            <Collapse
              in={isMobile ? openDashboard : true}
              timeout="auto"
              unmountOnExit
            >
              <div className="w-full grid grid-cols-12 md:grid-cols-15 gap-3">
                <div className="col-span-6 md:col-span-2 flex md:flex-col items-center md:items-start justify-center md:justify-start gap-1 border border-orange-700 bg-orange-200 text-orange-700 p-4 rounded-lg shadow-black/80 drop-shadow-lg">
                  <p className="font-semibold text-md text-nowrap leading-none">
                    S/ Atendimento
                  </p>
                  <p className="text-lg md:text-5xl font-bold leading-none">
                    {statusCounts.no_service}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2 flex md:flex-col items-center md:items-start justify-center md:justify-start gap-1 border border-blue-700 bg-blue-200 text-blue-700 p-4 rounded-lg shadow-black/80 drop-shadow-lg">
                  <p className="font-semibold  text-md text-nowrap leading-none flex items-center gap-1">
                    <span className="hidden md:block">Em</span> Atendimento
                  </p>
                  <p className="text-lg md:text-5xl font-bold leading-none">
                    {statusCounts.in_service}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2 flex md:flex-col items-center md:items-start justify-center md:justify-start gap-1 border border-violet-700 bg-violet-200 text-violet-700 p-4 rounded-lg shadow-black/80 drop-shadow-lg">
                  <p className="font-semibold text-lg md:text-md text-nowrap leading-none">
                    Liberados
                  </p>
                  <p className="text-lg md:text-5xl font-bold leading-none">
                    {statusCounts.delivery}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2 flex md:flex-col items-center md:items-start justify-center md:justify-start gap-1 border border-green-700 bg-green-200 text-green-700 p-4 rounded-lg shadow-black/80 drop-shadow-lg">
                  <p className="font-semibold text-md text-nowrap leading-none">
                    Finalizados
                  </p>
                  <p className="text-lg md:text-5xl font-bold leading-none">
                    {statusCounts.finished}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-2 flex md:flex-col items-center md:items-start justify-center md:justify-start gap-1 border border-red-700 bg-red-200 text-red-700 p-4 rounded-lg shadow-black/80 drop-shadow-lg">
                  <p className="font-semibold text-md text-nowrap leading-none">
                    Negados
                  </p>
                  <p className="text-lg md:text-5xl font-bold leading-none">
                    {statusCounts.denied}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-5  border border-black/10 bg-gray-100/60 p-2 rounded-lg shadow-black/80 drop-shadow-lg">
                  <div className="grid grid-cols-12 gap-2 items-center justify-center ">
                    <p className="col-span-4 md:col-span-3  border-red-500 font-semibold text-right">
                      Certificados
                    </p>
                    <div className="col-span-7 md:col-span-8 w-full border-red-500  ">
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
                    <p className="col-span-4 md:col-span-3  border-red-500 font-semibold text-right">
                      Históricos
                    </p>
                    <div className="col-span-7 md:col-span-8 w-full  border-red-500  ">
                      <BorderLinearProgress
                        variant="determinate"
                        value={90}
                      />
                    </div>
                    <p className="col-span-1 text-center  border-red-500 font-semibold">
                      {documentTypeCounts.Histórico}
                    </p>
                  </div>
                  <div className="grid grid-cols-12 gap-2 items-center justify-center ">
                    <p className="col-span-4 md:col-span-3  border-red-500 font-semibold text-right">
                      Declarações
                    </p>
                    <div className="col-span-7 md:col-span-8 w-full  border-red-500  ">
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
                    <p className="col-span-4 md:col-span-3  border-red-500 font-semibold text-right">
                      Atestados
                    </p>
                    <div className="col-span-7 md:col-span-8 w-full border-red-500  ">
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
                <div className="col-span-12 md:col-span-8">
                  <SolicitationChart
                    timestamps={combinedData?.map((item) => item.timestamp)}
                  />
                </div>
                <div className="col-span-12 md:col-span-7">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={isMobile ? 2 : 4}
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
                        <QtdServiceEmployee
                          name={item.nome}
                          qtd={item.quantidade}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </Collapse>
          </div>
        </div>
        <div className="grid grid-cols-3 mt-10 gap-4">
          <div className="w-full col-span-3">
            <Divider>
              <p className="font-bold text-xl md:text-3xl mb-2 text-gray-400">
                Solicitações
              </p>
            </Divider>
          </div>
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
            <IconButton onClick={closeViewAdd} className="invisible">
              <CloseIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <p className="text-xl text-center md:text-3xl">
              Adicionar nova Solicitação
            </p>
            <IconButton onClick={closeViewAdd}>
              <CloseIcon sx={{ fontSize: 30 }} />
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
