import { useState } from "react";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import { ToastContainer, toast } from "react-toastify";
import { Button, Collapse } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  ProcessRedefinitionBaseSchema,
  ProcessRedefinitionCreate,
  ProcessRedefinitionPatch,
} from "./SchemaGremioAdmin";
import { ExpandMore } from "../../utils/colappse";
import {
  useCreateProcessRedefinition,
  usePatchProcessRedefinition,
} from "../../services/ProcessRedefinition";

type Props = {
  gremio_id: string;
  defaultValues?: Partial<ProcessRedefinitionPatch>;
  process_gremio_id?: string;
};

export default function FormProcessRedefinition({
  gremio_id,
  defaultValues,
  process_gremio_id,
}: Props) {
  const [expanded, setExpanded] = useState(!!process_gremio_id);

  const isEditMode = !!process_gremio_id;

  const createMutation = useCreateProcessRedefinition();
  const patchMutation = usePatchProcessRedefinition(gremio_id);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProcessRedefinitionCreate>({
    resolver: zodResolver(ProcessRedefinitionBaseSchema),
    mode: "onChange",
    defaultValues: {
      gremio_id,
      year: defaultValues?.year ?? new Date().getFullYear(),
      observation: defaultValues?.observation ?? "",
      status: defaultValues?.status ?? true,
    },
  });

  const onSubmit = (formData: ProcessRedefinitionCreate) => {
    if (isEditMode && process_gremio_id) {
      // PATCH
      patchMutation.mutate(
        { id: process_gremio_id, data: formData },
        {
          onSuccess: (response) => {
            toast.success(response.message);
          },
          onError: () => {
            toast.error("Erro ao atualizar processo!");
          },
        }
      );
    } else {
      // POST
      createMutation.mutate(formData, {
        onSuccess: (response) => {
          toast.success(response.message);
        },
        onError: () => {
          toast.error("Erro ao cadastrar processo!");
        },
      });
    }
  };

  const isLoading = createMutation.isPending || patchMutation.isPending;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-5 border-red-500">
        <form
          className="grid grid-cols-12  gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            required
            multiline
            minRows={3}
            size="small"
            {...control.register("observation")}
            label="Observação"
            fullWidth
            className="col-span-8  !h-full"
            error={!!errors.observation}
            helperText={errors.observation?.message}
          />
          <div className="col-span-4 flex flex-col items-center justify-between">
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name="year"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    views={["year"]}
                    label="Ano"
                    value={
                      field.value ? moment(`${field.value}`, "YYYY") : null
                    }
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
            <Button
              fullWidth
              variant="contained"
              size="small"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Salvando..."
                : isEditMode
                ? "Salvar alterações"
                : "Cadastrar"}
            </Button>
          </div>
        </form>
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
    </>
  );
}
