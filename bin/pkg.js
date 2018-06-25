const readPkgUp = require('read-pkg-up');
const path = require('path');

/**
 * Get package.json info
 */

const { pkg } = readPkgUp.sync({
  cwd: path.dirname(module.filename)
});

module.exports = pkg;
