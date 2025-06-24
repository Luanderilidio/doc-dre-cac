import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditNoteIcon from '@mui/icons-material/EditNote';
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useBoolean } from "react-hooks-shareable";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import SaveIcon from "@mui/icons-material/Save";
import "moment/locale/pt-br";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import moment from "moment/min/moment-with-locales";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  Gremio,
  GremioCreate,
  GremioCreateSchema,
  Interlocutor,
  School,
  ResponseCreateGremio,
  Student,
  ROLES_ARRAY,
  MemberView,
} from "./SchemaGremioAdmin";
import CardAdminMemberGremio from "./CardAdminMemberGremio";
import GridAdminMember from "./GridAdminMember";

moment.locale("pt-br");

const defaultValues = {
  name: "",
  status: true,
  url_profile: null,
  url_folder: null,
  validity_date: moment().add(1, "year").toISOString(),
  approval_date: moment().toISOString(),
  school_id: "",
  interlocutor_id: "",
};

const rolesOriginal = [
  "DIRETOR",
  "VICE-PRESIDENTE",
  "SECRETÁRIO GERAL I",
  "SECRETÁRIO GERAL II",
  "1° SECRETÁRIO",
  "TESOUREIRO GERAL",
  "1º TESOUREIRO",
  "DIRETOR SOCIAL",
  "DIRETOR DE COMUNICAÇÃO",
  "DIRETOR DE ESPORTES E CULTURA",
  "DIRETOR DE SAÚDE E MEIO AMBIENTE",
];

