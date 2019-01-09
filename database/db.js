
const pg = require('pg');
const { connString } = require('../index.js');

const pool = new pg.Pool({
  // connectionString é do formato:
  // postgresql://USER : SENHA @ ENDEREÇO_DO_SERVIDOR_DB : PORTA_DO_SERVIDOR_DB / NOME_DO_BANCO
  // ex: postgresql://pedro:1234@localhost:5432/dce_sistema
  connectionString: connString || process.env.DATABASE_URL,
  ssl: true,
});

const db = { pool };

db.plainQuery = async (queryStr) => {
  try {
    const client = await pool.connect();
    const results = await client.query(queryStr);
    client.release();
    const result = results.rows;
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

db.queryWithArgs = async (queryStr, arrVals) => {
  try {
    const client = await pool.connect();
    const results = await client.query(queryStr, arrVals);
    client.release();
    if (results.rows === null) {
      return null;
    }
    const result = results.rows;
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = db;
