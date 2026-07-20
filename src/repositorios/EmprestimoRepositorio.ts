import { pool } from '../banco/conexao';
import { Emprestimo } from '../modelos/Emprestimo';

export class EmprestimoRepositorio {

  async emprestar(emprestimo: Emprestimo): Promise<Emprestimo> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const resultadoEmprestimo = await client.query(
        `WITH novo AS (
           INSERT INTO emprestimos (livro_id, cliente_id, data_emprestimo, data_devolucao)
           VALUES ($1, $2, $3, $4)
           RETURNING *
         )
         SELECT novo.*, l.titulo AS livro_titulo, c.nome AS cliente_nome
         FROM novo
         JOIN livros l ON novo.livro_id = l.id
         JOIN clientes c ON novo.cliente_id = c.id`,
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
    const resultado = await pool.query(
      `SELECT e.*, l.titulo AS livro_titulo, c.nome AS cliente_nome
       FROM emprestimos e
       JOIN livros l ON e.livro_id = l.id
       JOIN clientes c ON e.cliente_id = c.id
       ORDER BY e.data_emprestimo DESC`
    );
    return resultado.rows.map(row => this.mapearDoBanco(row));
  }

  async buscarPorId(id: number): Promise<Emprestimo> {
    const resultado = await pool.query(
      `SELECT e.*, l.titulo AS livro_titulo, c.nome AS cliente_nome
       FROM emprestimos e
       JOIN livros l ON e.livro_id = l.id
       JOIN clientes c ON e.cliente_id = c.id
       WHERE e.id = $1`,
      [id]
    );
    if (resultado.rows.length === 0) {
      throw new Error(`Emprestimo com id ${id} nao encontrado`);
    }
    return this.mapearDoBanco(resultado.rows[0]);
  }

  async listarAtivos(): Promise<Emprestimo[]> {
    const resultado = await pool.query(
      `SELECT e.*, l.titulo AS livro_titulo, c.nome AS cliente_nome
       FROM emprestimos e
       JOIN livros l ON e.livro_id = l.id
       JOIN clientes c ON e.cliente_id = c.id
       WHERE e.data_devolucao IS NULL
       ORDER BY e.data_emprestimo DESC`
    );
    return resultado.rows.map(row => this.mapearDoBanco(row));
  }

  async contarPorLivro(livroId: number): Promise<number> {
    const resultado = await pool.query(
      'SELECT COUNT(*)::int AS total FROM emprestimos WHERE livro_id = $1',
      [livroId]
    );
    return resultado.rows[0].total;
  }

  async contarPorCliente(clienteId: number): Promise<number> {
    const resultado = await pool.query(
      'SELECT COUNT(*)::int AS total FROM emprestimos WHERE cliente_id = $1',
      [clienteId]
    );
    return resultado.rows[0].total;
  }

  private mapearDoBanco(row: any): Emprestimo {
    return {
      id: row.id,
      livroId: row.livro_id,
      clienteId: row.cliente_id,
      dataEmprestimo: row.data_emprestimo,
      dataDevolucao: row.data_devolucao,
      // Presentes so quando a consulta faz JOIN com livros e clientes.
      livroTitulo: row.livro_titulo,
      clienteNome: row.cliente_nome,
    };
  }
}
