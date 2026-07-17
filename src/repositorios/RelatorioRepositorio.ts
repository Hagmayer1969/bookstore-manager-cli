import { pool } from '../banco/conexao';
import {
  ResumoGeral,
  LivroComAutor,
  LivroEmprestado,
  LivrosPorAutor,
  EmprestimosPorLivro,
  ClienteComEmprestimoAtivo,
  ClienteRanking,
} from '../modelos/Relatorio';

export class RelatorioRepositorio {

  // COUNT() retorna bigint, que o pg entrega como string. O ::int garante
  // que os campos numericos cheguem como number, conforme as interfaces.
  async resumoGeral(): Promise<ResumoGeral> {
    const resultado = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM autores)::int AS total_autores,
         (SELECT COUNT(*) FROM livros)::int AS total_livros,
         (SELECT COUNT(*) FROM clientes)::int AS total_clientes,
         (SELECT COUNT(*) FROM emprestimos)::int AS total_emprestimos,
         (SELECT COUNT(*) FROM emprestimos WHERE data_devolucao IS NULL)::int AS emprestimos_ativos`
    );

    const row = resultado.rows[0];
    return {
      totalAutores: row.total_autores,
      totalLivros: row.total_livros,
      totalClientes: row.total_clientes,
      totalEmprestimos: row.total_emprestimos,
      emprestimosAtivos: row.emprestimos_ativos,
    };
  }

  async livrosDisponiveis(): Promise<LivroComAutor[]> {
    const resultado = await pool.query(
      `SELECT l.id, l.titulo, a.nome AS autor, l.quantidade_disponivel
         FROM livros l
         INNER JOIN autores a ON a.id = l.autor_id
        WHERE l.quantidade_disponivel > 0
        ORDER BY l.titulo`
    );

    return resultado.rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      autor: row.autor,
      quantidadeDisponivel: row.quantidade_disponivel,
    }));
  }

  async livrosEmprestados(): Promise<LivroEmprestado[]> {
    const resultado = await pool.query(
      `SELECT l.titulo, c.nome AS cliente, e.data_emprestimo
         FROM emprestimos e
         INNER JOIN livros l ON l.id = e.livro_id
         INNER JOIN clientes c ON c.id = e.cliente_id
        WHERE e.data_devolucao IS NULL
        ORDER BY e.data_emprestimo DESC`
    );

    return resultado.rows.map(row => ({
      titulo: row.titulo,
      cliente: row.cliente,
      dataEmprestimo: row.data_emprestimo,
    }));
  }

  // LEFT JOIN para que autores sem livros cadastrados apareçam com zero.
  async livrosPorAutor(): Promise<LivrosPorAutor[]> {
    const resultado = await pool.query(
      `SELECT a.nome AS autor, COUNT(l.id)::int AS total_livros
         FROM autores a
         LEFT JOIN livros l ON l.autor_id = a.id
        GROUP BY a.id, a.nome
        ORDER BY total_livros DESC, a.nome`
    );

    return resultado.rows.map(row => ({
      autor: row.autor,
      totalLivros: row.total_livros,
    }));
  }

  async emprestimosPorLivro(): Promise<EmprestimosPorLivro[]> {
    const resultado = await pool.query(
      `SELECT l.titulo, COUNT(e.id)::int AS total_emprestimos
         FROM livros l
         LEFT JOIN emprestimos e ON e.livro_id = l.id
        GROUP BY l.id, l.titulo
        ORDER BY total_emprestimos DESC, l.titulo`
    );

    return resultado.rows.map(row => ({
      titulo: row.titulo,
      totalEmprestimos: row.total_emprestimos,
    }));
  }

  async clientesComEmprestimosAtivos(): Promise<ClienteComEmprestimoAtivo[]> {
    const resultado = await pool.query(
      `SELECT c.nome, c.email, COUNT(e.id)::int AS emprestimos_ativos
         FROM clientes c
         INNER JOIN emprestimos e ON e.cliente_id = c.id
        WHERE e.data_devolucao IS NULL
        GROUP BY c.id, c.nome, c.email
        ORDER BY emprestimos_ativos DESC, c.nome`
    );

    return resultado.rows.map(row => ({
      nome: row.nome,
      email: row.email,
      emprestimosAtivos: row.emprestimos_ativos,
    }));
  }

  async livrosMaisEmprestados(): Promise<EmprestimosPorLivro[]> {
    const resultado = await pool.query(
      `SELECT l.titulo, COUNT(e.id)::int AS total_emprestimos
         FROM livros l
         INNER JOIN emprestimos e ON e.livro_id = l.id
        GROUP BY l.id, l.titulo
        ORDER BY total_emprestimos DESC, l.titulo
        LIMIT 5`
    );

    return resultado.rows.map(row => ({
      titulo: row.titulo,
      totalEmprestimos: row.total_emprestimos,
    }));
  }

  // Conta o historico completo do cliente, nao apenas os emprestimos em aberto.
  async clientesMaisAtivos(): Promise<ClienteRanking[]> {
    const resultado = await pool.query(
      `SELECT c.nome, c.email, COUNT(e.id)::int AS total_emprestimos
         FROM clientes c
         INNER JOIN emprestimos e ON e.cliente_id = c.id
        GROUP BY c.id, c.nome, c.email
        ORDER BY total_emprestimos DESC, c.nome
        LIMIT 5`
    );

    return resultado.rows.map(row => ({
      nome: row.nome,
      email: row.email,
      totalEmprestimos: row.total_emprestimos,
    }));
  }

  async livrosComQuantidadeZero(): Promise<LivroComAutor[]> {
    const resultado = await pool.query(
      `SELECT l.id, l.titulo, a.nome AS autor, l.quantidade_disponivel
         FROM livros l
         INNER JOIN autores a ON a.id = l.autor_id
        WHERE l.quantidade_disponivel = 0
        ORDER BY l.titulo`
    );

    return resultado.rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      autor: row.autor,
      quantidadeDisponivel: row.quantidade_disponivel,
    }));
  }
}
