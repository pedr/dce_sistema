
const jwt = require('jsonwebtoken');

const controller = {};

controller.verifyJWT = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    console.error('primeiro erro', authorization);
    return res.status(400).send('algum erro 1');
  }

  const parts = authorization.split(' ');

  if (!parts.length === 2) {
    return res.status(400).send('algum erro 2');
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(400).send('algum erro 3');
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      console.error('erro 4', err);
      return res.status(401).send('algum erro 4');
    }
    req.userId = decoded.id;
    return next();
  });
  return null;
};

module.exports = controller;
