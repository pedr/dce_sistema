
const Joi = require('joi');
const db = require('../database/db.js');

const controller = {};

const ALL_DATA_BESIDES_PASSWORD = `
      pe.pedidoid,
      pe.alunoid,
      pe.datahora,
      pe.pedidoativo,
      pe.copiacorreta,
      pe.copiaerrada,
      g.login,
      g.superuser,
      g.contaativa,
      p.pessoaid,
      p.nome,
      p.sexo,
      p.email`;

controller.getAll = async (req, res) => {
  try {
    const queryStr = `SELECT * FROM pedido pe 
    LEFT JOIN gerente g on g.gerenteid = pe.gerenteid
    LEFT JOIN pessoa p on p.pessoaid = g.gerenteid
    ORDER BY pe.pedidoid desc`;
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
    LEFT JOIN gerente g on g.gerenteid = pe.gerenteid
    LEFT JOIN pessoa p on p.pessoaid = g.gerenteid
    WHERE pe.pedidoId = $1`;
    const result = await db.queryWithArgs(queryStr, [id]);
    delete result[0].senha;
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};


function addCopias(pedidos) {
  const result = {
    copiasCorretasTotais: 0,
    copiasErradasTotais: 0,
    totalDePedidos: 0,
  };
  pedidos.forEach((obj) => {
    result.copiasCorretasTotais += obj.copiacorreta;
    result.copiasErradasTotais += obj.copiaerrada;
    result.totalDePedidos += 1;
  });

  return result;
}

controller.search = async (req, res) => {
  try {
    let {
      name, initialDate, finalDate,
    } = req.query;
    const { format } = req.query;

    const queryToDb = `SELECT ${ALL_DATA_BESIDES_PASSWORD} FROM pedido pe
    LEFT JOIN gerente g on g.gerenteid = pe.gerenteid
    LEFT JOIN pessoa p on p.pessoaid = g.gerenteid
    WHERE (g.login LIKE '%' || $1 || '%' OR p.nome LIKE '%' || $1 || '%') AND 
    (pe.datahora >= $2 AND pe.datahora <= $3)`;

    if (name === undefined) {
      name = '';
    }

    if (initialDate === undefined) {
      initialDate = '2000-01-01';
    }

    if (finalDate === undefined) {
      finalDate = 'now()';
    }

    const result = await db.queryWithArgs(queryToDb, [name, initialDate, finalDate]);
    if (format === 'sum') {
      res.json(addCopias(result));
      return;
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

async function addPedido(gerenteId = null, alunoId = null,
  pedidoAtivo = true, copiaErrada, copiaCorreta) {
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
    gerenteId: Joi.number().integer(),
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
    const gerenteId = req.userId;

    const {
      alunoId, pedidoAtivo, copiaErrada, copiaCorreta,
    } = data;

    const result = await addPedido(gerenteId, alunoId, pedidoAtivo, copiaErrada, copiaCorreta);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
};

module.exports = controller;
