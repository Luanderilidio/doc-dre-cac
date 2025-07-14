import { Button, TextField } from "@mui/material";
import {
  GetGremioProcessRedefinitionStagesSchema,
  GremioProcessRedefinitionStagesBaseSchema,
  Message,
  ProcessRedefinitionStages,
  ProcessRedefinitionStagesCreate,
} from "./SchemaGremioAdmin";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { ptBR } from "@mui/x-date-pickers/locales";
import moment from "moment/min/moment-with-locales";
import "moment/locale/pt-br";
moment.locale("pt-br");

type Props = {
  data: ProcessRedefinitionStages;
};

export default function FormsAddRedefinitionStages({ data }: Props) {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProcessRedefinitionStagesCreate>({
    resolver: zodResolver(GremioProcessRedefinitionStagesBaseSchema),
    mode: "onChange",
    defaultValues: {
      gremio_process_id: data.gremio_process_id,
      status: true,
      stage: data.stage,
    },
  });

  const handleDataSubmit = async (
    formData: ProcessRedefinitionStagesCreate
  ) => {
    // console.log("Dados recebidos no handleSubmit:", formData);

    try {
      const response = await axios.post<Message>(
        `${apiUrl}/gremio-process-redefinition-stages`,
        formData
      );

      // console.log("Resposta da API:", response.data);
      toast.success("Estágio cadastrado com sucesso");
      reset();
    } catch (error: unknown) {
      console.error(error);
      toast.error("Ocorreu um erro ao salvar o estágio.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleDataSubmit)}
      className="grid grid-cols-12 gap-3"
      noValidate
    >
      <TextField
        fullWidth
        required
        placeholder="Escreva uma obsevação"
        label="Observação"
        variant="outlined"
        className="col-span-12"
        {...register("observation")}
        error={!!errors.observation}
        helperText={errors.observation?.message}
      />
      <LocalizationProvider
        dateAdapter={AdapterMoment}
        adapterLocale="pt-br"
        localeText={
          ptBR.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <Controller
          name="started_at"
          control={control}
          render={({ field }) => {
            const value = field.value ? moment(field.value) : null;

            return (
              <DatePicker
                label="Data Início"
                className="col-span-6"
                format="DD/MM/YYYY"
                value={value}
                onChange={(newValue) => {
                  field.onChange(newValue ? newValue.toISOString() : null);
                }}
                slotProps={{
                  textField: {
                    error: !!errors.started_at,
                    helperText: errors.started_at?.message,
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            );
          }}
        />

        <Controller
          name="finished_at"
          control={control}
          render={({ field }) => {
            const value = field.value ? moment(field.value) : null;

            return (
              <DatePicker
                label="Data Início"
                className="col-span-6"
                format="DD/MM/YYYY"
                value={value}
                onChange={(newValue) => {
                  field.onChange(newValue ? newValue.toISOString() : null);
                }}
                slotProps={{
                  textField: {
                    error: !!errors.finished_at,
                    helperText: errors.finished_at?.message,
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            );
          }}
        />
      </LocalizationProvider>

      <div className="col-span-12 flex items-center justify-end gap-3">
        <Button type="submit" variant="contained">
          Salvar
        </Button>
        <Button type="button" variant="outlined" onClick={() => reset()}>
          Limpar
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
