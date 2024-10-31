import { Tree, TreeNode } from "react-organizational-chart";
import { contatos } from "./data";

export default function Contatos() {
  const cidades = Array.from(new Set(contatos.map((item) => item.cidade)));

  return (
    <Tree
      lineWidth={"2px"}
      lineColor={"green"}
      lineBorderRadius={"10px"}
      label={<div>Organograma</div>}
    >
      {cidades.map((cidade) => {
        const escolasNaCidade = Array.from(
          new Set(
            contatos
              .filter((item: any) => item.cidade === cidade)
              .map((item: any) => item.escola)
          )
        );

        return (
          <TreeNode label={<div>{cidade}</div>} key={cidade}>
            {escolasNaCidade.map((escola) => {
              const funcionarios = contatos.filter(
                (item: any) => item.cidade === cidade && item.escola === escola
              );

              return (
                <TreeNode label={<div>{escola}</div>} key={escola}>
                  {funcionarios.map((func) => (
                    <TreeNode
                      key={func.nome + func.funcao}
                      label={
                        <div>
                          <strong>{func.funcao}</strong>: {func.nome}
                          <br />
                          Contato: {func.contato}
                          <br />
                          Email: {func.email}
                        </div>
                      }
                    />
                  ))}
                </TreeNode>
              );
            })}
          </TreeNode>
        );
      })}
    </Tree>
  );
}
