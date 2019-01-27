
const crypto = require('crypto');

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

function encryptarSenha(senha) {
  const hash = crypto.createHash('sha512');
  hash.update(senha);
  return hash.digest('hex');
}

module.exports = {
  getCookies,
  encryptarSenha,
};
