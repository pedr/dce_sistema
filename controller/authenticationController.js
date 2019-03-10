
const jwt = require('jsonwebtoken');

const controller = {};

controller.verifyJWT = (req, res, next) => {
  console.log(req);
  const { Authorization } = req.headers;

  if (!Authorization) {
    console.error('primeiro erro',   req.header('authorization')
);
    return res.status(400).send('algum erro 1');
  }

  const parts = Authorization.split(' ');

  if (!parts.length === 2) {
    return res.status(400).send('algum erro 2');
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(400).send('algum erro 3');
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      console.log('erro 4', err);
      return res.status(200).send('algum erro 4');
      //return res.status(401).send('algum erro 4');
    }
    req.userId = decoded.id;
    return next();
  });
  return null;
};

module.exports = controller;
