export interface Emprestimo {
  id: number;
  livroId: number;
  clienteId: number;
  dataEmprestimo: Date;
  dataDevolucao: Date | null;
  // Preenchidos apenas nas consultas que fazem JOIN com livros e clientes
  // (RF12: a listagem deve apresentar informacoes do livro e do cliente).
  livroTitulo?: string;
  clienteNome?: string;
}