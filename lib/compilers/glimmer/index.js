const path = require('path');
const Filter = require('broccoli-persistent-filter');
const { precompile } = require('@glimmer/compiler');

export default class GlimmerTemplatePrecompiler extends Filter {
  constructor(inputNode, options) {
    super(inputNode, { persist: false }); // TODO: enable persistent output

    this.extensions = ['hbs'];
    this.targetExtension = 'ts';
    this.rootName = options.rootName;
  }

  processString(content, relativePath) {
    let specifier = getTemplateSpecifier(this.rootName, removeManagerIdFromPath(relativePath));
    let managerId = getManagerIdFromPath(relativePath);
    let meta = { specifier, '<template-meta>': true };

    if (managerId) {
      meta.managerId = managerId;
    }

    return `export default ${this.precompile(content, { meta })};`;
  }

  precompile(content, options) {
    return precompile(content, options);
  }

  getDestFilePath(relativePath) {
    let processedPath = super.getDestFilePath(relativePath);

    if (!processedPath) return processedPath;

    return removeManagerIdFromPath(processedPath);
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

function getManagerIdFromPath(path) {
  let parts = path.split('.');
  let managerId = null;

  if (parts.length > 2) {
    let lastIndex = parts.length - 1;
    managerId = parts.splice(lastIndex - 1, 1)[0];
  }

  return managerId;
}

function removeManagerIdFromPath(path) {
  let parts = path.split('.');

  if (parts.length > 2) {
    let lastIndex = parts.length - 1;
    parts.splice(lastIndex - 1, 1);
  }

  return parts.join('.');
}
