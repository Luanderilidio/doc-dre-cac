import { CardDocumentProps } from "../components/CardDocument";

export default function CountEmployee(funcionarios: CardDocumentProps[]) {
  // Filtrar os objetos onde o nome do funcionário não é vazio
  const funcionariosFiltrados = funcionarios.filter(
    (funcionario) => funcionario.funcionario?.trim() !== ""
  );

  // Definir explicitamente o tipo do objeto contador para evitar o erro
  const contador: { [key: string]: number } = funcionariosFiltrados.reduce(
    (acc, funcionario) => {
      const nomeFuncionario = funcionario.funcionario!;
      acc[nomeFuncionario] = (acc[nomeFuncionario] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  ); // Especificando o tipo de `acc`

  // Transformar o objeto de contagem em um array de objetos e ordenar do maior para o menor
  const listaContagem = Object.keys(contador).map((nome) => ({
    nome: nome,
    quantidade: contador[nome],
  }));

  // Ordenar pelo campo quantidade de forma decrescente
  listaContagem.sort((a, b) => b.quantidade - a.quantidade);

  return listaContagem;
}
