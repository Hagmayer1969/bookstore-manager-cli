-- ============================================================
-- SCRIPT SQL: Criação das tabelas do BookStore Manager CLI
-- Data: 09/07/2026
-- Banco: bookstore
-- ============================================================

-- Tabela 1: AUTORES
-- Armazena informações sobre os autores dos livros
CREATE TABLE autores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  nacionalidade VARCHAR(100)
);

-- Tabela 2: LIVROS
-- Armazena informações sobre os livros da livraria
-- autor_id faz referência à tabela autores (Foreign Key)
CREATE TABLE livros (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  autor_id INTEGER NOT NULL,
  quantidade_disponivel INTEGER NOT NULL,
  FOREIGN KEY (autor_id) REFERENCES autores(id)
);

-- Tabela 3: CLIENTES
-- Armazena informações sobre os clientes que pegam livros emprestado
-- Email é único: não pode haver dois clientes com o mesmo email
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

-- Tabela 4: EMPRESTIMOS
-- Armazena o histórico de empréstimos e devoluções
-- livro_id faz referência à tabela livros
-- cliente_id faz referência à tabela clientes
-- data_devolucao é opcional (NULL enquanto o livro não for devolvido)
CREATE TABLE emprestimos (
  id SERIAL PRIMARY KEY,
  livro_id INTEGER NOT NULL,
  cliente_id INTEGER NOT NULL,
  data_emprestimo TIMESTAMP NOT NULL,
  data_devolucao TIMESTAMP,
  FOREIGN KEY (livro_id) REFERENCES livros(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- ============================================================
-- Script finalizado
-- Agora você tem 4 tabelas relacionadas prontas para usar
-- ============================================================