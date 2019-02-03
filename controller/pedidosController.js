
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

controller.getByName = async (req, res) => {
  try {
    const { search } = req.query;
    const querySearch = `SELECT * FROM pedido pe
    LEFT JOIN gerente g on g.gerenteid = pe.gerenteid
    LEFT JOIN pessoa p on p.pessoaid = g.gerenteid
    WHERE g.login LIKE '%' || $1 || '%' OR
    p.nome LIKE '%' || $1 || '%'`;
    const result = await db.queryWithArgs(querySearch, [search]);
    const filtrado = result.map((a) => {
      delete a.senha;
      return a;
    });

    res.json(filtrado);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
}

function checkIfDateIsValid(date) {
  if (date.length !== 8) {
    return false;
  }
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);

  if (typeof +year !== 'number' || typeof +month !== 'number' || typeof +day !== 'number') {
    return false;
  }

  if (month < 1 || month > 12) {
    return false;
  }

  if (day < 1 || day > 31) {
    return false;
  }

  return true;
}

function transformDateToPSQL(date) {
  const year = `${date.slice(0, 4)}-`;
  const month = `${date.slice(4, 6)}-`;
  const newDate = `${year}${month}${date.slice(6, 8)}`;
  return newDate;
}

function addCopias(pedidos) {
  const result = {
    copiasCorretasTotais: 0,
    copiasErradasTotais: 0,
    totalDePedidos: 0,
  };
  pedidos.forEach(obj => {
    result.copiasCorretasTotais += obj.copiacorreta;
    result.copiasErradasTotais += obj.copiaerrada;
    result.totalDePedidos += 1;
  });

  return result;
}

controller.byDate = async (req, res) => {
  try {
    const { initial } = req.query;
    let { final } = req.query;
    const { format } = req.query;

    const now = new Date();
    const nowFormatted = (1900 + now.getYear())
      + ((now.getMonth() + 1).toString().padStart(2, 0))
      + now.getDate();

    if (final === null) {
      final = nowFormatted;
    }

    if (checkIfDateIsValid(initial) === false) {
      res.json('invalid date format, should be "YYYYMMDD" ex. 20190101');
      return;
    }

    const psqlInital = transformDateToPSQL(initial);
    const psqlFinal = transformDateToPSQL(final);

    const querySearch = `SELECT 
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
      p.email
    FROM pedido pe
    LEFT JOIN gerente g ON g.gerenteid = pe.gerenteid
    LEFT JOIN pessoa p ON g.gerenteid = p.pessoaid
    WHERE pe.dataHora >= $1 AND pe.dataHora <= $2
    ORDER BY pe.dataHora DESC`;

    const result = await db.queryWithArgs(querySearch, [psqlInital, psqlFinal]);

    if (format === 'all') {
      res.json(result);
      return;
    }

    if (format === 'sum') {
      const soma = addCopias(result);
      soma.dataInicial = psqlInital;
      soma.dataFinal = psqlFinal;
      res.json(soma);
      return;
    }
    res.json('algo deu errado');
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
