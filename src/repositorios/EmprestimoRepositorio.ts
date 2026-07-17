import { pool } from '../banco/conexao';
import { Emprestimo } from '../modelos/Emprestimo';

export class EmprestimoRepositorio {

  async emprestar(emprestimo: Emprestimo): Promise<Emprestimo> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const resultadoEmprestimo = await client.query(
        'INSERT INTO emprestimos (livro_id, cliente_id, data_emprestimo, data_devolucao) VALUES ($1, $2, $3, $4) RETURNING *',
        [emprestimo.livroId, emprestimo.clienteId, emprestimo.dataEmprestimo, emprestimo.dataDevolucao]
      );

      await client.query(
        'UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = $1',
        [emprestimo.livroId]
      );

      await client.query('COMMIT');
      return this.mapearDoBanco(resultadoEmprestimo.rows[0]);
    } catch (erro) {
      await client.query('ROLLBACK');
      throw erro;
    } finally {
      client.release();
    }
  }

  async devolver(emprestimoId: number, dataDevolucao: Date): Promise<Emprestimo> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const resultadoEmprestimo = await client.query(
        'SELECT livro_id FROM emprestimos WHERE id = $1',
        [emprestimoId]
      );

      if (resultadoEmprestimo.rows.length === 0) {
        throw new Error(`Emprestimo com id ${emprestimoId} nao encontrado`);
      }

      const livroId = resultadoEmprestimo.rows[0].livro_id;

      await client.query(
        'UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = $1',
        [livroId]
      );

      const resultadoAtualizacao = await client.query(
        'UPDATE emprestimos SET data_devolucao = $1 WHERE id = $2 RETURNING *',
        [dataDevolucao, emprestimoId]
      );

      await client.query('COMMIT');
      return this.mapearDoBanco(resultadoAtualizacao.rows[0]);
    } catch (erro) {
      await client.query('ROLLBACK');
      throw erro;
    } finally {
      client.release();
    }
  }

  async listar(): Promise<Emprestimo[]> {
    const resultado = await pool.query('SELECT * FROM emprestimos ORDER BY data_emprestimo DESC');
    return resultado.rows.map(row => this.mapearDoBanco(row));
  }

  async buscarPorId(id: number): Promise<Emprestimo> {
    const resultado = await pool.query('SELECT * FROM emprestimos WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      throw new Error(`Emprestimo com id ${id} nao encontrado`);
    }
    return this.mapearDoBanco(resultado.rows[0]);
  }

  async listarAtivos(): Promise<Emprestimo[]> {
    const resultado = await pool.query('SELECT * FROM emprestimos WHERE data_devolucao IS NULL ORDER BY data_emprestimo DESC');
    return resultado.rows.map(row => this.mapearDoBanco(row));
  }

  private mapearDoBanco(row: any): Emprestimo {
    return {
      id: row.id,
      livroId: row.livro_id,
      clienteId: row.cliente_id,
      dataEmprestimo: row.data_emprestimo,
      dataDevolucao: row.data_devolucao,
    };
  }
}
