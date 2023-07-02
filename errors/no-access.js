const { NO_ACCESS } = require('./errors');

class NoAccess extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NO_ACCESS;
  }
}

module.exports = NoAccess;
