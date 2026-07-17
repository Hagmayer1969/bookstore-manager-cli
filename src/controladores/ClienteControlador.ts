import promptSync from 'prompt-sync';
import { Cliente } from '../modelos/Cliente';
import { ClienteServico } from '../servicos/ClienteServico';

export class ClienteControlador {
  private prompt: ReturnType<typeof promptSync>;
  private clienteServico: ClienteServico;

  constructor() {
    this.prompt = promptSync();
    this.clienteServico = new ClienteServico();
  }

  async criar(): Promise<void> {
    try {
      console.log('\n=== Criar Novo Cliente ===\n');

      const nome = this.prompt('Digite o nome do cliente: ');
      const email = this.prompt('Digite o email do cliente: ');

      const novoCliente: Cliente = {
        id: 0,
        nome: nome,
        email: email,
      };

      const clienteCriado = await this.clienteServico.criar(novoCliente);
      console.log(`\nCliente criado com sucesso!`);
      console.log(`ID: ${clienteCriado.id}`);
      console.log(`Nome: ${clienteCriado.nome}`);
      console.log(`Email: ${clienteCriado.email}\n`);
    } catch (erro) {
      console.error(`\nErro ao criar cliente: ${(erro as Error).message}\n`);
    }
  }

  async listar(): Promise<void> {
    try {
      console.log('\n=== Lista de Clientes ===\n');

      const clientes = await this.clienteServico.listar();

      if (clientes.length === 0) {
        console.log('Nenhum cliente cadastrado.\n');
        return;
      }

      clientes.forEach((cliente, index) => {
        console.log(`${index + 1}. ${cliente.nome} (${cliente.email})`);
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar clientes: ${(erro as Error).message}\n`);
    }
  }

  async atualizar(): Promise<void> {
    try {
      console.log('\n=== Atualizar Cliente ===\n');

      const idStr = this.prompt('Digite o ID do cliente a atualizar: ');
      const id = parseInt(idStr, 10);

      if (isNaN(id)) {
        console.error('\nID deve ser um numero valido.\n');
        return;
      }

      const nome = this.prompt('Digite o novo nome: ');
      const email = this.prompt('Digite o novo email: ');

      const clienteAtualizado: Cliente = {
        id: id,
        nome: nome,
        email: email,
      };

      const resultado = await this.clienteServico.atualizar(id, clienteAtualizado);
      console.log(`\nCliente atualizado com sucesso!`);
      console.log(`Nome: ${resultado.nome}`);
      console.log(`Email: ${resultado.email}\n`);
    } catch (erro) {
      console.error(`\nErro ao atualizar cliente: ${(erro as Error).message}\n`);
    }
  }

  async buscarPorId(): Promise<void> {
    try {
      console.log('\n=== Buscar Cliente por ID ===\n');

      const idStr = this.prompt('Digite o ID do cliente: ');
      const id = parseInt(idStr, 10);

      if (isNaN(id)) {
        console.error('\nID deve ser um numero valido.\n');
        return;
      }

      const cliente = await this.clienteServico.buscarPorId(id);
      console.log(`\nCliente encontrado:`);
      console.log(`ID: ${cliente.id}`);
      console.log(`Nome: ${cliente.nome}`);
      console.log(`Email: ${cliente.email}\n`);
    } catch (erro) {
      console.error(`\nErro ao buscar cliente: ${(erro as Error).message}\n`);
    }
  }

  async deletar(): Promise<void> {
    try {
      console.log('\n=== Deletar Cliente ===\n');

      const idStr = this.prompt('Digite o ID do cliente a deletar: ');
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

      await this.clienteServico.deletar(id);
      console.log(`\nCliente deletado com sucesso!\n`);
    } catch (erro) {
      console.error(`\nErro ao deletar cliente: ${(erro as Error).message}\n`);
    }
  }
}
