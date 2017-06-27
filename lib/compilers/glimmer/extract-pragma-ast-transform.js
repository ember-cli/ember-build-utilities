const PRAGMA_TAG = 'use-component-manager';

function extractPragmaPlugin(env) {
  return {
    name: 'extract-pragma',

    visitor: {
      MustacheStatement: {
        enter(node) {
          if (node.path.type === 'PathExpression' && node.path.original === PRAGMA_TAG) {
            env.meta.managerId = node.params[0].value;
            return null;
          }
        }
      }
    }
  }
}

module.exports = extractPragmaPlugin;
