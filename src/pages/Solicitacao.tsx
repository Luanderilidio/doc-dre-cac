import { useParams } from "react-router-dom";
import api from "../services/api";
import { CardDocumentProps } from "../components/CardDocument";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Container, Step, StepLabel, Stepper, TextField } from "@mui/material";

export default function Solicitacao() {
  const apiUrl = import.meta.env.VITE_BACK_END_URL as string;
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<CardDocumentProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const [statusOrder, setStatusOrder] = useState<string | 'no_service'>();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ output: CardDocumentProps[] }>(apiUrl, {
        params: { action: "slugCpf", cpf: id },
      });

      console.log("response.data", response.data);

      if (response.data.output.length > 0) {
        setData(response.data.output[0]); // Pega o primeiro item do array
        console.log(response.data.output[0].status);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      setError("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const getStatusOrder = (statusOrder: string | "no_service"): number => {
    switch (statusOrder) {
      case "no_service":
        return 0;
      case "in_service":
        return 1;
      case "delivery":
        return 2;
      case "finished":
        return 3;
      default:
        console.warn("Status desconhecido:", statusOrder);
        return 0; // Retorna 0 por padrão para evitar erros
    }
  };

  return (
    <>
      {data ? (
        <div className="flex flex-col items-center mt-14 px-4">
          <h1 className="text-3xl font-bold font-Montserrat text-center">
            {data?.nomeCompleto}
          </h1>

          <p className="text-md text-center mt-5">
            O seu documento solicitado <br /> está com o Status
          </p>

          <div className="flex items-center justify-center mt-5">
            {data?.status !== "denied" ? (
              <>
                <Stepper
                  className="my-7"
                  activeStep={getStatusOrder(data?.status || "no_service")}
                  alternativeLabel
                >
                  <Step key={0}>
                    <StepLabel>
                      <p className="font-Inter leading-none">
                        Ainda sem <br /> Atendimento
                      </p>
                    </StepLabel>
                  </Step>
                  <Step key={1}>
                    <StepLabel>
                      <div className="flex flex-col items-center">
                        <div className="h-7 border-l-2" />
                        <p className="font-Inter">
                          Em <br /> Atendimento
                        </p>
                      </div>
                    </StepLabel>
                  </Step>
                  <Step key={2}>
                    <StepLabel>
                      <p className="font-Inter leading-none">
                        Documento <br /> Liberado
                      </p>
                    </StepLabel>
                  </Step>
                  <Step key={3}>
                    <StepLabel>
                      <div className="flex flex-col items-center">
                        <div className="h-7 border-l-2" />
                        <p className="font-Inter">
                          Documento <br /> Finalizado{" "}
                        </p>
                      </div>
                    </StepLabel>
                  </Step>
                </Stepper>
              </>
            ) : (
              <>
                <Stepper
                  className="my-7"
                  activeStep={getStatusOrder(data?.status) || 0}
                  alternativeLabel
                >
                  <Step key={0}>
                    <StepLabel>
                      Solicitação <br /> Negada
                    </StepLabel>
                  </Step>
                </Stepper>
              </>
            )}
          </div>

          {data?.status === "no_service" && (
            <div className="!w-fit  p-4 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <div className=" !w-fit p-2 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                  <InfoIcon />
                  <p className="text-center font-bold font-Inter mt-2">
                    Por enquanto, a sua solicitação está na fila de
                    processamento!
                  </p>

                  <p className="mt-2 font-black text-blue-600">
                    Fique atento ao email
                  </p>
                </div>
              </div>
            </div>
          )}

          {data?.status === "in_service" && (
            <div className="!w-fit  p-4 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <div className=" !w-fit p-2 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                  <InfoIcon />
                  <p className="text-center font-bold font-Inter mt-2">
                    Sua solicitação está sendo processada! <br /> Em breve
                    entraremos em contato!
                  </p>

                  <p className="mt-2 font-black text-blue-600">
                    Fique atento ao email
                  </p>
                </div>
              </div>
            </div>
          )}

          {data?.status === "delivery" && (
            <div className="!w-fit p-4 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
              <InfoIcon />
              <p className="text-center font-bold font-Inter mt-2">
                Sua solicitação está liberada <br /> para retirada{" "}
                <span className="font-black text-red-500">
                  {" "}
                  presencialmente
                </span>{" "}
                ! <br />
              </p>

              <p className="mt-8 font-Inter text-lg font-black text-blue-600 text-center">
                Para que outra pessoa retire em seu lugar,  é necessário
                apresentar uma procuração. Acesse o modelo aqui:
              </p>

              <a
                className="mt-4 text-center underline bg-black px-2 py-3 rounded-lg text-white font-Inter"
                href="https://drive.google.com/file/d/1JZG_9RhCxZ0lGPLQ8u8w3BN1rF4YAI42/view"
              >
                Link do Modelo <br /> de Procuração Simples!
              </a>
            </div>
          )}

          {data?.status === "finished" && (
            <div className="p-2 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
              <CheckCircleIcon className="text-green-500" />
              <p className="text-center font-bold font-Inter mt-2">
                O processamento do seu <br /> documento já foi finalizado!
              </p>
            </div>
          )}

          {data?.status === "denied" && (
            <div className="">
              <div className="p-2 mb-10 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                <CancelIcon className="text-red-500" />
                <p className="text-center font-bold font-Inter mt-2">
                  Parece que ocorreu um erro <br /> na solicitação do documento.{" "}
                  <br />
                  Leia a observação a baixo!
                </p>
              </div>

              <TextField
                className="w-full "
                label="Observação "
                multiline
                rows={8}
                maxRows={5}
                value={data?.motivo}
                defaultValue="Motivo"
                variant="outlined"
              />
            </div>
          )}

          <div className="my-10 text-center">
            <p className="text-lg">
              Precisa de ajuda? entre em contato conosco!
            </p>
            <p className="font-bold font-Montserrat text-xl">
              arquivo.drecac@gmail.com
            </p>
          </div>
        </div>
      ) : (
        <p>Carregando dados!</p>
      )}
    </>
  );
}
