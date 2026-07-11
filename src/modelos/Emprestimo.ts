export interface Emprestimo {
  id: number;
  livroId: number;
  clienteId: number;
  dataEmprestimo: Date;
  dataDevolucao?: Date;
}