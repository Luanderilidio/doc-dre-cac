import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import {
  Autocomplete,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { faker } from "@faker-js/faker";
import PlaceIcon from "@mui/icons-material/Place";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import {
  GremioCreate,
  GremioCreateSchema,
  GremioPatch,
  GremioWithMember,
} from "../SchemaGremioAdmin";
import { useCreateGremio, usePatchGremio } from "../../../services/Gremios";
import moment from "moment/min/moment-with-locales";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useAllInterlocutorsFree } from "../../../services/Interlocutors";
import { useAllSchoolsFree } from "../../../services/School";
import { useEffect } from "react";
moment.locale("pt-br");

type FormGremioForms = {
  gremio_id?: string;
  initialDate?: GremioWithMember;
};

export default function FormGremio({
  gremio_id,
  initialDate,
}: FormGremioForms) {
  const createMutation = useCreateGremio();
  const updateMutation = usePatchGremio();
  const { data: interlocutors } = useAllInterlocutorsFree();

  const { data: schools } = useAllSchoolsFree();

  const {
    setValue,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GremioCreate>({
    resolver: zodResolver(GremioCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: initialDate?.name || faker.commerce.product(),
      status: initialDate?.status || true,
      url_profile: initialDate?.url_profile || faker.image.url(),
      url_folder: initialDate?.url_folder || faker.image.url(),
      validity_date:
        initialDate?.validity_date || moment().add(1, "year").toISOString(),
      approval_date: initialDate?.approval_date || moment().toISOString(),
      url_action_plan:
        initialDate?.url_action_plan || "",
      school_id: initialDate?.school.id || "",
      interlocutor_id: initialDate?.interlocutor.id || "",
    },
  });

  const handleDataSubmit = async (formData: GremioCreate) => {
    if (gremio_id) {
      //update
      updateMutation.mutate(
        { id: gremio_id, data: formData as GremioPatch },
        {
          onSuccess: (_response) => {
            toast.success("Gremio atualizado com sucesso!");
          },
          onError: () => {
            toast.error("Erro ao atualizar Gremio!");
          },
        }
      );
    } else {
      // create
      createMutation.mutate(formData, {
        onSuccess: (response) => {
          toast.success(response.message);
        },
        onError: () => {
          toast.error("Erro ao cadastrar Gremio!");
        },
      });
    }
  };

  const selectedSchoolId = useWatch({ control, name: "school_id" });
  const selectedInterlocutorId = useWatch({ control, name: "interlocutor_id" });

  useEffect(() => {
    if (initialDate?.school) {
      setValue("school_id", initialDate.school.id);
    }
    if (initialDate?.interlocutor) {
      setValue("interlocutor_id", initialDate.interlocutor.id);
    }
  }, [initialDate, setValue]);

  return (
    <form
      onSubmit={handleSubmit(handleDataSubmit)}
      className="flex flex-col gap-3  "
    >
      <div className="col-span-12 mt-3">
        <Divider>
          <p className="text-sm font-semibold">Informações</p>
        </Divider>
      </div>
      <div className="grid grid-cols-12 gap-2">
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
          render={({ field }) => {
            const currentValue =
              schools?.find((s) => s.id === field.value) ||
              initialDate?.school ||
              null;

            return (
              <Autocomplete
                className="col-span-6"
                options={schools ?? []}
                getOptionLabel={(option) => option.name || ""}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                value={currentValue}
                onChange={(_, newValue) => field.onChange(newValue?.id || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Escola"
                    error={!!errors.school_id}
                    helperText={errors.school_id?.message}
                    required
                  />
                )}
              />
            );
          }}
        />
        <Controller
          name="interlocutor_id"
          control={control}
          render={({ field }) => {
            const currentValue =
              interlocutors?.find((i) => i.id === field.value) ||
              initialDate?.interlocutor ||
              null;

            return (
              <Autocomplete
                className="col-span-6"
                options={interlocutors ?? []}
                getOptionLabel={(option) => option.name || ""}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                value={currentValue}
                onChange={(_, newValue) => field.onChange(newValue?.id || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Interlocutor"
                    error={!!errors.interlocutor_id}
                    helperText={errors.interlocutor_id?.message}
                    required
                  />
                )}
              />
            );
          }}
        />

        <div className="col-span-12 mt-3">
          <Divider>
            {" "}
            <p className="text-sm font-semibold">Datas</p>
          </Divider>
        </div>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="pt-br">
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
                  format="DD/MM/YYYY"
                  value={value || null}
                  onChange={(newValue) => {
                    // Armazena como string ISO
                    field.onChange(newValue?.toISOString());
                  }}
                  slotProps={{
                    textField: {
                      error: !!errors.approval_date?.message,
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
                  format="DD/MM/YYYY"
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
        <div className="col-span-12 mt-3">
          <Divider>
            {" "}
            <p className="text-sm font-semibold">Imagens da Chapa</p>
          </Divider>
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
        <div className="col-span-12 mt-3">
          <Divider>
            <p className="text-sm font-semibold">Documentos Necessários</p>
          </Divider>
        </div>
        <TextField
          fullWidth
          required
          label="Plano de Ação"
          variant="outlined"
          className="col-span-12"
          {...register("url_action_plan")}
          error={!!errors.url_action_plan}
          helperText={errors.url_action_plan?.message}
        />
        <Button
          variant="contained"
          type="submit"
          className="col-span-12"
          size="small"
        >
          {gremio_id ? "Salvar Alterações" : "Adicionar"}
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
  );
}
