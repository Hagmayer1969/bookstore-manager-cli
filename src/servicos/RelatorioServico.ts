import { RelatorioRepositorio } from '../repositorios/RelatorioRepositorio';
import {
  ResumoGeral,
  LivroComAutor,
  LivroEmprestado,
  LivrosPorAutor,
  EmprestimosPorLivro,
  ClienteComEmprestimoAtivo,
  ClienteRanking,
} from '../modelos/Relatorio';

export class RelatorioServico {
  private relatorioRepositorio: RelatorioRepositorio;

  constructor() {
    this.relatorioRepositorio = new RelatorioRepositorio();
  }

  async resumoGeral(): Promise<ResumoGeral> {
    return await this.relatorioRepositorio.resumoGeral();
  }

  // O total de devolvidos eh derivado aqui, e nao no banco nem na exibicao.
  calcularEmprestimosDevolvidos(resumo: ResumoGeral): number {
    return resumo.totalEmprestimos - resumo.emprestimosAtivos;
  }

  async livrosDisponiveis(): Promise<LivroComAutor[]> {
    return await this.relatorioRepositorio.livrosDisponiveis();
  }

  async livrosEmprestados(): Promise<LivroEmprestado[]> {
    return await this.relatorioRepositorio.livrosEmprestados();
  }

  async livrosPorAutor(): Promise<LivrosPorAutor[]> {
    return await this.relatorioRepositorio.livrosPorAutor();
  }

  async emprestimosPorLivro(): Promise<EmprestimosPorLivro[]> {
    return await this.relatorioRepositorio.emprestimosPorLivro();
  }

  async clientesComEmprestimosAtivos(): Promise<ClienteComEmprestimoAtivo[]> {
    return await this.relatorioRepositorio.clientesComEmprestimosAtivos();
  }

  async livrosMaisEmprestados(): Promise<EmprestimosPorLivro[]> {
    return await this.relatorioRepositorio.livrosMaisEmprestados();
  }

  async clientesMaisAtivos(): Promise<ClienteRanking[]> {
    return await this.relatorioRepositorio.clientesMaisAtivos();
  }

  async livrosComQuantidadeZero(): Promise<LivroComAutor[]> {
    return await this.relatorioRepositorio.livrosComQuantidadeZero();
  }
}
