import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import { Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import {
  GremioProcessRedefinitionStagesBaseSchema,
  Message,
  ProcessRedefinitionStagesCreate,
  Stage,
} from "./SchemaGremioAdmin";
import { Step } from "./StepperProcessRedefinitionStages";
import axios from "axios";

type Props = {
  gremio_process_id: string;
  stage: Stage;
  steps: Step[];
  activeStep: number;
  index: number;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
};

export default function FormsAddRedefinitionStages({
  gremio_process_id,
  stage,
  activeStep,
  steps,
  index,
  onNext,
  onBack,
  onReset,
}: Props) {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProcessRedefinitionStagesCreate>({
    resolver: zodResolver(GremioProcessRedefinitionStagesBaseSchema),
    mode: "onChange",
    defaultValues: {
      gremio_process_id: gremio_process_id,
      stage: stage,
      status: true,
      observation: "",
    },
  });

  const handleDataSubmit = async (data: ProcessRedefinitionStagesCreate) => {
    console.log(data);
    try {
      const response = await axios.post<Message>(
        `${apiUrl}/gremio-process-redefinition-stages`,
        {
          gremio_process_id: gremio_process_id,
          status: true,
          stage: stage,
          observation: data.observation,
          started_at: data.started_at,
          finished_at: data.finished_at,
        }
      );
      toast.success(response.data.message);
      onNext()
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleDataSubmit)}
      className="grid grid-cols-12 gap-3 overflow-y-auto pt-2"
    >
      <TextField
        fullWidth
        required
        size="small"
        label="Observação"
        defaultValue="Escreva aqui"
        className="col-span-12 row-span-2 !h-full "
        {...control.register("observation")}
        error={!!errors.observation}
        helperText={errors.observation?.message}
      />

      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Controller
          name="started_at"
          control={control}
          render={({ field }) => {
            const value =
              typeof field.value === "string"
                ? moment(field.value)
                : field.value;

            return (
              <DatePicker
                label="Início"
                className="col-span-6"
                value={value || null}
                onChange={(newValue) => {
                  field.onChange(newValue?.toISOString());
                }}
                slotProps={{
                  textField: {
                    error: !!errors.started_at?.message,
                    helperText: errors.started_at?.message,
                    size: "small",
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
            const value =
              typeof field.value === "string"
                ? moment(field.value)
                : field.value;

            return (
              <DatePicker
                label="Fim"
                className="col-span-6"
                value={value || null}
                onChange={(newValue) => {
                  field.onChange(newValue?.toISOString());
                }}
                minDate={moment()} // Data mínima = hoje
                slotProps={{
                  textField: {
                    error: !!errors.finished_at,
                    helperText: errors.finished_at?.message,
                    size: "small",
                  },
                }}
              />
            );
          }}
        />
      </LocalizationProvider>

      <div className="col-span-12 flex items-center justify-end ">
        <Button
          type="submit"
          size="small"
          variant="contained"
          
          sx={{ mt: 1, mr: 1 }}
        >
          Salvar
        </Button>
        <Button
          size="small"
          disabled={index === 0}
          onClick={onBack}
          sx={{ mt: 1, mr: 1 }}
        >
          Back
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
