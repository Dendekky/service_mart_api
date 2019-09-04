const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models').User;
const config = require('../config/config');

const authenticate = params => Users.findOne({
  where: {
    email: params.email,
  },
  raw: true,
}).then((user) => {
  if (!user)
  { throw new Error('Authentication failed. User not found.'); }
  if (!bcrypt.compareSync(params.password || '', user.password))
  { throw new Error('Authentication failed. Wrong password.'); }
  const payload = {
    email: user.email,
    id: user.id,
    time: new Date(),
  };
  const token = jwt.sign(payload, config.development.jwtSecret, {
    expiresIn: config.development.tokenExpireTime,
  });
  return token;
});

module.exports = {
  authenticate,
};
