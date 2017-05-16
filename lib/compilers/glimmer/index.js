const path = require('path');
const Filter = require('broccoli-persistent-filter');
const { precompile } = require('@glimmer/compiler');
const ExtractPragmaPlugin = require('./extract-pragma-ast-transform');

function isFeatureFlagEnabled(features, flagName) {
  return features && !!features[flagName];
}

export default class GlimmerTemplatePrecompiler extends Filter {
  constructor(inputNode, options) {
    super(inputNode, { persist: false }); // TODO: enable persistent output

    this.extensions = ['hbs'];
    this.targetExtension = 'ts';
    this.rootName = options.rootName;
    this.glimmerEnv = options.GlimmerENV || {};
    this.plugins = options.plugins || {};
    this.plugins.ast = this.plugins.ast || [];

    if (isFeatureFlagEnabled(this.glimmerEnv.FEATURES, 'glimmer-custom-component-manager')) {
      this.registerPlugin(ExtractPragmaPlugin);
    }
  }

  registerPlugin(plugin) {
    this.plugins.ast.push(plugin);
  }

  processString(content, relativePath) {
    let specifier = getTemplateSpecifier(this.rootName, relativePath);
    let meta = { specifier, managerId: undefined };

    let precompiledContent = this.precompile(content, { meta })

    return `export default ${precompiledContent};`;
  }

  precompile(content, _options) {
    let plugins = this.plugins;
    let options = Object.assign({}, _options, { plugins });

    return precompile(content, options);
  }
}

export function getTemplateSpecifier(rootName, relativePath) {
  let pathParts = relativePath.split('/');
  pathParts.shift();

  // TODO - should use module map config to be rigorous
  if (pathParts[pathParts.length - 1] === 'template.hbs') {
    pathParts.pop();
  }

  if (path.extname(pathParts[pathParts.length - 1]) === '.hbs') {
    let fileName = pathParts.pop();

    pathParts.push(path.basename(fileName, '.hbs'));
  }

  if (pathParts[0] === 'ui') {
    pathParts.shift();
  }

  return `template:/${rootName}/${pathParts.join('/')}`;
}
