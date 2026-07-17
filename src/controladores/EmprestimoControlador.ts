import promptSync from 'prompt-sync';
import { Emprestimo } from '../modelos/Emprestimo';
import { EmprestimoServico } from '../servicos/EmprestimoServico';

export class EmprestimoControlador {
  private prompt: ReturnType<typeof promptSync>;
  private emprestimoServico: EmprestimoServico;

  constructor() {
    this.prompt = promptSync();
    this.emprestimoServico = new EmprestimoServico();
  }

  async emprestar(): Promise<void> {
    try {
      console.log('\n=== Emprestar Livro ===\n');

      const livroIdStr = this.prompt('Digite o ID do livro: ');
      const livroId = parseInt(livroIdStr, 10);

      if (isNaN(livroId)) {
        console.error('\nID do livro deve ser um numero valido.\n');
        return;
      }

      const clienteIdStr = this.prompt('Digite o ID do cliente: ');
      const clienteId = parseInt(clienteIdStr, 10);

      if (isNaN(clienteId)) {
        console.error('\nID do cliente deve ser um numero valido.\n');
        return;
      }

      const dataEmprestimoStr = this.prompt('Digite a data do emprestimo (YYYY-MM-DD): ');
      const dataEmprestimo = this.converterStringParaDate(dataEmprestimoStr);

      if (!dataEmprestimo) {
        return;
      }

      const novoEmprestimo: Emprestimo = {
        id: 0,
        livroId: livroId,
        clienteId: clienteId,
        dataEmprestimo: dataEmprestimo,
        dataDevolucao: null,
      };

      const emprestimoRealizado = await this.emprestimoServico.emprestar(novoEmprestimo);
      console.log(`\nEmprestimo realizado com sucesso!`);
      console.log(`ID: ${emprestimoRealizado.id}`);
      console.log(`Livro ID: ${emprestimoRealizado.livroId}`);
      console.log(`Cliente ID: ${emprestimoRealizado.clienteId}`);
      console.log(`Data de Emprestimo: ${this.formatarDataParaExibicao(emprestimoRealizado.dataEmprestimo)}\n`);
    } catch (erro) {
      console.error(`\nErro ao emprestar livro: ${(erro as Error).message}\n`);
    }
  }

  async devolver(): Promise<void> {
    try {
      console.log('\n=== Devolver Livro ===\n');

      const emprestimoIdStr = this.prompt('Digite o ID do emprestimo: ');
      const emprestimoId = parseInt(emprestimoIdStr, 10);

      if (isNaN(emprestimoId)) {
        console.error('\nID do emprestimo deve ser um numero valido.\n');
        return;
      }

      const dataDevolucaoStr = this.prompt('Digite a data da devolucao (YYYY-MM-DD): ');
      const dataDevolucao = this.converterStringParaDate(dataDevolucaoStr);

      if (!dataDevolucao) {
        return;
      }

      const emprestimoDevolvido = await this.emprestimoServico.devolver(emprestimoId, dataDevolucao);
      console.log(`\nDevolucao realizada com sucesso!`);
      console.log(`ID: ${emprestimoDevolvido.id}`);
      console.log(`Data de Devolucao: ${this.formatarDataParaExibicao(emprestimoDevolvido.dataDevolucao!)}\n`);
    } catch (erro) {
      console.error(`\nErro ao devolver livro: ${(erro as Error).message}\n`);
    }
  }

  async listar(): Promise<void> {
    try {
      console.log('\n=== Lista de Emprestimos ===\n');

      const emprestimos = await this.emprestimoServico.listar();

      if (emprestimos.length === 0) {
        console.log('Nenhum emprestimo cadastrado.\n');
        return;
      }

      emprestimos.forEach((emprestimo, index) => {
        const statusDevolucao = emprestimo.dataDevolucao
          ? `Devolvido em ${this.formatarDataParaExibicao(emprestimo.dataDevolucao)}`
          : 'Ativo (nao devolvido)';
        console.log(
          `${index + 1}. Livro ID: ${emprestimo.livroId}, Cliente ID: ${emprestimo.clienteId}, Emprestimo: ${this.formatarDataParaExibicao(emprestimo.dataEmprestimo)}, ${statusDevolucao}`
        );
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar emprestimos: ${(erro as Error).message}\n`);
    }
  }

  async buscarPorId(): Promise<void> {
    try {
      console.log('\n=== Buscar Emprestimo por ID ===\n');

      const idStr = this.prompt('Digite o ID do emprestimo: ');
      const id = parseInt(idStr, 10);

      if (isNaN(id)) {
        console.error('\nID deve ser um numero valido.\n');
        return;
      }

      const emprestimo = await this.emprestimoServico.buscarPorId(id);
      console.log(`\nEmprestimo encontrado:`);
      console.log(`ID: ${emprestimo.id}`);
      console.log(`Livro ID: ${emprestimo.livroId}`);
      console.log(`Cliente ID: ${emprestimo.clienteId}`);
      console.log(`Data de Emprestimo: ${this.formatarDataParaExibicao(emprestimo.dataEmprestimo)}`);
      console.log(`Data de Devolucao: ${emprestimo.dataDevolucao ? this.formatarDataParaExibicao(emprestimo.dataDevolucao) : 'Nao devolvido ainda'}\n`);
    } catch (erro) {
      console.error(`\nErro ao buscar emprestimo: ${(erro as Error).message}\n`);
    }
  }

  async listarAtivos(): Promise<void> {
    try {
      console.log('\n=== Emprestimos Ativos (Nao Devolvidos) ===\n');

      const emprestimos = await this.emprestimoServico.listarAtivos();

      if (emprestimos.length === 0) {
        console.log('Nenhum emprestimo ativo.\n');
        return;
      }

      emprestimos.forEach((emprestimo, index) => {
        console.log(
          `${index + 1}. Livro ID: ${emprestimo.livroId}, Cliente ID: ${emprestimo.clienteId}, Emprestimo: ${this.formatarDataParaExibicao(emprestimo.dataEmprestimo)}`
        );
      });
      console.log('');
    } catch (erro) {
      console.error(`\nErro ao listar emprestimos ativos: ${(erro as Error).message}\n`);
    }
  }

  private converterStringParaDate(dataStr: string): Date | null {
    if (!dataStr || dataStr.trim() === '') {
      console.error('\nData eh obrigatoria.\n');
      return null;
    }

    const partes = dataStr.trim().split('-');
    if (partes.length !== 3) {
      console.error('\nData deve estar no formato YYYY-MM-DD (exemplo: 2026-07-15).\n');
      return null;
    }

    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    // new Date(ano, mes, dia) transborda em vez de rejeitar: mes 13 vira janeiro
    // do ano seguinte. Conferir as partes de volta descarta essas datas.
    const dataObj = new Date(ano, mes - 1, dia);
    if (
      dataObj.getFullYear() !== ano ||
      dataObj.getMonth() !== mes - 1 ||
      dataObj.getDate() !== dia
    ) {
      console.error('\nData invalida.\n');
      return null;
    }

    return dataObj;
  }

  private formatarDataParaExibicao(data: Date): string {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
}
