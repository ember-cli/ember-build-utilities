const Funnel = require('broccoli-funnel');
const semver = require('semver');

module.exports = function addonTree(addonName, project) {
  let addon = project.findAddonByName(addonName);
  let tree = addon.treeFor('addon');
  let options = {};

  if (semver.lt(project.emberCLIVersion(), '2.13.0')) {
    options.srcDir = 'modules';
  }

  return new Funnel(tree, options);
}