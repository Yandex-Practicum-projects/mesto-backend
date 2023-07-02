const { INVALID_AUTHENTICATION } = require('./errors');

class InvalidAuthentication extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INVALID_AUTHENTICATION;
  }
}

module.exports = InvalidAuthentication;
