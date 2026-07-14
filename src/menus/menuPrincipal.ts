import promptSync from 'prompt-sync';
import { AutorControlador } from '../controladores/AutorControlador';
import { LivroControlador } from '../controladores/LivroControlador';
import { ClienteControlador } from '../controladores/ClienteControlador';
import { EmprestimoControlador } from '../controladores/EmprestimoControlador';

export class MenuPrincipal {
  private prompt: ReturnType<typeof promptSync>;
  private autorControlador: AutorControlador;
  private livroControlador: LivroControlador;
  private clienteControlador: ClienteControlador;
  private emprestimoControlador: EmprestimoControlador;

  constructor() {
    this.prompt = promptSync();
    this.autorControlador = new AutorControlador();
    this.livroControlador = new LivroControlador();
    this.clienteControlador = new ClienteControlador();
    this.emprestimoControlador = new EmprestimoControlador();
  }

  async executar(): Promise<void> {
    let rodando = true;

    while (rodando) {
      console.clear();
      console.log('================================');
      console.log('  BookStore Manager CLI');
      console.log('================================');
      console.log('');
      console.log('1. Gerenciar Autores');
      console.log('2. Gerenciar Livros');
      console.log('3. Gerenciar Clientes');
      console.log('4. Gerenciar Emprestimos');
      console.log('0. Sair');
      console.log('');

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
        case '0':
          console.log('Encerrando aplicacao. Ate logo!');
          rodando = false;
          break;
        default:
          console.log('Opcao invalida. Tente novamente.');
          this.prompt('Pressione Enter para continuar...');
      }
    }
  }

  private async menuAutores(): Promise<void> {
    let voltando = false;

    while (!voltando) {
      console.clear();
      console.log('=== Gerenciar Autores ===');
      console.log('1. Criar autor');
      console.log('2. Listar autores');
      console.log('3. Atualizar autor');
      console.log('4. Buscar autor por ID');
      console.log('0. Voltar');
      console.log('');

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
          console.log('Opcao invalida.');
          this.prompt('Pressione Enter para continuar...');
      }
    }
  }

  private async menuLivros(): Promise<void> {
    let voltando = false;

    while (!voltando) {
      console.clear();
      console.log('=== Gerenciar Livros ===');
      console.log('1. Criar livro');
      console.log('2. Listar livros');
      console.log('3. Atualizar livro');
      console.log('4. Buscar livro por ID');
      console.log('5. Deletar livro');
      console.log('6. Listar livros por autor');
      console.log('0. Voltar');
      console.log('');

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
          console.log('Opcao invalida.');
          this.prompt('Pressione Enter para continuar...');
      }
    }
  }

  private async menuClientes(): Promise<void> {
    console.clear();
    console.log('=== Gerenciar Clientes ===');
    console.log('1. Criar cliente');
    console.log('2. Listar clientes');
    console.log('3. Atualizar cliente');
    console.log('4. Deletar cliente');
    console.log('5. Buscar cliente por ID');
    console.log('0. Voltar');
    console.log('');

    const opcao = this.prompt('Escolha uma opcao: ');

    switch (opcao) {
      case '1':
        console.log('Criar cliente - Será implementado no DIA 8');
        break;
      case '2':
        console.log('Listar clientes - Será implementado no DIA 8');
        break;
      case '3':
        console.log('Atualizar cliente - Será implementado no DIA 8');
        break;
      case '4':
        console.log('Deletar cliente - Será implementado no DIA 8');
        break;
      case '5':
        console.log('Buscar cliente por ID - Será implementado no DIA 8');
        break;
      case '0':
        return;
      default:
        console.log('Opcao invalida.');
    }

    this.prompt('Pressione Enter para continuar...');
  }

  private async menuEmprestimos(): Promise<void> {
    console.clear();
    console.log('=== Gerenciar Emprestimos ===');
    console.log('1. Emprestar livro');
    console.log('2. Devolver livro');
    console.log('3. Listar emprestimos');
    console.log('4. Buscar emprestimo por ID');
    console.log('0. Voltar');
    console.log('');

    const opcao = this.prompt('Escolha uma opcao: ');

    switch (opcao) {
      case '1':
        console.log('Emprestar livro - Será implementado no DIA 9');
        break;
      case '2':
        console.log('Devolver livro - Será implementado no DIA 9');
        break;
      case '3':
        console.log('Listar emprestimos - Será implementado no DIA 9');
        break;
      case '4':
        console.log('Buscar emprestimo por ID - Será implementado no DIA 9');
        break;
      case '0':
        return;
      default:
        console.log('Opcao invalida.');
    }

    this.prompt('Pressione Enter para continuar...');
  }
}