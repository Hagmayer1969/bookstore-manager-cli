import { Autor } from '../modelos/Autor';
import { AutorRepositorio } from '../repositorios/AutorRepositorio';

export class AutorServico {
  private autorRepositorio: AutorRepositorio;

  constructor() {
    this.autorRepositorio = new AutorRepositorio();
  }

  async criar(autor: Autor): Promise<Autor> {
    const autorNormalizado = this.normalizar(autor);
    this.validar(autorNormalizado);
    await this.validarNomeUnico(autorNormalizado.nome);
    return await this.autorRepositorio.criar(autorNormalizado);
  }

  async listar(): Promise<Autor[]> {
    return await this.autorRepositorio.listar();
  }

  async atualizar(id: number, autor: Autor): Promise<Autor> {
    if (!id || id <= 0) {
      throw new Error('ID invalido');
    }
    const autorNormalizado = this.normalizar(autor);
    this.validar(autorNormalizado);
    await this.validarNomeUnico(autorNormalizado.nome, id);
    return await this.autorRepositorio.atualizar(id, autorNormalizado);
  }

  async buscarPorId(id: number): Promise<Autor> {
    if (!id || id <= 0) {
      throw new Error('ID invalido');
    }
    return await this.autorRepositorio.buscarPorId(id);
  }

  // Remove espacos das pontas antes de validar e gravar: sem isso
  // "machado de assis" e "machado de assis " viram autores distintos.
  private normalizar(autor: Autor): Autor {
    return {
      ...autor,
      nome: (autor.nome ?? '').trim(),
      nacionalidade: autor.nacionalidade?.trim(),
    };
  }

  private async validarNomeUnico(nome: string, idIgnorado?: number): Promise<void> {
    const existente = await this.autorRepositorio.buscarPorNome(nome);

    if (existente && existente.id !== idIgnorado) {
      throw new Error(`Ja existe um autor cadastrado com o nome "${nome}"`);
    }
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