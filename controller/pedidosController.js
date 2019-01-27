
const Joi = require('joi');
const db = require('../database/db.js');

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const queryStr = `SELECT * FROM pedido pe 
    LEFT JOIN gerente g on g.gerenteid = pe.gerenteid
    LEFT JOIN pessoa p on p.pessoaid = g.gerenteid`;
    const result = await db.plainQuery(queryStr);
    const filtrado = result.map((a) => {
      delete a.senha;
      return a;
    });
    res.json(filtrado);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

controller.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const queryStr = `SELECT * FROM pedido pe 
    LEFT JOIN gerente g on g.gerenteid = h.gerenteid
    LEFT JOIN pessoa p on p.pessoaid = g.gerenteid
    WHERE pedidoId = $1`;
    const result = await db.queryWithArgs(queryStr, [id]);
    delete result[0].senha;
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

async function addHistorico(gerenteId, alunoId = null, pedidoAtivo = true, copiaErrada, copiaCorreta) {
  try {
    const queryStr = 'INSERT INTO pedido (gerenteId, alunoId, pedidoAtivo, copiaCorreta, copiaErrada) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await db.queryWithArgs(queryStr,
      [gerenteId, alunoId, pedidoAtivo, copiaCorreta, copiaErrada]);
    return { ok: true, content: result[0] };
  } catch (err) {
    console.error(err);
    return { ok: false, content: 'precisa => gerenteId, copiaErrada, copiaCorreta, opcional => pedidoAtivo, alunoId' };
  }
}

controller.add = async (req, res) => {
  const schema = Joi.object().keys({
    gerenteId: Joi.number().integer().required(),
    alunoId: Joi.number().integer(),
    pedidoAtivo: Joi.boolean(),
    copiaErrada: Joi.number().min(0).required(),
    copiaCorreta: Joi.number().min(0).required(),
  });

  try {
    const data = req.body;
    const validate = Joi.validate(data, schema);

    if (validate.error !== null) {
      res.send('algum dado errado {gerenteId, alunoId, pedidoAtivo, copiaErrada, copiaCorreta}');
      return;
    }

    const {
      gerenteId, alunoId, pedidoAtivo, copiaErrada, copiaCorreta,
    } = data;

    const result = await addHistorico(gerenteId, alunoId, pedidoAtivo, copiaErrada, copiaCorreta);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = controller;
