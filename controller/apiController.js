
const db = require('../database/db.js');

const controller = {};

async function checkToken(session) {
  try {
    const queryStr = 'SELECT * FROM session WHERE token = $1 AND tokenexpdate > now()';
    const result = await db.queryWithArgs(queryStr, [session]);
    if (result < 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function getCookies(cookieString) {
  const cookiesArray = cookieString.split('; ').map(ele => ele.split('='));

  const cookies = cookiesArray.reduce((total, next) => {
    const [key, val] = next;
    // eslint-disable-next-line no-param-reassign
    total[key] = val;
    return total;
  }, {});
  return cookies;
}


controller.checkSession = async (req, res, next) => {
  if (req.headers.cookie === undefined) {
    res.redirect('/login');
    return;
  }
  const { token } = getCookies(req.headers.cookie);
  if (token === null) {
    res.redirect('/');
    return;
  }
  try {
    const isLogged = await checkToken(token);
    if (isLogged === false) {
      res.redirect('/');
      return;
    }
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
  next();
};

module.exports = controller;