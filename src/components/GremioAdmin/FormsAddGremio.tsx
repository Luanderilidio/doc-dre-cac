import { zodResolver } from "@hookform/resolvers/zod";
import {
    Autocomplete,
    Button,
    Divider,
    TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import SaveIcon from "@mui/icons-material/Save";
import "moment/locale/pt-br";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import PlaceIcon from '@mui/icons-material/Place';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import moment from "moment/min/moment-with-locales";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { ToastContainer, toast } from 'react-toastify';
import {
    GremioCreate,
    GremioCreateSchema,
    Interlocutor,
    School,
    ResponseCreateGremio,
    Message,
    Gremio, 
} from "./SchemaGremioAdmin";
import { faker } from "@faker-js/faker";
moment.locale("pt-br");

const defaultValues: GremioCreate = {
    name: faker.commerce.product(),
    status: true,
    url_profile: faker.image.avatar(),
    url_folder: faker.image.avatar(),
    validity_date: moment().add(1, "year").toISOString(),
    approval_date: moment().toISOString(),
    school_id: "",
    interlocutor_id: "",
};

type FormsAddGremioProps = {
    setIdGremio: (id: string) => void;
    setViewFormsAddMembers: React.Dispatch<React.SetStateAction<boolean>>;
    gremioEditData?: Gremio;
};

export default function FormsAddGremio({ setIdGremio, setViewFormsAddMembers, gremioEditData }: FormsAddGremioProps) {

    const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState<School[]>([]);
    const [interlocutors, setInterlocutors] = useState<Interlocutor[]>([]);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<GremioCreate>({
        resolver: zodResolver(GremioCreateSchema),
        mode: "onChange",
        defaultValues: gremioEditData
            ? {
                ...gremioEditData, 
            }
            : defaultValues,
    });


    // const handleDataPost = async (data: any) => {
    //     setLoading(true)
    //     try {
    //         const response = await axios.post<ResponseCreateGremio>(
    //             `${apiUrl}/gremios`, {
    //             data
    //         }
    //         );
    //         setIdGremio(response.data.gremio_id)
    //         setViewFormsAddMembers(true)
    //         toast.success("Gremio Cadastado com Sucesso!");
    //     } catch (error) {
    //         console.error("Erro ao cadastrar Gremio:", error);
    //     } finally {
    //         setLoading(false)
    //     }
    // };


    const createGremio = async (data: GremioCreate) => {
        console.log('createGremio', data)
        const response = await axios.post<ResponseCreateGremio>(
            `${apiUrl}/gremios`, data)
        return response.data;
    };

    const updateGremio = async (id: string, data: GremioCreate) => {
        const response = await axios.put<Message>(`${apiUrl}/gremios/${id}`, data );
        console.log(response.data.message)
        return response.data;
    };

    const handleDataSubmit = async (data: GremioCreate) => {
        setLoading(true)
        try {
            if (gremioEditData?.id) {
                await updateGremio(gremioEditData.id, data)
                toast.success('Gremio Atualizado com sucesso!')
            } else {
                console.log('chegou aqui')
                const created = await createGremio(data);
                setIdGremio(created.gremio_id)
                setViewFormsAddMembers(true)
                toast.success("Grêmio cadastrado com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao salvar Grêmio:", error);
            toast.error("Erro ao salvar Grêmio");
        } finally {
            setLoading(false);
        }
    }

    const handleDataGetSchools = async () => {
        try {
            const response = await axios.get<School[]>(`${apiUrl}/schools?free=true`);
            setSchools(response.data);
        } catch (error) {
            console.error("Erro ao buscar escolas:", error);
        }
    };

    const handleDataGetInterlocutors = async () => {
        try {
            const response = await axios.get<Interlocutor[]>(
                `${apiUrl}/interlocutors?free=true`
            );
            setInterlocutors(response.data);
        } catch (error) {
            console.error("Erro ao buscar interlocutores:", error);
        }
    };

    useEffect(() => {
        handleDataGetSchools();
        handleDataGetInterlocutors();
    }, []);

    const selectedSchoolId = useWatch({ control, name: "school_id" });
    const selectedInterlocutorId = useWatch({ control, name: "interlocutor_id" });

    return (
        <form
            onSubmit={handleSubmit(handleDataSubmit)}
            className="grid grid-cols-12 gap-2 !font-Inter"
        >
            <div className="col-span-12 mt-2">
                <Divider > <p className="text-sm font-semibold">Informações</p></Divider>
            </div>
            <TextField
                required
                {...control.register("name")}
                label="Nome da Chapa"
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
                                    <div className="flex items-start justify-start gap-1">
                                        <MapsHomeWorkIcon sx={{ fontSize: 15 }} />
                                        <strong className="text-sm leading-none">{option.name}</strong>
                                    </div>
                                    <div className="text-xs flex items-center justify-start ">
                                        <PlaceIcon sx={{ fontSize: 11 }} />
                                        <p className="leading-none">{option.city}</p>
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
                <Divider> <p className="text-sm font-semibold">Datas</p></Divider>
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
                <Divider> <p className="text-sm font-semibold">Imagens da Chapa</p></Divider>
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
                    {gremioEditData ? "Atualizar" : "Cadastrar"}
                </Button>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </form>
    )
}