const DEFAULT_OPTIONS = {
  targets: {
    browsers: ['last 2 versions']
  }
};

class AbstractBuild {
  constructor(options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.project = options.project;
    this.env = options.project.env;
  }

  typeScriptTree() {}

  esNextTree() {
    throw new Error('Must implement');
  }

  esTree() {
    throw new Error('Must implement');
  }

  package() {
    throw new Error('Must implement');
  }
}

module.exports = AbstractBuild;