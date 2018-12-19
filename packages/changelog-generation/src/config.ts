import { ChangelogConfig } from './changelog.interface';

/**
 * @property commitReges – @see https://regex101.com/r/xy19V6/2
 * @property commitTypes - the types that should be used in the changelog
 * only the types that are in this object will be printed to the changelog
 * @property globals – handlebars global variables
 */
export default {
  commitRegex: /^([A-Z]{2,4}-[0-9]{4,5}\s)?(\w+?)(?:\((.+?)\))?:\s(.+)/,
  commitTypes: {
    feat: 'Features',
    fix: 'Bug Fixes 🐞',
    perf: 'Performance Improvements 🍻',
  },
  globals: {
    githubUrl: 'https://github.com/Dynatrace/sketchmine/',
    jiraIssueUrl: 'https://dev-jira.dynatrace.org/browse/',
  },
} as ChangelogConfig;
