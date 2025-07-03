// FormsAddRedefinitionStages.tsx
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { ProcessRedefinitionStagesCreate, GremioProcessRedefinitionStagesBaseSchema, Stage, Message } from "./SchemaGremioAdmin";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

type Props = {
  gremio_process_id: string;
  stage: Stage;
  steps: { label: Stage; description: string }[];
  activeStep: number;
  index: number;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
};

export default function FormsAddRedefinitionStages({
  gremio_process_id,
  stage,
  onNext,
  onBack,
  index,
}: Props) {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

  const { control, handleSubmit, formState: { errors } } = useForm<ProcessRedefinitionStagesCreate>({
    resolver: zodResolver(GremioProcessRedefinitionStagesBaseSchema),
    mode: "onChange",
    defaultValues: {
      gremio_process_id,
      stage,
      status: true,
      observation: "",
    },
  });

  const handleDataSubmit = async (data: ProcessRedefinitionStagesCreate) => {
    try {
      const response = await axios.post<Message>(
        `${apiUrl}/gremio-process-redefinition-stages`,
        {
          ...data,
          started_at: data.started_at,
          finished_at: data.finished_at,
        }
      );
      toast.success(response.data.message);
      onNext();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleDataSubmit)} className="grid grid-cols-12 gap-3">
      <TextField
        fullWidth
        size="small"
        label="Observação"
        {...control.register("observation")}
        error={!!errors.observation}
        helperText={errors.observation?.message}
        className="col-span-12"
      />

      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Controller
          name="started_at"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Início"
              value={field.value ? moment(field.value) : null}
              onChange={(date) => field.onChange(date?.toISOString())}
              slotProps={{
                textField: {
                  error: !!errors.started_at,
                  helperText: errors.started_at?.message,
                  size: "small",
                },
              }}
            />
          )}
        />

        <Controller
          name="finished_at"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Fim"
              value={field.value ? moment(field.value) : null}
              onChange={(date) => field.onChange(date?.toISOString())}
              minDate={moment()}
              slotProps={{
                textField: {
                  error: !!errors.finished_at,
                  helperText: errors.finished_at?.message,
                  size: "small",
                },
              }}
            />
          )}
        />
      </LocalizationProvider>

      <div className="col-span-12 flex justify-end">
        <Button type="submit" variant="contained" size="small">
          Salvar
        </Button>
        <Button size="small" disabled={index === 0} onClick={onBack} sx={{ ml: 1 }}>
          Voltar
        </Button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </form>
  );
}
