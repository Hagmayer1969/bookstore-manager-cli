import { Livro } from '../modelos/Livro';
import { LivroRepositorio } from '../repositorios/LivroRepositorio';
import { AutorRepositorio } from '../repositorios/AutorRepositorio';

export class LivroServico {
  private livroRepositorio: LivroRepositorio;
  private autorRepositorio: AutorRepositorio;

  constructor() {
    this.livroRepositorio = new LivroRepositorio();
    this.autorRepositorio = new AutorRepositorio();
  }

  async criar(livro: Livro): Promise<Livro> {
    this.validar(livro);
    await this.validarAutorExiste(livro.autorId);
    return await this.livroRepositorio.criar(livro);
  }

  async listar(): Promise<Livro[]> {
    return await this.livroRepositorio.listar();
  }

  async atualizar(id: number, livro: Livro): Promise<Livro> {
    if (!id || id <= 0) {
      throw new Error('ID invalido');
    }
    this.validar(livro);
    await this.validarAutorExiste(livro.autorId);
    return await this.livroRepositorio.atualizar(id, livro);
  }

  async buscarPorId(id: number): Promise<Livro> {
    if (!id || id <= 0) {
      throw new Error('ID invalido');
    }
    return await this.livroRepositorio.buscarPorId(id);
  }

  async deletar(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('ID invalido');
    }
    return await this.livroRepositorio.deletar(id);
  }

  async buscarPorAutor(autorId: number): Promise<Livro[]> {
    if (!autorId || autorId <= 0) {
      throw new Error('ID do autor invalido');
    }
    await this.validarAutorExiste(autorId);
    return await this.livroRepositorio.buscarPorAutor(autorId);
  }

  private validar(livro: Livro): void {
    // Validacoes do titulo
    if (!livro.titulo || livro.titulo.trim() === '') {
      throw new Error('Titulo do livro eh obrigatorio');
    }

    if (livro.titulo.length < 3) {
      throw new Error('Titulo deve ter pelo menos 3 caracteres');
    }

    if (livro.titulo.length > 255) {
      throw new Error('Titulo nao pode exceder 255 caracteres');
    }

    // Validacoes do autorId
    if (!livro.autorId || livro.autorId <= 0) {
      throw new Error('ID do autor eh obrigatorio e deve ser positivo');
    }

    // Validacoes da quantidade
    if (livro.quantidadeDisponivel === undefined || livro.quantidadeDisponivel === null) {
      throw new Error('Quantidade disponivel eh obrigatoria');
    }

    if (!Number.isInteger(livro.quantidadeDisponivel)) {
      throw new Error('Quantidade deve ser um numero inteiro');
    }

    if (livro.quantidadeDisponivel < 0) {
      throw new Error('Quantidade nao pode ser negativa');
    }

    if (livro.quantidadeDisponivel > 9999) {
      throw new Error('Quantidade nao pode exceder 9999');
    }
  }

  private async validarAutorExiste(autorId: number): Promise<void> {
    try {
      await this.autorRepositorio.buscarPorId(autorId);
    } catch (erro) {
      throw new Error(`Autor com id ${autorId} nao existe. Livro nao pode ser criado sem um autor valido`);
    }
  }
}