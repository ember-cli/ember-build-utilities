import { module, test } from 'qunitjs';
import { buildOutput, createTempDir } from 'broccoli-test-helper';
import { GlimmerTemplatePrecompiler, getTemplateSpecifier } from '../../lib/';

module('glimmer-template-precompiler', function(hooks) {
  let input = null;

  hooks.beforeEach(() => {
    return createTempDir().then(tempDir => (input = tempDir));
  });

  hooks.afterEach(() => {
    input.dispose();
  });

  module('basic broccoli functionality', () => {
    class MockTemplatePrecompiler extends GlimmerTemplatePrecompiler {
      precompile(content) {
        return content.toUpperCase();
      }
    }

    test('emits the precompiler as a default export', async function(assert) {
      input.write({
        'ui': {
          'components': {
            'foo-bar.hbs': '"some template here"'
          }
        }
      });

      let templateCompiler = new MockTemplatePrecompiler(input.path(), { rootName: 'foo-bar-app' });
      let output = await buildOutput(templateCompiler);

      assert.deepEqual(output.read(), {
        'ui': {
          'components': {
            'foo-bar.ts': 'export default "SOME TEMPLATE HERE";'
          }
        }
      });
    });
  });

  module('getTemplateSpecifier', () => {
    const rootName = 'some-root-name';

    const cases = [
      ['ui/components/foo-bar/template.hbs', 'template:/some-root-name/components/foo-bar'],
      ['ui/components/foo-bar.hbs', 'template:/some-root-name/components/foo-bar'],
    ];

    cases.forEach(function(parts) {
      let input = parts[0];
      let expected = parts[1];

      test(input, assert => {
        assert.equal(getTemplateSpecifier(rootName, input), expected);
      });
    });
  });
});
