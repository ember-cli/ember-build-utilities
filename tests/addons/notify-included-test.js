import { notifyAddonIncluded } from '../../lib';
import { module, test } from 'qunitjs';

module('Notify Included', {
  beforeEach() {
    this.project = {
      addons: [
        {
          name: 'a'
        },
        {
          name: 'b'
        }
      ]
    };
  }
});

test('allows caller to notify', function(assert) {
  let addons = [];
  notifyAddonIncluded(this.project, [], [], (addon) => {
    addons.push(addon.name);
    return addon;
  });

  assert.deepEqual(addons, ['a', 'b']);
});


test('blacklist throws if unavailable addon is specified', function(assert) {
  assert.throws(() => {
    notifyAddonIncluded(this.project, ['bake'], [], (addon) => {});
  }, /Addon "bake" defined in blacklist is not found/);
});

test('whitelist throws if unavailable addon is specified', function(assert) {
  assert.throws(() => {
    notifyAddonIncluded(this.project, [], ['off'], (addon) => {});
  }, /Addon "off" defined in whitelist is not found/);
});
