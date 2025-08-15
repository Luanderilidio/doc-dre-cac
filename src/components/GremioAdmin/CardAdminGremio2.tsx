import {
  Autocomplete,
  Button,
  Divider,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import CardGremio from "./CardGremio"; 
import CloseIcon from "@mui/icons-material/Close";
import FormsAddMember from "./FormsAddMember";
import { useAllGremiosWithMembers } from "../../services/Gremios";
import FormGremio from "./Forms/FormGremio";

export default function AdminGremio() {
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    school: "",
    interlocutor: "",
    status: "all",
  });

  const { data, isLoading, error } = useAllGremiosWithMembers();

  const [idGremio, setIdGremio] = useState<string | null>(null);

  const [viewFormsAddGremio, setViewFormsAddGremio] = useState<boolean>(false);
  const [viewFormsAddMembers, setViewFormsAddMembers] =
    useState<boolean>(false);

  const filteredData = (data ?? []).filter((gremio) => {
    const nameMatch =
      filters.name === "" ||
      gremio.name.toLowerCase().includes(filters.name.toLowerCase());
    const cityMatch =
      filters.city === "" ||
      gremio.school.city.toLowerCase().includes(filters.city.toLowerCase());
    const schoolMatch =
      filters.school === "" ||
      gremio.school.name.toLowerCase().includes(filters.school.toLowerCase());
    const interlocutorMatch =
      filters.interlocutor === "" ||
      gremio.interlocutor.name
        .toLowerCase()
        .includes(filters.interlocutor.toLowerCase());
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "active" && gremio.status) ||
      (filters.status === "inactive" && !gremio.status);

    return (
      nameMatch && cityMatch && schoolMatch && interlocutorMatch && statusMatch
    );
  });

  const unique = (arr: string[]) => [...new Set(arr)];

  if (error) return <>deu pau!</>;
  if (isLoading) return <>Carregando</>;

  return (
    <div className="h-full grid grid-cols-12 gap-5  ">
      <div className="col-span-12 border grid grid-cols-12 gap-3 bg-gray-100/60 p-4 rounded-lg">
        <p className="col-span-12 text-xl font-bold">Filtros</p>
        <Autocomplete
          className="col-span-3"
          options={unique(data?.map((gremio) => gremio.name) ?? [])}
          value={filters.name}
          onChange={(_, value) =>
            setFilters((prev) => ({ ...prev, name: value || "" }))
          }
          renderInput={(params) => (
            <TextField {...params} label="Nome do Grêmio" />
          )}
        />

        <Autocomplete
          className="col-span-2"
          options={unique(data?.map((gremio) => gremio.school.city) ?? [])}
          value={filters.city}
          onChange={(_, value) =>
            setFilters((prev) => ({ ...prev, city: value || "" }))
          }
          renderInput={(params) => <TextField {...params} label="Cidade" />}
        />

        <Autocomplete
          className="col-span-2"
          options={unique(data?.map((gremio) => gremio.school.name) ?? [])}
          value={filters.school}
          onChange={(_, value) =>
            setFilters((prev) => ({ ...prev, school: value || "" }))
          }
          renderInput={(params) => <TextField {...params} label="Escola" />}
        />

        <Autocomplete
          className="col-span-2"
          options={unique(
            data?.map((gremio) => gremio.interlocutor.name) ?? []
          )}
          value={filters.interlocutor}
          onChange={(_, value) =>
            setFilters((prev) => ({ ...prev, teacher: value || "" }))
          }
          renderInput={(params) => (
            <TextField {...params} label="Interlocutor" />
          )}
        />

        <TextField
          className="col-span-2"
          select
          label="Status"
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="active">Ativos</MenuItem>
          <MenuItem value="inactive">Inativos</MenuItem>
        </TextField>

        <Button
          onClick={() => setViewFormsAddGremio(true)}
          className="col-span-1"
          variant="outlined"
          color="primary"
        >
          <AddCircleOutlineIcon sx={{ fontSize: 30 }} />
        </Button>
      </div>
      <div className="col-span-12 grid grid-cols-2 gap-5">
        {viewFormsAddGremio && (
          <div className="bg-gray-100/60 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <p className="col-span-12 text-xl font-bold">Cadastrar Grêmio</p>
              <IconButton
                aria-label=""
                onClick={() => setViewFormsAddGremio(false)}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <FormGremio />
          </div>
        )}
        {viewFormsAddMembers && (
          <div className="bg-gray-100/60 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <p className="col-span-12 text-xl font-bold mb-4">
                Adicionar Membros
              </p>
              <IconButton
                aria-label=""
                onClick={() => setViewFormsAddMembers(false)}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <FormsAddMember gremio_id={idGremio || ""} />
          </div>
        )}
      </div>
      <div className="col-span-12 flex items-center justify-between gap-3">
        <p className="font-bold text-xl">Grêmios</p>
        <div className="w-full">
          <Divider />
        </div>
        <Button
          // onClick={handleDataGetGremio}
          variant="text"
          // endIcon={loading ? <RestartAltIcon className="animate-spin" /> : null}
        >
          Atualizar
        </Button>
      </div>
      {filteredData?.map((item) => (
        <div className="col-span-3">
          <CardGremio data={item} />
        </div>
      ))}
      {/* <div className="col-span-12 border">
        <CardAdminGremios />
      </div> */}
    </div>
  );
}
