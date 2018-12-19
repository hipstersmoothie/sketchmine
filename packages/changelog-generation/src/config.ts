export default {
  /** @see https://regex101.com/r/xy19V6/2 */
  commitRegex: /^([A-Z]{2,4}-[0-9]{4,5}\s)?(\w+?)(?:\((.+?)\))?:\s(.+)/,
  commitTypes: {
    // build: 'Build Improvements',
    // ci: 'Continuous Integration',
    // docs: 'Documentation',
    feat: 'Features',
    fix: 'Bug Fixes 🐞',
    perf: 'Performance Improvements 🍻',
    // refactor: 'Code Refactoring',
    // style: 'Styles',
    // test: 'Tests',
  },
  globals: {
    githubUrl: 'https://github.com/Dynatrace/sketchmine/',
    jiraIssueUrl: 'https://dev-jira.dynatrace.org/browse/',
  },
};
