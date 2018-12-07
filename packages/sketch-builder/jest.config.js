const base = require('../../jest.config.base');
const pkg = require('./package.json');

module.exports = {
  ...base,
  name: pkg.name,
  displayName: `${pkg.name} – v${pkg.version}`,
  collectCoverage: false, // coverage injects in headless chrome and breaks element-fetcher
};
