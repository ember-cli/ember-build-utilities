import { resolveLocal } from '../../';
import { module, test } from 'qunitjs';

module('Resolve Local');

test('handles absolute paths', (assert) => {
  assert.equal(resolveLocal('/foo/bar', '/baz/bar'), '/baz/bar');
});

test('resolve local path', (assert) => {
  assert.equal(resolveLocal('/foo/bar', './baz'), '/foo/bar/baz');
});