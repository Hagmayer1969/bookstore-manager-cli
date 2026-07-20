export interface Livro {
  id: number;
  titulo: string;
  autorId: number;
  quantidadeDisponivel: number;
  // Preenchido apenas nas listagens que fazem JOIN com autores.
  // Fica indefinido em criar/atualizar/buscarPorId, que consultam so a tabela livros.
  autorNome?: string;
}