const utils = require('./utils');
const ANGULAR_COMPONENTS_API = 'https://artifactory.lab.dynatrace.org/artifactory/npm-dynatrace-release-local/.npm/%40dynatrace/angular-components/package.json'
/**
 * Call the main function with command line args
 *
 * @see
 * you have to provide following params
 * -p path to package.json
 */
if (require.main === module) {
  const version = utils.getLatestVersion(ANGULAR_COMPONENTS_API)
  .then(version => {
    console.log(version);
  });
}
