
const Joi  = require('joi');
const db = require('../database/db.js');

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const queryStr = 'SELECT * FROM historicoAluno';
    const result = await db.plainQuery(queryStr);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const queryStr = 'SELECT * FROM historico WHERE historicoAlunoId = $1';
    const result = await db.queryWithArgs(queryStr, [id]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

async function addHistorico(gerenteId, alunoId = null, tipo = null, copiaErrada, copiaCorreta) {
  try {
    const queryStr = 'INSERT INTO historicoAluno (gerenteId, alunoId, tipo, copiaCorreta, copiaErrada) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await db.queryWithArgs(queryStr,
      [gerenteId, alunoId, tipo, copiaCorreta, copiaErrada]);
    return { ok: true, content: result[0] };
  } catch (err) {
    console.error(err);
    return { ok: false, content: 'precisa => gerenteId, copiaErrada, copiaCorreta, opcional => tipo, alunoId' };
  }
}

controller.add = async (req, res) => {
  const schema = Joi.object().keys({
    gerenteId: Joi.number().integer().required(),
    alunoId: Joi.number().integer(),
    tipo: Joi.boolean(),
    copiaErrada: Joi.number().min(0).required(),
    copiaCorreta: Joi.number().min(0).required(),
  });

  try {
    const data = req.body;
    const validate = Joi.validate(data, schema);

    if (validate.error !== null) {
      res.send('algum dado errado {gerenteId, alunoId, tipo, copiaErrada, copiaCorreta}');
      return;
    }

    const {
      gerenteId, alunoId, tipo, copiaErrada, copiaCorreta,
    } = data;

    const result = await addHistorico(gerenteId, alunoId, tipo, copiaErrada, copiaCorreta);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = controller;
