import defaultsDeep from 'lodash.defaultsdeep';
import shouldIncludeAddon from './addons/should-include';
import notifyAddonIncluded from './addons/notify-included';
import Funnel from 'broccoli-funnel';
import ConfigLoader from 'broccoli-config-loader';
import { dirname } from 'path';

export const DEFAULT_OPTIONS = {
  targets: {
    browsers: ['last 2 versions']
  }
};

export default class AbstractBuild {
  constructor(defaults = {}, options = {}) {
    let missingProjectMessage = 'You must pass through the default arguments passed into your ember-cli-build.js file.';

    if (arguments.length === 0) {
      throw new Error(missingProjectMessage);
    }

    if (!defaults.project) {
      throw new Error(missingProjectMessage);
    }

    this.options = defaultsDeep(options, defaults);
    this.project = options.project;
    this.env = options.project.env;
    this.isProduction = (this.env === 'production');
    this._cachedConfigTree = null;
  }

  initializeAddons() {
    this.project.initializeAddons();
  }

  dependencies(pkg) {
    return this.project.dependencies(pkg);
  }

  _notifyAddonIncluded() {
    this.initializeAddons();
    let { blacklist, whitelist } = this.options.addons;
    notifyAddonIncluded(this.project, blacklist, whitelist, addon => {
      addon.app = this;

      if (shouldIncludeAddon(addon, blacklist, whitelist)) {
        if (addon.included) {
          addon.included(this);
        }

        return addon;
      }
    });
  }

  _configTree(destDir = `${this.name}/config`) {
    if (!this._cachedConfigTree) {
      let configPath = this.project.configPath();
      let configTree = new ConfigLoader(dirname(configPath), {
        env: this.env,
        tests: this.tests,
        project: this.project,
      });

      this._cachedConfigTree = new Funnel(configTree, {
        srcDir: '/',
        destDir,
        annotation: 'Funnel (config)',
      });
    }

    return this._cachedConfigTree;
  }

  typeScriptTree() {}

  esLatestTree() {
    throw new Error('Must implement');
  }

  esTree() {
    throw new Error('Must implement');
  }

  package() {
    throw new Error('Must implement');
  }

  index() {
    throw new Error('Must implement');
  }

  toTree() {
    throw new Error('Must implement');
  }
}
