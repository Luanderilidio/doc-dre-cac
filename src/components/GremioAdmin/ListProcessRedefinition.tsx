import { Divider } from "@mui/material";
import { useProcessRedefinitions } from "../../services/ProcessRedefinition";
import CardProcessRedefinition from "./CardProcessRedefinition";

type Props = {
  gremio_id: string;
};

export default function ListProcessRedefinition({ gremio_id }: Props) {
  const { data, isLoading, error } = useProcessRedefinitions(gremio_id);

  if (error) return <>deu pau!</>;
  if (isLoading) return <>Carregando</>;

  console.log('ListProcessRedefinition',data)
  return (
    <div className="flex flex-col gap-3">
      {data?.length !== 0 && (
        <div className="mt-5 mb-3">
          <Divider>Processos Cadastrados</Divider>
        </div>
      )}

      {data?.map((item) => (
        <CardProcessRedefinition data={item} />
      ))}
    </div>
  );
}
