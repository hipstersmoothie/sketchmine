export default {
  /** @see https://regex101.com/r/xy19V6/2 */
  commitRegex: /^([A-Z]{2,4}-[0-9]{4,5}\s)?(\w+?)(?:\((.+?)\))?:\s(.+)/,
  commitTypes: [
    'build', // Changes that affect the build system or external dependencies (rollup, yarn)
    'ci', // Changes to our CI configuration files and scripts (azure-pipelines, jenkins)
    'docs', // Documentation only changes
    'feat', // A new feature
    'fix', // A bug fix
    'perf', // A code change that improves performance
    'refactor', // A code change that neither fixes a bug nor adds a feature
    'style', // Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
    'test', // Adding missing tests or correcting existing tests
    'chore', // Other changes that don't modify src or test files
  ],
};
