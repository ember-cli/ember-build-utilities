import { shouldIncludeAddon } from '../../';
import { module, test } from 'qunitjs';

module('Should Include Addon');

test('should include', function(assert) {
  assert.ok(shouldIncludeAddon({ name: 'b' }, [], ['b']));
});

test('should not include', function(assert) {
  assert.notOk(shouldIncludeAddon({ name: 'b' }, ['b'], []));
});

test('blacklist takes precedence over whitelist', function(assert) {
  assert.notOk(shouldIncludeAddon({ name: 'b' }, ['b'], ['b']));
});