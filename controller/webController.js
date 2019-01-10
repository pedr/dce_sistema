
const db = require('../database/db.js');
const { getCookies } = require('./utils.js');

const controller = {};

async function checkToken(session) {
  try {
    const queryStr = 'SELECT * FROM session WHERE token = $1 AND tokenexpdate > now()';
    const result = await db.queryWithArgs(queryStr, [session]);
    if (result.length > 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}

controller.isLogged = async (req, res, next) => {
  if (req.headers.cookie === undefined) {
    res.send('erro na hora de verificar credenciais');
    return;
  }
  const { token } = getCookies(req.headers.cookie);
  if (token === null) {
    res.send('erro na hora de verificar credenciais');
    return;
  }
  try {
    const logged = await checkToken(token);
    if (logged === true) {
      next();
      return;
    }
  } catch (err) {
    console.error(err);
    res.send('erro na hora de verificar credenciais');
  }
  res.send('erro na hora de verificar credenciais');
};

controller.home = async (req, res) => {
  res.render('home.ejs');
};

module.exports = controller;
