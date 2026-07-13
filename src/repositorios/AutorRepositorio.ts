import { pool } from '../banco/conexao';
import { Autor } from '../modelos/Autor';

export class AutorRepositorio {
  
  async criar(autor: Autor): Promise<Autor> {
    const resultado = await pool.query(
      'INSERT INTO autores (nome, nacionalidade) VALUES ($1, $2) RETURNING *',
      [autor.nome, autor.nacionalidade]
    );
    return resultado.rows[0];
  }

  async listar(): Promise<Autor[]> {
    const resultado = await pool.query('SELECT * FROM autores ORDER BY nome');
    return resultado.rows;
  }

  async atualizar(id: number, autor: Autor): Promise<Autor> {
    const resultado = await pool.query(
      'UPDATE autores SET nome = $1, nacionalidade = $2 WHERE id = $3 RETURNING *',
      [autor.nome, autor.nacionalidade, id]
    );
    if (resultado.rows.length === 0) {
      throw new Error(`Autor com id ${id} nao encontrado`);
    }
    return resultado.rows[0];
  }

  async buscarPorId(id: number): Promise<Autor> {
    const resultado = await pool.query('SELECT * FROM autores WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      throw new Error(`Autor com id ${id} nao encontrado`);
    }
    return resultado.rows[0];
  }
}