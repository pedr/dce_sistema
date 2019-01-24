
const db = require('../database/db.js');

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const queryStr = 'SELECT * FROM pessoa';
    const result = await db.plainQuery(queryStr);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

async function addPessoa(nome, email, sexo) {
  if (!nome || !email || !sexo) {
    return { ok: false, content: 'falta dados, precisa de nome, email e sexo' };
  }

  if (sexo.length !== 1) {
    return { ok: false, content: 'sexo tem que ser m ou f' };
  }

  if (!email.includes('@')) {
    return { ok: false, content: 'email não é valido?' };
  }

  if (nome.length < 3) {
    return { ok: false, content: 'nome não é valido' };
  }

  const queryStr = 'INSERT INTO pessoa (nome, email, sexo) VALUES ($1, $2, $3) RETURNING *';
  const result = await db.queryWithArgs(queryStr, [nome, email, sexo]);

  return { ok: true, content: result[0] };
}

controller.add = async (req, res) => {
  try {
    const { nome, email, sexo } = req.body;
    const result = await addPessoa(nome, email, sexo);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
};

controller.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const queryStr = 'SELECT * FROM pessoa WHERE pessoaId = $1';
    const result = await db.queryWithArgs(queryStr, [id]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = {
  controller,
  addPessoa,
};
