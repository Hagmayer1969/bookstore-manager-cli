import { Autor } from '../modelos/Autor';
import { AutorRepositorio } from '../repositorios/AutorRepositorio';

export class AutorServico {
  private autorRepositorio: AutorRepositorio;

  constructor() {
    this.autorRepositorio = new AutorRepositorio();
  }

  async criar(autor: Autor): Promise<Autor> {
    this.validar(autor);
    return await this.autorRepositorio.criar(autor);
  }

  async listar(): Promise<Autor[]> {
    return await this.autorRepositorio.listar();
  }

  async atualizar(id: number, autor: Autor): Promise<Autor> {
    if (!id || id <= 0) {
      throw new Error('ID invalido');
    }
    this.validar(autor);
    return await this.autorRepositorio.atualizar(id, autor);
  }

  async buscarPorId(id: number): Promise<Autor> {
    if (!id || id <= 0) {
      throw new Error('ID invalido');
    }
    return await this.autorRepositorio.buscarPorId(id);
  }

  private validar(autor: Autor): void {
    if (!autor.nome || autor.nome.trim() === '') {
      throw new Error('Nome do autor eh obrigatorio');
    }

    if (autor.nome.length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    if (autor.nome.length > 255) {
      throw new Error('Nome nao pode exceder 255 caracteres');
    }

    if (autor.nacionalidade && autor.nacionalidade.trim() !== '') {
      if (autor.nacionalidade.length > 100) {
        throw new Error('Nacionalidade nao pode exceder 100 caracteres');
      }
    }
  }
}