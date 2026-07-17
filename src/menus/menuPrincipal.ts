import promptSync from 'prompt-sync';
import { AutorControlador } from '../controladores/AutorControlador';
import { LivroControlador } from '../controladores/LivroControlador';
import { ClienteControlador } from '../controladores/ClienteControlador';
import { EmprestimoControlador } from '../controladores/EmprestimoControlador';
import { RelatorioControlador } from '../controladores/RelatorioControlador';

export class MenuPrincipal {
  private prompt: ReturnType<typeof promptSync>;
  private autorControlador: AutorControlador;
  private livroControlador: LivroControlador;
  private clienteControlador: ClienteControlador;
  private emprestimoControlador: EmprestimoControlador;
  private relatorioControlador: RelatorioControlador;

  constructor() {
    this.prompt = promptSync();
    this.autorControlador = new AutorControlador();
    this.livroControlador = new LivroControlador();
    this.clienteControlador = new ClienteControlador();
    this.emprestimoControlador = new EmprestimoControlador();
    this.relatorioControlador = new RelatorioControlador();
  }

  private async menuAutores(): Promise<void> {
    let voltando = false;

    while (!voltando) {
      console.log('\n=== Menu Autores ===\n');
      console.log('1. Criar autor');
      console.log('2. Listar autores');
      console.log('3. Atualizar autor');
      console.log('4. Buscar autor por ID');
      console.log('0. Voltar\n');

      const opcao = this.prompt('Escolha uma opcao: ');

      switch (opcao) {
        case '1':
          await this.autorControlador.criar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '2':
          await this.autorControlador.listar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '3':
          await this.autorControlador.atualizar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '4':
          await this.autorControlador.buscarPorId();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '0':
          voltando = true;
          break;
        default:
          console.log('\nOpcao invalida. Tente novamente.\n');
      }
    }
  }

  private async menuLivros(): Promise<void> {
    let voltando = false;

    while (!voltando) {
      console.log('\n=== Menu Livros ===\n');
      console.log('1. Criar livro');
      console.log('2. Listar livros');
      console.log('3. Atualizar livro');
      console.log('4. Buscar livro por ID');
      console.log('5. Deletar livro');
      console.log('6. Listar livros por autor');
      console.log('0. Voltar\n');

      const opcao = this.prompt('Escolha uma opcao: ');

      switch (opcao) {
        case '1':
          await this.livroControlador.criar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '2':
          await this.livroControlador.listar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '3':
          await this.livroControlador.atualizar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '4':
          await this.livroControlador.buscarPorId();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '5':
          await this.livroControlador.deletar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '6':
          await this.livroControlador.listarPorAutor();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '0':
          voltando = true;
          break;
        default:
          console.log('\nOpcao invalida. Tente novamente.\n');
      }
    }
  }

  private async menuClientes(): Promise<void> {
    let voltando = false;

    while (!voltando) {
      console.log('\n=== Menu Clientes ===\n');
      console.log('1. Criar cliente');
      console.log('2. Listar clientes');
      console.log('3. Atualizar cliente');
      console.log('4. Buscar cliente por ID');
      console.log('5. Deletar cliente');
      console.log('0. Voltar\n');

      const opcao = this.prompt('Escolha uma opcao: ');

      switch (opcao) {
        case '1':
          await this.clienteControlador.criar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '2':
          await this.clienteControlador.listar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '3':
          await this.clienteControlador.atualizar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '4':
          await this.clienteControlador.buscarPorId();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '5':
          await this.clienteControlador.deletar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '0':
          voltando = true;
          break;
        default:
          console.log('\nOpcao invalida. Tente novamente.\n');
      }
    }
  }

  private async menuEmprestimos(): Promise<void> {
    let voltando = false;

    while (!voltando) {
      console.log('\n=== Menu Emprestimos ===\n');
      console.log('1. Emprestar livro');
      console.log('2. Devolver livro');
      console.log('3. Listar todos os emprestimos');
      console.log('4. Buscar emprestimo por ID');
      console.log('5. Listar emprestimos ativos');
      console.log('0. Voltar\n');

      const opcao = this.prompt('Escolha uma opcao: ');

      switch (opcao) {
        case '1':
          await this.emprestimoControlador.emprestar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '2':
          await this.emprestimoControlador.devolver();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '3':
          await this.emprestimoControlador.listar();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '4':
          await this.emprestimoControlador.buscarPorId();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '5':
          await this.emprestimoControlador.listarAtivos();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '0':
          voltando = true;
          break;
        default:
          console.log('\nOpcao invalida. Tente novamente.\n');
      }
    }
  }

  private async menuRelatorios(): Promise<void> {
    let voltando = false;

    while (!voltando) {
      console.log('\n=== Menu Relatorios ===\n');
      console.log('1. Livros disponiveis');
      console.log('2. Livros emprestados');
      console.log('3. Livros cadastrados por autor');
      console.log('4. Quantidade de emprestimos por livro');
      console.log('5. Clientes com emprestimos ativos');
      console.log('6. Resumo geral do sistema');
      console.log('7. Top 5 livros mais emprestados');
      console.log('8. Top 5 clientes mais ativos');
      console.log('9. Livros esgotados (quantidade zero)');
      console.log('0. Voltar\n');

      const opcao = this.prompt('Escolha uma opcao: ');

      switch (opcao) {
        case '1':
          await this.relatorioControlador.livrosDisponiveis();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '2':
          await this.relatorioControlador.livrosEmprestados();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '3':
          await this.relatorioControlador.livrosPorAutor();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '4':
          await this.relatorioControlador.emprestimosPorLivro();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '5':
          await this.relatorioControlador.clientesComEmprestimosAtivos();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '6':
          await this.relatorioControlador.resumoGeral();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '7':
          await this.relatorioControlador.livrosMaisEmprestados();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '8':
          await this.relatorioControlador.clientesMaisAtivos();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '9':
          await this.relatorioControlador.livrosComQuantidadeZero();
          this.prompt('Pressione Enter para continuar...');
          break;
        case '0':
          voltando = true;
          break;
        default:
          console.log('\nOpcao invalida. Tente novamente.\n');
      }
    }
  }

  async executar(): Promise<void> {
    let saindo = false;

    while (!saindo) {
      console.log('\n=== BookStore Manager CLI ===\n');
      console.log('1. Autores');
      console.log('2. Livros');
      console.log('3. Clientes');
      console.log('4. Emprestimos');
      console.log('5. Relatorios');
      console.log('0. Sair\n');

      const opcao = this.prompt('Escolha uma opcao: ');

      switch (opcao) {
        case '1':
          await this.menuAutores();
          break;
        case '2':
          await this.menuLivros();
          break;
        case '3':
          await this.menuClientes();
          break;
        case '4':
          await this.menuEmprestimos();
          break;
        case '5':
          await this.menuRelatorios();
          break;
        case '0':
          console.log('Saindo...');
          saindo = true;
          break;
        default:
          console.log('\nOpcao invalida. Tente novamente.\n');
      }
    }
  }
}