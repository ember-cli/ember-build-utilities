import { shouldIncludeAddon } from '../../lib';
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

test('an addon that is disabled is not included', function(assert) {
  let addon = { isEnabled() { return false; } };
  assert.notOk(shouldIncludeAddon(addon));
});

test('an addon that is not disabled, not blacklisted, not whitelisted, is included', function(assert) {
  let addon = { };
  assert.ok(shouldIncludeAddon(addon));
});

test('throws an error if both whitelist and blacklist are empty arrays', function(assert) {
  assert.throws(() => {
    shouldIncludeAddon({}, [], []);
  }, /Both `whitelist` and `blacklist` cannot be empty arrays/);
});
