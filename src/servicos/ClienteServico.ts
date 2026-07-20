import { Cliente } from '../modelos/Cliente';
import { ClienteRepositorio } from '../repositorios/ClienteRepositorio';
import { EmprestimoRepositorio } from '../repositorios/EmprestimoRepositorio';

export class ClienteServico {
  private clienteRepositorio: ClienteRepositorio;
  private emprestimoRepositorio: EmprestimoRepositorio;

  constructor() {
    this.clienteRepositorio = new ClienteRepositorio();
    this.emprestimoRepositorio = new EmprestimoRepositorio();
  }

  async criar(cliente: Cliente): Promise<Cliente> {
    const clienteNormalizado = this.normalizar(cliente);
    this.validar(clienteNormalizado);
    await this.validarEmailUnico(clienteNormalizado.email);
    return await this.clienteRepositorio.criar(clienteNormalizado);
  }

  async listar(): Promise<Cliente[]> {
    return await this.clienteRepositorio.listar();
  }

  async atualizar(id: number, cliente: Cliente): Promise<Cliente> {
    if (!id || id <= 0) {
      throw new Error('ID invalido');
    }
    const clienteNormalizado = this.normalizar(cliente);
    this.validar(clienteNormalizado);
    await this.validarEmailUnico(clienteNormalizado.email, id);
    return await this.clienteRepositorio.atualizar(id, clienteNormalizado);
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

    const emprestimos = await this.emprestimoRepositorio.contarPorCliente(id);
    if (emprestimos > 0) {
      throw new Error(
        `Cliente nao pode ser removido: existe(m) ${emprestimos} emprestimo(s) registrado(s) para ele`
      );
    }

    return await this.clienteRepositorio.deletar(id);
  }

  // Email em minusculas para que a checagem de unicidade nao deixe passar
  // "Joca@Gmail.com" e "joca@gmail.com" como clientes diferentes.
  private normalizar(cliente: Cliente): Cliente {
    return {
      ...cliente,
      nome: (cliente.nome ?? '').trim(),
      email: (cliente.email ?? '').trim().toLowerCase(),
    };
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

    // Formato minimo: algo@algo.algo, sem espacos.
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoEmail.test(cliente.email)) {
      throw new Error('Email invalido. Use o formato nome@dominio.com');
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