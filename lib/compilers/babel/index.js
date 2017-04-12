const Babel = require('broccoli-babel-transpiler');

module.exports = function babel(tree, options) {
  return new Babel(tree, options);
};