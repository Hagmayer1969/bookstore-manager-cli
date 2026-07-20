import { RelatorioServico } from '../servicos/RelatorioServico';
import { formatarDataParaExibicao } from '../utilitarios/DataUtil';

export class RelatorioControlador {
  private relatorioServico: RelatorioServico;

  constructor() {
    this.relatorioServico = new RelatorioServico();
  }

  async resumoGeral(): Promise<void> {
    try {
      console.log('\n=== Resumo Geral do Sistema ===\n');

      const resumo = await this.relatorioServico.resumoGeral();

      console.log(`Total de Autores: ${resumo.totalAutores}`);
      console.log(`Total de Livros: ${resumo.totalLivros}`);
      console.log(`Total de Clientes: ${resumo.totalClientes}`);
      console.log(`Total de Emprestimos: ${resumo.totalEmprestimos}`);
      console.log(`Emprestimos Ativos: ${resumo.emprestimosAtivos}`);
      console.log(`Emprestimos Devolvidos: ${this.relatorioServico.calcularEmprestimosDevolvidos(resumo)}\n`);
    } catch (erro) {
      console.error(`\nErro ao gerar resumo: ${(erro as Error).message}\n`);
    }
  }

  async livrosDisponiveis(): Promise<void> {
    try {
      console.log('\n=== Livros Disponiveis ===\n');

      const livros = await this.relatorioServico.livrosDisponiveis();

      if (livros.length === 0) {
        console.log('Nenhum livro disponivel no momento.\n');
        return;
      }

      livros.forEach((livro, index) => {
        console.log(
          `${index + 1}. ${livro.titulo} (${livro.autor}) - ${livro.quantidadeDisponivel} disponivel(is)`
        );
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar livros disponiveis: ${(erro as Error).message}\n`);
    }
  }

  async livrosEmprestados(): Promise<void> {
    try {
      console.log('\n=== Livros Emprestados (Nao Devolvidos) ===\n');

      const livros = await this.relatorioServico.livrosEmprestados();

      if (livros.length === 0) {
        console.log('Nenhum livro emprestado no momento.\n');
        return;
      }

      livros.forEach((livro, index) => {
        console.log(
          `${index + 1}. ${livro.titulo} - com ${livro.cliente} desde ${formatarDataParaExibicao(livro.dataEmprestimo)}`
        );
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar livros emprestados: ${(erro as Error).message}\n`);
    }
  }

  async livrosPorAutor(): Promise<void> {
    try {
      console.log('\n=== Livros Cadastrados por Autor ===\n');

      const autores = await this.relatorioServico.livrosPorAutor();

      if (autores.length === 0) {
        console.log('Nenhum autor cadastrado.\n');
        return;
      }

      autores.forEach((autor, index) => {
        console.log(`${index + 1}. ${autor.autor}: ${autor.totalLivros} livro(s)`);
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar livros por autor: ${(erro as Error).message}\n`);
    }
  }

  async emprestimosPorLivro(): Promise<void> {
    try {
      console.log('\n=== Quantidade de Emprestimos por Livro ===\n');

      const livros = await this.relatorioServico.emprestimosPorLivro();

      if (livros.length === 0) {
        console.log('Nenhum livro cadastrado.\n');
        return;
      }

      livros.forEach((livro, index) => {
        console.log(`${index + 1}. ${livro.titulo}: ${livro.totalEmprestimos} emprestimo(s)`);
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar emprestimos por livro: ${(erro as Error).message}\n`);
    }
  }

  async clientesComEmprestimosAtivos(): Promise<void> {
    try {
      console.log('\n=== Clientes com Emprestimos Ativos ===\n');

      const clientes = await this.relatorioServico.clientesComEmprestimosAtivos();

      if (clientes.length === 0) {
        console.log('Nenhum cliente com emprestimo ativo.\n');
        return;
      }

      clientes.forEach((cliente, index) => {
        console.log(
          `${index + 1}. ${cliente.nome} (${cliente.email}): ${cliente.emprestimosAtivos} ativo(s)`
        );
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar clientes ativos: ${(erro as Error).message}\n`);
    }
  }

  async livrosMaisEmprestados(): Promise<void> {
    try {
      console.log('\n=== Top 5 Livros Mais Emprestados ===\n');

      const livros = await this.relatorioServico.livrosMaisEmprestados();

      if (livros.length === 0) {
        console.log('Nenhum emprestimo registrado.\n');
        return;
      }

      livros.forEach((livro, index) => {
        console.log(`${index + 1}. ${livro.titulo}: ${livro.totalEmprestimos} emprestimo(s)`);
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar livros mais emprestados: ${(erro as Error).message}\n`);
    }
  }

  async clientesMaisAtivos(): Promise<void> {
    try {
      console.log('\n=== Top 5 Clientes Mais Ativos ===\n');

      const clientes = await this.relatorioServico.clientesMaisAtivos();

      if (clientes.length === 0) {
        console.log('Nenhum emprestimo registrado.\n');
        return;
      }

      clientes.forEach((cliente, index) => {
        console.log(
          `${index + 1}. ${cliente.nome} (${cliente.email}): ${cliente.totalEmprestimos} emprestimo(s)`
        );
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar clientes mais ativos: ${(erro as Error).message}\n`);
    }
  }

  async livrosComQuantidadeZero(): Promise<void> {
    try {
      console.log('\n=== Livros Esgotados (Quantidade Zero) ===\n');

      const livros = await this.relatorioServico.livrosComQuantidadeZero();

      if (livros.length === 0) {
        console.log('Nenhum livro esgotado.\n');
        return;
      }

      livros.forEach((livro, index) => {
        console.log(`${index + 1}. ${livro.titulo} (${livro.autor})`);
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar livros esgotados: ${(erro as Error).message}\n`);
    }
  }
}
