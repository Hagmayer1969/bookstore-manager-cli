import { pool } from '../banco/conexao';
import { Cliente } from '../modelos/Cliente';

export class ClienteRepositorio {
  
  async criar(cliente: Cliente): Promise<Cliente> {
    const resultado = await pool.query(
      'INSERT INTO clientes (nome, email) VALUES ($1, $2) RETURNING *',
      [cliente.nome, cliente.email]
    );
    return resultado.rows[0];
  }

  async listar(): Promise<Cliente[]> {
    const resultado = await pool.query('SELECT * FROM clientes ORDER BY nome');
    return resultado.rows;
  }

  async atualizar(id: number, cliente: Cliente): Promise<Cliente> {
    const resultado = await pool.query(
      'UPDATE clientes SET nome = $1, email = $2 WHERE id = $3 RETURNING *',
      [cliente.nome, cliente.email, id]
    );
    if (resultado.rows.length === 0) {
      throw new Error(`Cliente com id ${id} nao encontrado`);
    }
    return resultado.rows[0];
  }

  async buscarPorId(id: number): Promise<Cliente> {
    const resultado = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      throw new Error(`Cliente com id ${id} nao encontrado`);
    }
    return resultado.rows[0];
  }

  async deletar(id: number): Promise<void> {
    const resultado = await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
    if (resultado.rowCount === 0) {
      throw new Error(`Cliente com id ${id} nao encontrado`);
    }
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const resultado = await pool.query('SELECT * FROM clientes WHERE email = $1', [email]);
    if (resultado.rows.length === 0) {
      return null;
    }
    return resultado.rows[0];
  }
}