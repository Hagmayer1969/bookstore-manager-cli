import { Cliente } from '../modelos/Cliente';
import { ClienteRepositorio } from '../repositorios/ClienteRepositorio';

export class ClienteServico {
  private clienteRepositorio: ClienteRepositorio;

  constructor() {
    this.clienteRepositorio = new ClienteRepositorio();
  }

  async criar(cliente: Cliente): Promise<Cliente> {
    this.validar(cliente);
    await this.validarEmailUnico(cliente.email);
    return await this.clienteRepositorio.criar(cliente);
  }

  async listar(): Promise<Cliente[]> {
    return await this.clienteRepositorio.listar();
  }

  async atualizar(id: number, cliente: Cliente): Promise<Cliente> {
    if (!id || id <= 0) {
      throw new Error('ID invalido');
    }
    this.validar(cliente);
    await this.validarEmailUnico(cliente.email, id);
    return await this.clienteRepositorio.atualizar(id, cliente);
  }

  async buscarPorId(id: number): Promise<Cliente> {
    if (!id || id <= 0) {
      throw new Error('ID invalido');
    }
    return await this.clienteRepositorio.buscarPorId(id);
  }

  async deletar(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('ID invalido');
    }
    return await this.clienteRepositorio.deletar(id);
  }

  private validar(cliente: Cliente): void {
    // Validacoes do nome
    if (!cliente.nome || cliente.nome.trim() === '') {
      throw new Error('Nome do cliente eh obrigatorio');
    }

    if (cliente.nome.length < 3) {
      throw new Error('Nome deve ter pelo menos 3 caracteres');
    }

    if (cliente.nome.length > 255) {
      throw new Error('Nome nao pode exceder 255 caracteres');
    }

    // Validacoes do email
    if (!cliente.email || cliente.email.trim() === '') {
      throw new Error('Email do cliente eh obrigatorio');
    }

    if (cliente.email.length > 255) {
      throw new Error('Email nao pode exceder 255 caracteres');
    }
  }

  private async validarEmailUnico(email: string, idAtualizar?: number): Promise<void> {
    const clienteExistente = await this.clienteRepositorio.buscarPorEmail(email);

    if (clienteExistente !== null) {
      // Se está atualizando e o email é do mesmo cliente, ok
      if (idAtualizar && clienteExistente.id === idAtualizar) {
        return;
      }
      throw new Error(`Email ${email} ja esta cadastrado para outro cliente`);
    }
  }
}