const jwt = require('jsonwebtoken');

// Creates a signed JWT containing the user's id and role.
// The role is embedded so authorization middleware can check it
// without a database lookup on every request.
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