export default function CardAdminGremios() {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;
  const [isViewAdd, openViewAdd, closeViewAdd, toggleViewAdd] =
    useBoolean(false);
  const [
    isViewAddMember,
    openViewAddMember,
    closeViewAddMember,
    toggleViewAddMember,
  ] = useBoolean(false);

  const [
    isViewEditMember,
    openViewEditMember,
    closeViewEditMember,
    toggleViewEditMember,
  ] = useBoolean(false);


  const [loading, setLoading] = useState(false);
  const [idGremio, setIdGremio] = useState("");
  const [statusCode, setStatusCode] = useState<number>();
  const [rows, setRows] = useState<Gremio[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolSelected, setSchoolSelected] = useState<School | null>(null);
  const [interlocutors, setInterlocutors] = useState<Interlocutor[]>([]);
  const [interlocutorSelected, setInterlocutorSelected] =
    useState<Interlocutor | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [members, setMembers] = useState<MemberView[]>([])
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [rolesCopy, setRolesCopy] = useState<string[]>(rolesOriginal);
  const [rolesNoActive, setRolesNoActive] = useState<string[]>([]);


  const handleDataGet = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Gremio[]>(
        `${apiUrl}/gremios?with_students=true`
      );
      // console.log(response.data);
      setRows(response.data);
      setStatusCode(response.status);
    } catch (error) {
      console.error("Erro ao buscar gremios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataGetSchools = async () => {
    setLoading(true);
    try {
      const response = await axios.get<School[]>(`${apiUrl}/schools?free=true`);
      setSchools(response.data);
    } catch (error) {
      console.error("Erro ao buscar escolas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataGetInterlocutors = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Interlocutor[]>(
        `${apiUrl}/interlocutors?free=true`
      );
      setInterlocutors(response.data);
    } catch (error) {
      console.error("Erro ao buscar interlocutores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataGetStudents = async () => {
    try {
      const response = await axios.get<Student[]>(
        `${apiUrl}/students?not_participate_gremio=true`
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Erro ao buscar Estudantes:", error);
    }
  };

  const handleDataDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${apiUrl}/gremios/${id}`);
      setRows((prev) => prev.filter((row) => row.id !== id));
      setStatusCode(response.status);
    } catch (error) {
      console.error("Erro ao deletar gremio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataPost = async (data: any) => {
    setLoading(true);
    try {
      // console.log(data);

      const response = await axios.post<ResponseCreateGremio>(
        `${apiUrl}/gremios`,
        data
      );
      // console.log(response.status);
      // console.log(response.data);
      setIdGremio(response.data.gremio_id);

      const newRow = {
        id: response.data.gremio_id,
        ...data,
        school: schoolSelected,
        interlocutor: interlocutorSelected,
        members: [],
      };
      setRows((prev) => [...prev, newRow]);
      setStatusCode(response.status);
    } catch (error) {
      console.error("Erro ao cadastrar Gremio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMember = (data: Gremio) => {
    handleDataGetStudents();
    setIdGremio(data.id);
    // console.log(data);
    const rolesAlreadyUsed = data.members?.map((role) => role.role);
    // console.log(rolesAlreadyUsed);

    const rolesNoActive = ROLES_ARRAY.filter(
      (item) => !rolesAlreadyUsed?.includes(item)
    );

    setRolesNoActive(rolesNoActive);
    openViewAddMember();
  };

  const columns: GridColDef<Gremio>[] = [
    { field: "id", headerName: "ID", width: 30 },
    { field: "name", headerName: "Nome", width: 140 },
    {
      field: "approval_date",
      headerName: "Nomeação",
      width: 100,
      renderCell: (params: GridRenderCellParams<any, Date>) => (
        <p>{moment(params.value).format("DD/MM/YYYY")}</p>
      ),
    },
    {
      field: "validity_date",
      headerName: "Vigência",
      width: 100,
      renderCell: (params: GridRenderCellParams<any, Date>) => (
        <p>{moment(params.value).format("DD/MM/YYYY")}</p>
      ),
    },
    {
      field: "school",
      headerName: "Escola",
      width: 120,
      renderCell: (params) => <p>{params.value?.name}</p>,
    },
    {
      field: "interlocutor",
      headerName: "Interlocutor",
      width: 100,
      renderCell: (params) => <p>{params.value?.name}</p>,
    },
    {
      field: "members",
      headerName: "Integrantes",
      width: 100,
      editable: true,
      renderCell: (params) => {
        // console.log(params);
        return (
          <div className=" w-full flex justify-end gap-2 ">
            <p>{params.value?.length}</p>
            <IconButton
              color="primary"
              onClick={() => {
                console.log(params.value)
                setMembers(params.value)
                openViewEditMember()
              }}
            >
              <EditNoteIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </div>
        )
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 70,
      renderCell: (params) => (params.value ? "Ativo" : "Inativo"),
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 130,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // console.log("params.row", params.row);
        return (
          <div>
            <IconButton
              onClick={() => handleViewMember(params.row)}
              color="primary"
            >
              <PersonAddIcon />
            </IconButton>
            
            <IconButton
              onClick={() => handleDataDelete(params.row.id)}
              color="error"
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const handleStudentSelect = (student: Student | null) => {
    // console.log(student);
    if (student) {
      setSelectedStudents((prev) => [...prev, student]);
    }
  };

  const handleRemoveRole = (role: string) => {
    const novaLista = rolesNoActive.filter((item) => item !== role);
    // console.log("novaLista de roles", novaLista);
    setRolesCopy(novaLista);
  };

  const getAvailableStudents = () => {
    return students.filter(
      (s) => !selectedStudents.some((sel) => sel.id === s.id)
    );
  };

  useEffect(() => {
    handleDataGet();
  }, []);

  useEffect(() => {
    if (isViewAdd) {
      handleDataGetSchools();
      handleDataGetInterlocutors();
      handleDataGetStudents();
    }
  }, [isViewAdd]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GremioCreate>({
    resolver: zodResolver(GremioCreateSchema),
    mode: "onChange",
    defaultValues,
  });

  const selectedSchoolId = useWatch({ control, name: "school_id" });
  const selectedInterlocutorId = useWatch({ control, name: "interlocutor_id" });

  return (
    <div className="w-full flex flex-col items-center justify-between border gap-3 rounded-lg p-4">
      <div className="w-full flex items-center justify-between">
        <h1 className="font-Montserrat font-bold text-gray-400">
          Cadastrar Grêmio
        </h1>
        <div className="flex gap-3">
          <Button onClick={openViewAdd} variant="contained" size="small">
            Adicionar
          </Button>
          <Button onClick={handleDataGet} variant="outlined" size="small">
            Atualizar
          </Button>
        </div>
      </div>

      <Dialog
        open={isViewAdd}
        onClose={toggleViewAdd}
        fullWidth
        maxWidth="sm"
        scroll="paper"
      >
        <DialogContent dividers>
          <div className=" flex flex-col gap-3">
            {statusCode === 201 && (
              <Alert severity="success">Grêmio Cadastrado com Sucesso!</Alert>
            )}

            <h1 className="text-center text-3xl font-bold mb-3">
              CADASTRE UM GRÊMIO
            </h1>

            <form
              onSubmit={handleSubmit(handleDataPost)}
              className="grid grid-cols-12 gap-2"
            >
              <div className="col-span-12 mt-2">
                <Divider>Informações</Divider>
              </div>
              <TextField
                {...control.register("name")}
                label="Nome"
                fullWidth
                className="col-span-12"
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <Controller
                name="school_id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    className="col-span-6"
                    options={schools}
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    }
                    value={
                      schools.find((i) => i.id === selectedSchoolId) || null
                    }
                    onChange={(_, newValue) => {
                      setSchoolSelected(newValue);
                      field.onChange(newValue?.id || ""); // Armazena apenas o ID
                    }}
                    renderInput={(params) => (
                      <TextField
                        className="col-span-6"
                        {...params}
                        label="Escola"
                        error={!!errors.school_id}
                        helperText={errors.school_id?.message}
                        required
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        <div>
                          <strong>{option.name}</strong>
                          <div className="text-xs">
                            <p>{option.city}</p>
                          </div>
                        </div>
                      </li>
                    )}
                  />
                )}
              />

              <Controller
                name="interlocutor_id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    className="col-span-6"
                    options={interlocutors}
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    }
                    value={
                      interlocutors.find(
                        (i) => i.id === selectedInterlocutorId
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      setInterlocutorSelected(newValue);
                      field.onChange(newValue?.id || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        className="col-span-6"
                        {...params}
                        label="Interlocutor"
                        error={!!errors.interlocutor_id}
                        helperText={errors.interlocutor_id?.message}
                        required
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        <div>
                          <strong>{option.name}</strong>
                          <div className="text-xs">
                            <p>{option.email}</p>
                            <p>{option.contact}</p>
                          </div>
                        </div>
                      </li>
                    )}
                  />
                )}
              />

              <div className="col-span-12 mt-2">
                <Divider>Datas</Divider>
              </div>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Controller
                  name="approval_date"
                  control={control}
                  render={({ field }) => {
                    // Converte o valor para Moment se for string
                    const value =
                      typeof field.value === "string"
                        ? moment(field.value)
                        : field.value;

                    return (
                      <DatePicker
                        label="Data de Nomeação"
                        className="col-span-6"
                        value={value || null}
                        onChange={(newValue) => {
                          // Armazena como string ISO
                          field.onChange(newValue?.toISOString());
                        }}
                        slotProps={{
                          textField: {
                            error: !!errors.approval_date,
                            helperText: errors.approval_date?.message,
                          },
                        }}
                      />
                    );
                  }}
                />

                <Controller
                  name="validity_date"
                  control={control}
                  render={({ field }) => {
                    const value =
                      typeof field.value === "string"
                        ? moment(field.value)
                        : field.value;

                    return (
                      <DatePicker
                        label="Data de Vigência"
                        className="col-span-6"
                        value={value || null}
                        onChange={(newValue) => {
                          field.onChange(newValue?.toISOString());
                        }}
                        minDate={moment()} // Data mínima = hoje
                        slotProps={{
                          textField: {
                            error: !!errors.validity_date,
                            helperText: errors.validity_date?.message,
                          },
                        }}
                      />
                    );
                  }}
                />
              </LocalizationProvider>
              <div className="col-span-12 mt-2">
                <Divider>Imagens da Chapa</Divider>
              </div>
              <TextField
                fullWidth
                required
                label="Logo do Grêmio"
                variant="outlined"
                className="col-span-6"
                {...register("url_profile")}
                error={!!errors.url_profile}
                helperText={errors.url_profile?.message}
              />
              <TextField
                fullWidth
                required
                label="Imagem de Capa"
                variant="outlined"
                className="col-span-6"
                {...register("url_folder")}
                error={!!errors.url_folder}
                helperText={errors.url_folder?.message}
              />

              <div className="col-span-12 flex justify-end gap-3 mt-4">
                <Button
                  onClick={closeViewAdd}
                  variant="outlined"
                  color="inherit"
                >
                  Fechar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={
                    loading ? (
                      <DataSaverOffIcon className="animate-spin" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                >
                  Cadastrar
                </Button>
              </div>
            </form>
             
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isViewEditMember}
        onClose={closeViewEditMember}
          // onClose={() => {
          //   closeViewAddMember();
          //   handleDataGet();
          // }}
        fullWidth
        maxWidth="sm"
        scroll="paper"
      >
        <DialogContent dividers >
          <h1 className="text-center text-3xl font-bold mb-3">
            EDITE OS MEMBROS DO GRÊMIO
          </h1>
          <GridAdminMember members={members} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={toggleViewEditMember}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={isViewAddMember}
        onClose={() => {
          closeViewAddMember();
          handleDataGet();
        }}
        fullWidth
        maxWidth="sm"
        scroll="paper"
      >
        <DialogContent dividers>
          <h1 className="text-center text-3xl font-bold mb-3">
            CADASTRE UM MEMBRO
          </h1>
          {rolesNoActive.map((role, index) => (
            <CardAdminMemberGremio
              key={index}
              gremio_id={idGremio}
              students={getAvailableStudents()}
              role={role}
              onStudentSelect={handleStudentSelect}
              onRemoveRole={handleRemoveRole}
            />
          ))}
        </DialogContent>
      </Dialog>

      <div className="w-full !h-96">
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={50}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => row.id}
          loading={loading}
          editMode="row"
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}
