const Rollup = require('broccoli-rollup');

module.exports = function rollup(tree, options) {
  return new Rollup(tree, options);
}