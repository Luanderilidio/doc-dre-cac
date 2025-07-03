// StepperProcessRedefinitionStages.tsx
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import FormsAddRedefinitionStages from "./FormsProcessRedefinitionStages";
import { Stage } from "./SchemaGremioAdmin";

export type StepType = {
  label: Stage;
  description: string;
};

const steps: StepType[] = [
  { label: "Comissão Pró-Grêmio", description: "Etapa inicial do processo." },
  { label: "Assembleia Geral", description: "Discussão e apresentação das propostas." },
  { label: "Comissão Eleitoral", description: "Organização da eleição." },
  { label: "Homologação das Chapas", description: "Validação das candidaturas." },
  { label: "Campanha Eleitoral", description: "Divulgação das propostas." },
  { label: "Votação", description: "Realização da votação." },
  { label: "Posse", description: "Posse da chapa eleita." },
];

type Props = {
  gremio_process_id: string;
};

export default function StepperProcessRedefinitionStages({ gremio_process_id }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  return (
    <div className="grid grid-cols-12 gap-3 overflow-y-auto">
      <Stepper activeStep={activeStep} orientation="vertical" className="col-span-12">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              {step.label}
            </StepLabel>
            <StepContent>
              <FormsAddRedefinitionStages
                gremio_process_id={gremio_process_id}
                stage={step.label}
                steps={steps}
                activeStep={activeStep}
                index={index}
                onNext={handleNext}
                onBack={handleBack}
                onReset={handleReset}
              />
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
