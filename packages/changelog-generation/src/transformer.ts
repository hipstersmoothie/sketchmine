import { GitVersion, GitCommit } from './git';
import config from './config';
import { ChangelogCommit, ChangelogVersion, CommitAuthor } from './changelog.interface';

export function transformer(versions: GitVersion[]): ChangelogVersion[] {
  const modified = versions.map((version: GitVersion): ChangelogVersion => {

    const commits: ChangelogCommit[] = version.commits
      .map((commit: GitCommit) => transformCommit(commit))
      .filter(c => c !== undefined);

    const contributors = version.commits.map(c => `${c.authorName}<${c.authorEmail}>`);

    const grouped = groupBy(commits, (x: ChangelogCommit) => x.headline);

    return {
      date: version.date,
      version: version.version,
      types: grouped,
      contributors: getComitters(version.commits),
    };
  });

  return modified;
}

const GITHUB_ISSUE_REGEX = /#\d+/gm;

export function transformCommit(gitCommit: GitCommit): ChangelogCommit | undefined {
  const matches = gitCommit.subject.trim().match(config.commitRegex);

  // only commits that pass the regex should be listed in the changelog
  if (
    !matches ||
    !matches[2] || // type like (chore, refactor, docs, etc...) is required
    !matches[4] // message is required for changelog as well
  ) {
    return;
  }

  const headline = getCommitType(matches[2]);

  // if the headline is undefined no matching type found
  // or it is a chore that should not be displayed in the changelog then skip it.
  if (!headline) {
    return;
  }

  const date = new Date(gitCommit.authorDate);

  const commit = {
    headline,
    hash: gitCommit.abbrevHash,
    date: {
      y: date.getFullYear(),
      m: date.getMonth(),
      d: date.getDay(),
    },
    author: {
      name: gitCommit.authorName,
      email: gitCommit.authorEmail,
    },
    gitIssues: [],
    bitbucketIssues: matches[1] ? [matches[1]] : [],
    scopes: matches[3] ? matches[3] : '',
    type: matches[2],
    message: matches[4],
  };

  // check if there are github issues in the message
  const gitIssues = matches[4].match(GITHUB_ISSUE_REGEX);
  if (gitIssues) {
    commit.gitIssues = gitIssues;
  }

  return commit;
}

function getComitters(commits: GitCommit[]): CommitAuthor[] {

  const contributors = commits.map(c => `{"name":"${c.authorName}","email":"${c.authorEmail}"}`);
  const unique = [...new Set(contributors)];

  return JSON.parse(`[${unique.join(',')}]`);
}

/**
 * Create a human readable headline out of the commit type
 * @param type the type like fix, feat...
 */
function getCommitType(type: string): string | undefined {
  switch (type) {
    // case 'build': return 'Build Improvements';
    // case 'ci': return 'Continuous Integration';
    // case 'docs': return 'Documentation';
    case 'feat': return 'Features ';
    case 'fix': return 'Bug Fixes 🐞';
    case 'perf': return 'Performance Improvements';
    // case 'refactor': return 'Code Refactoring';
    // case 'style': return 'Styles';
    // case 'test': return 'Tests';
    default: return;
  }
}

/**
* Group object array by property
 * Example, groupBy(array, ( x: Props ) => x.id );
 * @param array
 * @param property
 */
export const groupBy = <T>(array: T[], property: (x: T) => string): { [key: string]: T[] } =>
  array.reduce((memo: { [key: string]: T[] }, x: T) => {
    if (!memo[property(x)]) {
      memo[property(x)] = [];
    }
    memo[property(x)].push(x);
    return memo;
  // tslint:disable-next-line:align
  }, {});
