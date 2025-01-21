import { useEffect, useState } from "react";

import RefreshIcon from "@mui/icons-material/Refresh";

import ClearIcon from "@mui/icons-material/Clear";

import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import api from "../services/api";
import CardDocument, { CardDocumentProps } from "../components/CardDocument";



export default function Admin() {
  const apiUrl = import.meta.env.VITE_BACK_END_URL as string;

  // Definindo os tipos dos estados
  const [data, setData] = useState<CardDocumentProps[]>([]);
  const [filteredData, setFilteredData] = useState<CardDocumentProps[]>([]);

  const [nome, setNome] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [employee, setEmployee] = useState<string>("");
  const [documentType, setDocumetType] = useState<string>("");

  const documentTypes = ["Histórico", "Certificado", "Declaração", "Atestado"];

  
  

  const fetchData = async () => {
    try {
      const response = await api.get<{ output: CardDocumentProps[] }>(apiUrl, {
        params: {
          action: "get",
          sheet: "DadosFormulario",
        },
      });
      // console.log("API Response:", response.data.output);
      // console.log(response.data.output)
      const sortedData = response.data.output.sort((a, b) => {
        if (a.status === "" && b.status !== "") {
          return -1; // 'a' deve vir antes de 'b'
        } else if (a.status !== "" && b.status === "") {
          return 1; // 'b' deve vir antes de 'a'
        } else {
          return 0; // mantem a ordem original entre os outros itens
        }
      });
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log("API URL:", apiUrl);

  useEffect(() => {
    const filtro = data.filter((item) => {
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

  return (
    <div className="w-full border">
      <div className="grid grid-cols-12 gap-5 px-2 mt-5">
        <p className="text-center text-blue-700 font-bold font-Anton col-span-12 text-5xl">
          PAINEL DE SOLICITAÇÕES DE DOCUMENTOS - DRE CÁCERES
        </p>
        <div className="col-span-12 grid grid-cols-12 gap-5 bg-gray-100/60 p-4 rounded-lg">
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
              <MenuItem value="">Sem Atendimento</MenuItem>
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
              <MenuItem value="Luander">Luander</MenuItem>
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
            variant="outlined"
            endIcon={<RefreshIcon />}
            onClick={fetchData}
            className="col-span-3"
          >
            Atualizar
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3">
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
  );
}
