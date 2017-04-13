import { resolve, dirname, join } from 'path';

export default function findLib(name, libPath) {
  let packagePath = join(name, 'package');
  let packageRoot = dirname(require.resolve(packagePath));

  libPath = libPath || getLibPath(packagePath);

  return resolve(packageRoot, libPath);
};

function getLibPath(packagePath) {
  let packageJson = require(packagePath);

  return dirname(packageJson['module'] || packageJson['main']);
}