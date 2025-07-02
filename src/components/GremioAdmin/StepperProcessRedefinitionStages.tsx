import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import {
  GremioProcessRedefinitionStagesBaseSchema,
  ProcessRedefinitionStagesCreate,
  Stage,
} from "./SchemaGremioAdmin";
import { useState } from "react";
import FormsAddRedefinitionStages from "./FormsProcessRedefinitionStages";

export type Step = {
  label: Stage;
  description: string;
};

type Props = {
  gremio_process_id: string;
};
const steps: Step[] = [
  {
    label: "Comissão Pró-Grêmio",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Assembleia Geral",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Comissão Eleitoral",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Homologação das Chapas",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Campanha Eleitoral",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Votação",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Posse",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
];

export default function StepperProcessRedefinitionStages({
  gremio_process_id,
}: Props) {
  const apiUrl = import.meta.env.VITE_BACK_END_API_DRE as string;

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="grid grid-cols-12 gap-3 overflow-y-auto ">
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        className="col-span-12"
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <div className="">
                <FormsAddRedefinitionStages
                  gremio_process_id={gremio_process_id}
                  steps={steps}
                  stage={step.label}
                  activeStep={activeStep}
                  onNext={handleNext}
                  onBack={handleBack}
                  onReset={handleReset}
                  index={index}  
                />
              
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
