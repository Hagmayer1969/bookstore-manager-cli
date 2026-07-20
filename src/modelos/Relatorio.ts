export interface ResumoGeral {
  totalAutores: number;
  totalLivros: number;
  totalClientes: number;
  totalEmprestimos: number;
  emprestimosAtivos: number;
}

export interface LivroComAutor {
  id: number;
  titulo: string;
  autor: string;
  quantidadeDisponivel: number;
}

export interface LivroEmprestado {
  titulo: string;
  cliente: string;
  dataEmprestimo: Date;
}

export interface LivrosPorAutor {
  autor: string;
  totalLivros: number;
}

export interface EmprestimosPorLivro {
  titulo: string;
  totalEmprestimos: number;
}

export interface ClienteComEmprestimoAtivo {
  nome: string;
  email: string;
  emprestimosAtivos: number;
}

export interface ClienteRanking {
  nome: string;
  email: string;
  totalEmprestimos: number;
}
