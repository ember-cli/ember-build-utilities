import { module, test } from 'qunitjs';
import { buildOutput, createTempDir } from 'broccoli-test-helper';
import { GlimmerTemplatePrecompiler, getTemplateSpecifier } from '../../lib/';
import co from 'co';

module('glimmer-template-precompiler', function(hooks) {
  let input = null;

  hooks.beforeEach(() => {
    return createTempDir().then(tempDir => (input = tempDir));
  });

  hooks.afterEach(() => {
    input.dispose();
  });

  module('pragma tag extraction (`glimmer-custom-component-manager` feature flag)', () => {
    test('custom component manager id is undefined but default', (assert) => {
      assert.expect(1);

      let templateContent = 'nyan cat!';

      let templateCompiler = new GlimmerTemplatePrecompiler(input.path(), {
        rootName: 'nyan-app'
      });

      let options = { meta: {} };
      templateCompiler.precompile(templateContent, options);

      assert.equal(options.meta.managerId, undefined);
    });

    test('custom component manager id is extracted from pragma tag', (assert) => {
      assert.expect(2);

      let templateContent = `{{use-component-manager "glimmer"}} nyan cat!`;

      let templateCompiler = new GlimmerTemplatePrecompiler(input.path(), {
        rootName: 'nyan-app',
        GlimmerENV: {
          FEATURES: {
            'glimmer-custom-component-manager': true
          }
        }
      });

      let options = { meta: {} };
      templateCompiler.precompile(templateContent, options);

      assert.equal(options.meta.managerId, 'glimmer');
      assert.equal(templateCompiler.plugins.ast.length, 1, 'ExtractPragmaTag plugin was registered');
    });

    test('custom component manager is not available if feature flag is off', (assert) => {
      assert.expect(1);

      let templateContent = `nyan cat!`;

      let templateCompiler = new GlimmerTemplatePrecompiler(input.path(), {
        rootName: 'nyan-app',
        GlimmerENV: {
          FEATURES: {}
        }
      });

      let options = { meta: {} };
      templateCompiler.precompile(templateContent, options);

      assert.equal(templateCompiler.plugins.ast.length, 0, 'ExtractPragmaTag plugin was not registered');
    });
  });

  module('template metadata', () => {
    test('specifier is present in metadata', co.wrap(function *(assert) {
      assert.expect(1);

      let templateContent = 'nyan cat!';

      class MockTemplatePrecompiler extends GlimmerTemplatePrecompiler {
        precompile(_content, metaObj) {
          assert.equal(metaObj.meta.specifier, 'template:/nyan-app/components/nyan-cat');
          return templateContent;
        }
      }

      input.write({
        'ui': {
          'components': {
            'nyan-cat.hbs': templateContent
          }
        }
      });

      let templateCompiler = new MockTemplatePrecompiler(input.path(), { rootName: 'nyan-app' });
      yield buildOutput(templateCompiler);
    }));
  });

  module('basic broccoli functionality', () => {
    class MockTemplatePrecompiler extends GlimmerTemplatePrecompiler {
      precompile(content) {
        return content.toUpperCase();
      }
    }

    test('emits the precompiler as a default export', co.wrap(function *(assert) {
      input.write({
        'ui': {
          'components': {
            'foo-bar.hbs': '"some template here"'
          }
        }
      });

      let templateCompiler = new MockTemplatePrecompiler(input.path(), { rootName: 'foo-bar-app' });
      let output = yield buildOutput(templateCompiler);

      assert.deepEqual(output.read(), {
        'ui': {
          'components': {
            'foo-bar.ts': 'export default "SOME TEMPLATE HERE";'
          }
        }
      });
    }));
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
