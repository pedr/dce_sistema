
const pg = require('pg');

const pool = new pg.Pool({
  // connectionString é do formato:
  // postgresql://USER : SENHA @ ENDEREÇO_DO_SERVIDOR_DB : PORTA_DO_SERVIDOR_DB / NOME_DO_BANCO
  // ex: postgresql://pedro:1234@localhost:5432/dce_sistema
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

module.exports = pool;
