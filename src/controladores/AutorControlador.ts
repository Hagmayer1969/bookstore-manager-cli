import promptSync from 'prompt-sync';
import { Autor } from '../modelos/Autor';
import { AutorServico } from '../servicos/AutorServico';

export class AutorControlador {
  private prompt: ReturnType<typeof promptSync>;
  private autorServico: AutorServico;

  constructor() {
    this.prompt = promptSync();
    this.autorServico = new AutorServico();
  }

  async criar(): Promise<void> {
    try {
      console.log('\n=== Criar Novo Autor ===\n');

      const nome = this.prompt('Digite o nome do autor: ');
      const nacionalidade = this.prompt('Digite a nacionalidade (opcional): ');

      const novoAutor: Autor = {
        id: 0,
        nome: nome,
        nacionalidade: nacionalidade || undefined,
      };

      const autorCriado = await this.autorServico.criar(novoAutor);
      console.log(`\nAutor criado com sucesso!`);
      console.log(`ID: ${autorCriado.id}`);
      console.log(`Nome: ${autorCriado.nome}`);
      console.log(`Nacionalidade: ${autorCriado.nacionalidade || 'Não informada'}\n`);
    } catch (erro) {
      console.error(`\nErro ao criar autor: ${(erro as Error).message}\n`);
    }
  }

  async listar(): Promise<void> {
    try {
      console.log('\n=== Lista de Autores ===\n');

      const autores = await this.autorServico.listar();

      if (autores.length === 0) {
        console.log('Nenhum autor cadastrado.\n');
        return;
      }

      autores.forEach((autor, index) => {
        console.log(`${index + 1}. ${autor.nome} (${autor.nacionalidade || 'Sem nacionalidade'})`);
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar autores: ${(erro as Error).message}\n`);
    }
  }

  async atualizar(): Promise<void> {
    try {
      console.log('\n=== Atualizar Autor ===\n');

      const idStr = this.prompt('Digite o ID do autor a atualizar: ');
      const id = parseInt(idStr, 10);

      if (isNaN(id)) {
        console.error('\nID deve ser um número válido.\n');
        return;
      }

      const nome = this.prompt('Digite o novo nome: ');
      const nacionalidade = this.prompt('Digite a nova nacionalidade (opcional): ');

      const autorAtualizado: Autor = {
        id: id,
        nome: nome,
        nacionalidade: nacionalidade || undefined,
      };

      const resultado = await this.autorServico.atualizar(id, autorAtualizado);
      console.log(`\nAutor atualizado com sucesso!`);
      console.log(`Nome: ${resultado.nome}`);
      console.log(`Nacionalidade: ${resultado.nacionalidade || 'Não informada'}\n`);
    } catch (erro) {
      console.error(`\nErro ao atualizar autor: ${(erro as Error).message}\n`);
    }
  }

  async buscarPorId(): Promise<void> {
    try {
      console.log('\n=== Buscar Autor por ID ===\n');

      const idStr = this.prompt('Digite o ID do autor: ');
      const id = parseInt(idStr, 10);

      if (isNaN(id)) {
        console.error('\nID deve ser um número válido.\n');
        return;
      }

      const autor = await this.autorServico.buscarPorId(id);
      console.log(`\nAutor encontrado:`);
      console.log(`ID: ${autor.id}`);
      console.log(`Nome: ${autor.nome}`);
      console.log(`Nacionalidade: ${autor.nacionalidade || 'Não informada'}\n`);
    } catch (erro) {
      console.error(`\nErro ao buscar autor: ${(erro as Error).message}\n`);
    }
  }
}
