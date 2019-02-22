import { resolveLocal } from '../../lib';
import { module, test } from 'qunit';

module('Resolve Local');

test('handles absolute paths', function(assert) {
  assert.equal(resolveLocal('/foo/bar', '/baz/bar'), '/baz/bar');
});

test('resolve local path', function(assert) {
  assert.equal(resolveLocal('/foo/bar', './baz'), '/foo/bar/baz');
});
