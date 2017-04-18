import { module, test, only } from 'qunitjs';
import { featuresForTargets } from '../../lib';
import browserslist from 'browserslist';

module('targets');

test(`should set feature flag to "false" if consumer doesn't the polyfill`, assert => {

  let flags = featuresForTargets({
    browsers: ['last 2 Safari versions']
  }, {
    'weak_map': ['ie 9']
  });

  assert.deepEqual(flags, {
    'weak_map': false
  });
});

test(`should set feature flag to "true" if consumer needs the polyfill`, assert => {

  let flags = featuresForTargets({
    browsers: ['> 1%']
  }, {
    'weak_map': ['ie 11']
  });

  assert.deepEqual(flags, {
    'weak_map': true
  });
});

test(`should normalize browser names`, assert => {

  let browsers = browserslist(['> 1%']);

  let flags = featuresForTargets({
    browsers: ['> 1%']
  }, {
    'weak_map': ['ios 10.0-10.2']
  });

  assert.ok(browsers.indexOf('ios 10.0-10.2') === -1);
  assert.ok(browsers.indexOf('ios_saf 10.0-10.2') > -1);
  assert.deepEqual(flags, {
    'weak_map': true
  });
});
