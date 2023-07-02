const { DUPLICATE_ENTRY } = require('./errors');

class DuplicateEntry extends Error {
  constructor(message) {
    super(message);
    this.statusCode = DUPLICATE_ENTRY;
  }
}

module.exports = DuplicateEntry;
