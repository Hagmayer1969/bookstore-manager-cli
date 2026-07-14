import { pool } from '../banco/conexao';
import { Livro } from '../modelos/Livro';

export class LivroRepositorio {
  
  async criar(livro: Livro): Promise<Livro> {
    const resultado = await pool.query(
      'INSERT INTO livros (titulo, autor_id, quantidade_disponivel) VALUES ($1, $2, $3) RETURNING *',
      [livro.titulo, livro.autorId, livro.quantidadeDisponivel]
    );
    return this.mapearDoBanco(resultado.rows[0]);
  }

  async listar(): Promise<Livro[]> {
    const resultado = await pool.query('SELECT * FROM livros ORDER BY titulo');
    return resultado.rows.map(row => this.mapearDoBanco(row));
  }

  async atualizar(id: number, livro: Livro): Promise<Livro> {
    const resultado = await pool.query(
      'UPDATE livros SET titulo = $1, autor_id = $2, quantidade_disponivel = $3 WHERE id = $4 RETURNING *',
      [livro.titulo, livro.autorId, livro.quantidadeDisponivel, id]
    );
    if (resultado.rows.length === 0) {
      throw new Error(`Livro com id ${id} nao encontrado`);
    }
    return this.mapearDoBanco(resultado.rows[0]);
  }

  async buscarPorId(id: number): Promise<Livro> {
    const resultado = await pool.query('SELECT * FROM livros WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      throw new Error(`Livro com id ${id} nao encontrado`);
    }
    return this.mapearDoBanco(resultado.rows[0]);
  }

  async deletar(id: number): Promise<void> {
    const resultado = await pool.query('DELETE FROM livros WHERE id = $1', [id]);
    if (resultado.rowCount === 0) {
      throw new Error(`Livro com id ${id} nao encontrado`);
    }
  }

  async buscarPorAutor(autorId: number): Promise<Livro[]> {
    const resultado = await pool.query('SELECT * FROM livros WHERE autor_id = $1 ORDER BY titulo', [autorId]);
    return resultado.rows.map(row => this.mapearDoBanco(row));
  }

  private mapearDoBanco(row: any): Livro {
    return {
      id: row.id,
      titulo: row.titulo,
      autorId: row.autor_id,
      quantidadeDisponivel: row.quantidade_disponivel
    };
  }
}