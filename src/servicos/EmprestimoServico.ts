import { Emprestimo } from '../modelos/Emprestimo';
import { EmprestimoRepositorio } from '../repositorios/EmprestimoRepositorio';
import { LivroRepositorio } from '../repositorios/LivroRepositorio';
import { ClienteRepositorio } from '../repositorios/ClienteRepositorio';

export class EmprestimoServico {
  private emprestimoRepositorio: EmprestimoRepositorio;
  private livroRepositorio: LivroRepositorio;
  private clienteRepositorio: ClienteRepositorio;

  constructor() {
    this.emprestimoRepositorio = new EmprestimoRepositorio();
    this.livroRepositorio = new LivroRepositorio();
    this.clienteRepositorio = new ClienteRepositorio();
  }

  async emprestar(emprestimo: Emprestimo): Promise<Emprestimo> {
    this.validarEmprestimo(emprestimo);
    await this.validarLivroExiste(emprestimo.livroId);
    await this.validarClienteExiste(emprestimo.clienteId);
    await this.validarLivroDisponivel(emprestimo.livroId);
    return await this.emprestimoRepositorio.emprestar(emprestimo);
  }

  async devolver(emprestimoId: number, dataDevolucao: Date): Promise<Emprestimo> {
    if (!emprestimoId || emprestimoId <= 0) {
      throw new Error('ID do emprestimo invalido');
    }

    if (!dataDevolucao || isNaN(dataDevolucao.getTime())) {
      throw new Error('Data de devolucao invalida');
    }

    const emprestimo = await this.emprestimoRepositorio.buscarPorId(emprestimoId);

    if (emprestimo.dataDevolucao !== null) {
      throw new Error(`Emprestimo com id ${emprestimoId} ja foi devolvido em ${emprestimo.dataDevolucao}`);
    }

    return await this.emprestimoRepositorio.devolver(emprestimoId, dataDevolucao);
  }

  async listar(): Promise<Emprestimo[]> {
    return await this.emprestimoRepositorio.listar();
  }

  async buscarPorId(id: number): Promise<Emprestimo> {
    if (!id || id <= 0) {
      throw new Error('ID invalido');
    }
    return await this.emprestimoRepositorio.buscarPorId(id);
  }

  async listarAtivos(): Promise<Emprestimo[]> {
    return await this.emprestimoRepositorio.listarAtivos();
  }

  private validarEmprestimo(emprestimo: Emprestimo): void {
    if (!emprestimo.livroId || emprestimo.livroId <= 0) {
      throw new Error('ID do livro invalido');
    }

    if (!emprestimo.clienteId || emprestimo.clienteId <= 0) {
      throw new Error('ID do cliente invalido');
    }

    if (!emprestimo.dataEmprestimo) {
      throw new Error('Data de emprestimo eh obrigatoria');
    }

    if (isNaN(emprestimo.dataEmprestimo.getTime())) {
      throw new Error('Data de emprestimo invalida');
    }

    if (emprestimo.dataDevolucao !== null) {
      throw new Error('Data de devolucao deve ser nula ao emprestar');
    }
  }

  private async validarLivroExiste(livroId: number): Promise<void> {
    const existe = await this.livroRepositorio.existePorId(livroId);
    if (!existe) {
      throw new Error(`Livro com id ${livroId} nao existe`);
    }
  }

  private async validarClienteExiste(clienteId: number): Promise<void> {
    try {
      await this.clienteRepositorio.buscarPorId(clienteId);
    } catch (erro) {
      throw new Error(`Cliente com id ${clienteId} nao existe`);
    }
  }

  private async validarLivroDisponivel(livroId: number): Promise<void> {
    const livro = await this.livroRepositorio.buscarPorId(livroId);

    if (livro.quantidadeDisponivel <= 0) {
      throw new Error(`Livro com id ${livroId} nao tem quantidade disponivel`);
    }
  }
}
