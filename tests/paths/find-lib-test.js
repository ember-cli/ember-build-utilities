import { findLib } from '../../lib';
import { module, test } from 'qunit';
import fixturify from 'fixturify';
import { join } from 'path';
import { sync as rimraf } from 'rimraf';

const NODE_MODULES_PATH = join(__dirname, '../../node_modules');

module('find-lib', () => {
  module('when `main` is defined in package.json', hooks => {
    hooks.beforeEach(() => setupFakePackage({ main: 'dist/whatever.js' }));
    hooks.afterEach(() => teardownFakePackage());

    test('finds directory of the `main` file of the given dependency', assert => {
      let foundLib = findLib('foo');
      assert.equal(foundLib, join(NODE_MODULES_PATH, 'foo', 'dist'));
    });

    test('finds directory of given dependency with optional libPath', assert => {
      let foundLib = findLib('foo', 'bar');
      assert.equal(foundLib, join(NODE_MODULES_PATH, 'foo', 'bar'));
    });
  });

  module('when `module` is defined in package.json', hooks => {
    hooks.beforeEach(() => setupFakePackage({ main: 'lib/whatever.js' }));
    hooks.afterEach(() => teardownFakePackage());
    test('finds directory of the `module` file of the given dependency', assert => {
      let foundLib = findLib('foo');

      assert.equal(foundLib, join(NODE_MODULES_PATH, 'foo', 'lib'));
    });

    test('finds directory of given dependency with optional libPath', assert => {
      let foundLib = findLib('foo', 'bar');

      assert.equal(foundLib, join(NODE_MODULES_PATH, 'foo', 'bar'));
    });
  });

  module('when `main` and `module` are defined in package.json', hooks => {
    hooks.beforeEach(() => {
      setupFakePackage({
        main: 'dist/whatever.js',
        module: 'lib/whatever.js'
      });
    });

    hooks.afterEach(() => teardownFakePackage());

    test('finds directory of the `module` file of the given dependency', assert => {
      let foundLib = findLib('foo');

      assert.equal(foundLib, join(NODE_MODULES_PATH, 'foo', 'lib'));
    });

    test('finds directory of given dependency with optional libPath', assert => {
      let foundLib = findLib('foo', 'bar');

      assert.equal(foundLib, join(NODE_MODULES_PATH, 'foo', 'bar'));
    });

  });
});

function setupFakePackage(packageJson) {
  fixturify.writeSync(join(NODE_MODULES_PATH, 'foo'), {
    'package.json': JSON.stringify(packageJson)
  });
}

function teardownFakePackage() {
  delete require.cache[require.resolve('foo/package')];
  rimraf(join(NODE_MODULES_PATH, 'foo'));
}
