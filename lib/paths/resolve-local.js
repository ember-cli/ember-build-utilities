const path = require('path');
module.exports = function _resolveLocal(root, to) {
  if (to[0] === '/') {
    return to;
  }

  return path.join(root, to);
}