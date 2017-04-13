import Babel from 'broccoli-babel-transpiler';

export default function babel(tree, options) {
  return new Babel(tree, options);
};