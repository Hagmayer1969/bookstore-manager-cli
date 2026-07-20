import { pool } from '../banco/conexao';
import { Livro } from '../modelos/Livro';

export class LivroRepositorio {
  
  async criar(livro: Livro): Promise<Livro> {
    // CTE: insere e ja traz o nome do autor numa unica ida ao banco,
    // porque RETURNING sozinho so devolve colunas da tabela livros.
    const resultado = await pool.query(
      `WITH novo AS (
         INSERT INTO livros (titulo, autor_id, quantidade_disponivel)
         VALUES ($1, $2, $3)
         RETURNING *
       )
       SELECT novo.*, a.nome AS autor_nome
       FROM novo
       JOIN autores a ON novo.autor_id = a.id`,
      [livro.titulo, livro.autorId, livro.quantidadeDisponivel]
    );
    return this.mapearDoBanco(resultado.rows[0]);
  }

  async listar(): Promise<Livro[]> {
    const resultado = await pool.query(
      `SELECT l.*, a.nome AS autor_nome
       FROM livros l
       JOIN autores a ON l.autor_id = a.id
       ORDER BY l.titulo`
    );
    return resultado.rows.map(row => this.mapearDoBanco(row));
  }

  async atualizar(id: number, livro: Livro): Promise<Livro> {
    const resultado = await pool.query(
      `WITH atualizado AS (
         UPDATE livros
         SET titulo = $1, autor_id = $2, quantidade_disponivel = $3
         WHERE id = $4
         RETURNING *
       )
       SELECT atualizado.*, a.nome AS autor_nome
       FROM atualizado
       JOIN autores a ON atualizado.autor_id = a.id`,
      [livro.titulo, livro.autorId, livro.quantidadeDisponivel, id]
    );
    if (resultado.rows.length === 0) {
      throw new Error(`Livro com id ${id} nao encontrado`);
    }
    return this.mapearDoBanco(resultado.rows[0]);
  }

  async buscarPorId(id: number): Promise<Livro> {
    const resultado = await pool.query(
      `SELECT l.*, a.nome AS autor_nome
       FROM livros l
       JOIN autores a ON l.autor_id = a.id
       WHERE l.id = $1`,
      [id]
    );
    if (resultado.rows.length === 0) {
      throw new Error(`Livro com id ${id} nao encontrado`);
    }
    return this.mapearDoBanco(resultado.rows[0]);
  }

  // Verifica existencia sem JOIN com autores, para que a checagem
  // nao dependa do autor e nao mascare outros erros de banco.
  async existePorId(id: number): Promise<boolean> {
    const resultado = await pool.query('SELECT 1 FROM livros WHERE id = $1', [id]);
    return (resultado.rowCount ?? 0) > 0;
  }

  async deletar(id: number): Promise<void> {
    const resultado = await pool.query('DELETE FROM livros WHERE id = $1', [id]);
    if (resultado.rowCount === 0) {
      throw new Error(`Livro com id ${id} nao encontrado`);
    }
  }

  // LOWER() para que "Dom Casmurro" e "dom casmurro" do mesmo autor colidam.
  async buscarPorTituloEAutor(titulo: string, autorId: number): Promise<Livro | null> {
    const resultado = await pool.query(
      'SELECT * FROM livros WHERE LOWER(titulo) = LOWER($1) AND autor_id = $2',
      [titulo, autorId]
    );
    return resultado.rows.length > 0 ? this.mapearDoBanco(resultado.rows[0]) : null;
  }

  async buscarPorAutor(autorId: number): Promise<Livro[]> {
    const resultado = await pool.query(
      `SELECT l.*, a.nome AS autor_nome
       FROM livros l
       JOIN autores a ON l.autor_id = a.id
       WHERE l.autor_id = $1
       ORDER BY l.titulo`,
      [autorId]
    );
    return resultado.rows.map(row => this.mapearDoBanco(row));
  }

  private mapearDoBanco(row: any): Livro {
    return {
      id: row.id,
      titulo: row.titulo,
      autorId: row.autor_id,
      quantidadeDisponivel: row.quantidade_disponivel,
      // Presente so quando a consulta faz JOIN com autores.
      autorNome: row.autor_nome
    };
  }
}