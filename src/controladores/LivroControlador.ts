
import promptSync from 'prompt-sync';
import { Livro } from '../modelos/Livro';
import { LivroServico } from '../servicos/LivroServico';

export class LivroControlador {
  private prompt: ReturnType<typeof promptSync>;
  private livroServico: LivroServico;

  constructor() {
    this.prompt = promptSync();
    this.livroServico = new LivroServico();
  }

  async criar(): Promise<void> {
    try {
      console.log('\n=== Criar Novo Livro ===\n');

      const titulo = this.prompt('Digite o titulo do livro: ');
      const autorIdStr = this.prompt('Digite o ID do autor: ');
      const quantidadeStr = this.prompt('Digite a quantidade disponivel: ');

      const autorId = parseInt(autorIdStr, 10);
      const quantidade = parseInt(quantidadeStr, 10);

      if (isNaN(autorId)) {
        console.error('\nID do autor deve ser um numero valido.\n');
        return;
      }

      if (isNaN(quantidade)) {
        console.error('\nQuantidade deve ser um numero valido.\n');
        return;
      }

      const novoLivro: Livro = {
        id: 0,
        titulo: titulo,
        autorId: autorId,
        quantidadeDisponivel: quantidade,
      };

      const livroCriado = await this.livroServico.criar(novoLivro);
      console.log(`\nLivro criado com sucesso!`);
      console.log(`ID: ${livroCriado.id}`);
      console.log(`Titulo: ${livroCriado.titulo}`);
      console.log(`Autor ID: ${livroCriado.autorId}`);
      console.log(`Quantidade: ${livroCriado.quantidadeDisponivel}\n`);
    } catch (erro) {
      console.error(`\nErro ao criar livro: ${(erro as Error).message}\n`);
    }
  }

  async listar(): Promise<void> {
    try {
      console.log('\n=== Lista de Livros ===\n');

      const livros = await this.livroServico.listar();

      if (livros.length === 0) {
        console.log('Nenhum livro cadastrado.\n');
        return;
      }

      livros.forEach((livro, index) => {
        console.log(`${index + 1}. ${livro.titulo} (Autor ID: ${livro.autorId}, Quantidade: ${livro.quantidadeDisponivel})`);
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar livros: ${(erro as Error).message}\n`);
    }
  }

  async atualizar(): Promise<void> {
    try {
      console.log('\n=== Atualizar Livro ===\n');

      const idStr = this.prompt('Digite o ID do livro a atualizar: ');
      const id = parseInt(idStr, 10);

      if (isNaN(id)) {
        console.error('\nID deve ser um numero valido.\n');
        return;
      }

      const titulo = this.prompt('Digite o novo titulo: ');
      const autorIdStr = this.prompt('Digite o novo ID do autor: ');
      const quantidadeStr = this.prompt('Digite a nova quantidade: ');

      const autorId = parseInt(autorIdStr, 10);
      const quantidade = parseInt(quantidadeStr, 10);

      if (isNaN(autorId)) {
        console.error('\nID do autor deve ser um numero valido.\n');
        return;
      }

      if (isNaN(quantidade)) {
        console.error('\nQuantidade deve ser um numero valido.\n');
        return;
      }

      const livroAtualizado: Livro = {
        id: id,
        titulo: titulo,
        autorId: autorId,
        quantidadeDisponivel: quantidade,
      };

      const resultado = await this.livroServico.atualizar(id, livroAtualizado);
      console.log(`\nLivro atualizado com sucesso!`);
      console.log(`Titulo: ${resultado.titulo}`);
      console.log(`Autor ID: ${resultado.autorId}`);
      console.log(`Quantidade: ${resultado.quantidadeDisponivel}\n`);
    } catch (erro) {
      console.error(`\nErro ao atualizar livro: ${(erro as Error).message}\n`);
    }
  }

  async buscarPorId(): Promise<void> {
    try {
      console.log('\n=== Buscar Livro por ID ===\n');

      const idStr = this.prompt('Digite o ID do livro: ');
      const id = parseInt(idStr, 10);

      if (isNaN(id)) {
        console.error('\nID deve ser um numero valido.\n');
        return;
      }

      const livro = await this.livroServico.buscarPorId(id);
      console.log(`\nLivro encontrado:`);
      console.log(`ID: ${livro.id}`);
      console.log(`Titulo: ${livro.titulo}`);
      console.log(`Autor ID: ${livro.autorId}`);
      console.log(`Quantidade: ${livro.quantidadeDisponivel}\n`);
    } catch (erro) {
      console.error(`\nErro ao buscar livro: ${(erro as Error).message}\n`);
    }
  }

  async deletar(): Promise<void> {
    try {
      console.log('\n=== Deletar Livro ===\n');

      const idStr = this.prompt('Digite o ID do livro a deletar: ');
      const id = parseInt(idStr, 10);

      if (isNaN(id)) {
        console.error('\nID deve ser um numero valido.\n');
        return;
      }

      const confirmacao = this.prompt('Tem certeza que deseja deletar? (s/n): ');

      if (confirmacao.toLowerCase() !== 's') {
        console.log('Operacao cancelada.\n');
        return;
      }

      await this.livroServico.deletar(id);
      console.log(`\nLivro deletado com sucesso!\n`);
    } catch (erro) {
      console.error(`\nErro ao deletar livro: ${(erro as Error).message}\n`);
    }
  }

  async listarPorAutor(): Promise<void> {
    try {
      console.log('\n=== Listar Livros por Autor ===\n');

      const autorIdStr = this.prompt('Digite o ID do autor: ');
      const autorId = parseInt(autorIdStr, 10);

      if (isNaN(autorId)) {
        console.error('\nID do autor deve ser um numero valido.\n');
        return;
      }

      const livros = await this.livroServico.buscarPorAutor(autorId);

      if (livros.length === 0) {
        console.log('Nenhum livro cadastrado para este autor.\n');
        return;
      }

      livros.forEach((livro, index) => {
        console.log(`${index + 1}. ${livro.titulo} (Autor ID: ${livro.autorId}, Quantidade: ${livro.quantidadeDisponivel})`);
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar livros por autor: ${(erro as Error).message}\n`);
    }
  }
}
