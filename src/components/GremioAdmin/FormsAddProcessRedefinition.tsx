import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Message,
  MessageWithId,
  ProcessRedefinition,
  ProcessRedefinitionBaseSchema,
  ProcessRedefinitionCreate,
  ProcessRedefinitionWithStages,
} from "./SchemaGremioAdmin";
import axios from "axios";
import CardProcessRedefinition from "./CardProcessRedefinition";

type Props = {
  gremio_id: string;
};

export default function FormsAddProcessRedefinition({ gremio_id }: Props) {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

  const [gremioProcessId, setGremioProcessId] = useState<string>("");

  const [gremioProcess, setGremioProcess] = useState<ProcessRedefinitionWithStages>()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProcessRedefinitionCreate>({
    resolver: zodResolver(ProcessRedefinitionBaseSchema),
    mode: "onChange",
    defaultValues: {
      gremio_id: gremio_id,
      year: new Date().getFullYear(),
      observation: "",
      status: true,
    },
  });

  const handleDataSubmit = async (data: ProcessRedefinitionCreate) => {
    try {
      const response = await axios.post<MessageWithId>(
        `${apiUrl}/gremio-process-redefinition`,
        {
          gremio_id: gremio_id,
          observation: data.observation,
          year: data.year,
          status: true,
        }
      );
      setGremioProcessId(response.data.id);
      toast.success(response.data.message);
    } catch (error) { }
  };

  const getProcessRefefinition = async () => {
    try {
      const response = await axios.get<ProcessRedefinitionWithStages>(
        `${apiUrl}/gremio-process-redefinition`,
        {
          params: {
            filter: "gremio_id",
            gremio_id: gremio_id,
          },
        }
      );

      console.log(response.data)
      setGremioProcess(response.data)
      setGremioProcessId(response.data.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProcessRefefinition()
  }, [])

  return (
    <div className="w-full">

      {gremioProcessId && (

        <CardProcessRedefinition data={gremioProcess} />
      )}
      {/* <form
        className="grid grid-cols-12 grid-rows-2 gap-2 bg-gray-100/60 p-4 rounded-lg border"
        action=""
        onSubmit={handleSubmit(handleDataSubmit)}
      >
        <h1 className="col-span-12 row-span-1 w-full font-bold text-xl h-fit">
          Crie uma novo processo
        </h1>

        <TextField
          required
          multiline
          minRows={3}
          size="small"
          {...control.register("observation")}
          label="Observação"
          fullWidth
          className="col-span-8 row-span-2 !h-full"
          defaultValue="Escreva aqui"
          error={!!errors.observation}
          helperText={errors.observation?.message}
        />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Controller
            name="year"
            control={control}
            render={({ field, fieldState }) => (
              <DatePicker
                views={["year"]}
                className="col-span-4 row-span-1"
                label="Ano"
                value={field.value ? moment(`${field.value}`, "YYYY") : null}
                onChange={(date: Moment | null) => {
                  field.onChange(date ? date.year() : undefined);
                }}
                slotProps={{
                  textField: {
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
        <div className="col-span-4 row-span-1 flex items-center justify-end">
          <Button variant="contained" size="small" type="submit">
            Cadastrar
          </Button>
        </div>
      </form>
      {gremioProcessId && (
        <div className="bg-gray-100/60 p-4 rounded-lg border overflow-y-auto">
          <h1 className="w-full font-bold text-xl mb-3">Defina as datas</h1>
          <StepperProcessRedefinitionStages
            gremio_process_id={gremioProcessId}
          />
        </div>
      )}
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
      /> */}
    </div>
  );
}
