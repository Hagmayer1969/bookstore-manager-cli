import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const variaveisObrigatorias = ["DB_USER", "DB_PASSWORD", "DB_NAME"] as const;
const faltando = variaveisObrigatorias.filter((nome) => !process.env[nome]);

if (faltando.length > 0) {
  throw new Error(
    `Variáveis de ambiente obrigatórias ausentes: ${faltando.join(", ")}. ` +
      `Verifique o arquivo .env.`
  );
}

export const pool: Pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on("error", (erro) => {
  console.error("❌ Erro inesperado no pool do PostgreSQL:", erro);
});
