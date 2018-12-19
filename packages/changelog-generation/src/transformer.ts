import { GitVersion, GitCommit } from './git';
import { ChangelogCommit, ChangelogVersion, CommitAuthor, ChangelogConfig } from './changelog.interface';

export function transformer(versions: GitVersion[], config: ChangelogConfig): ChangelogVersion[] {
  const modified = versions.map((version: GitVersion): ChangelogVersion => {

    const commits: ChangelogCommit[] = version.commits
      .map((commit: GitCommit) => transformCommit(commit, config))
      .filter(c => c !== undefined);

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

export function transformCommit(gitCommit: GitCommit, config: ChangelogConfig): ChangelogCommit | undefined {
  const matches = gitCommit.subject.trim().match(config.commitRegex);

  // only commits that pass the regex should be listed in the changelog
  if (
    !matches ||
    !matches[2] || // type like (chore, refactor, docs, etc...) is required
    !matches[4] // message is required for changelog as well
  ) {
    return;
  }

  const headline = getCommitType(matches[2], config);

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

/**
 * Get the committers for an array of commits.
 * @param commits Array of Commits
 */
function getComitters(commits: GitCommit[]): CommitAuthor[] {

  const contributors = commits.map(c => `{"name":"${c.authorName}","email":"${c.authorEmail}"}`);
  const unique = [...new Set(contributors)];

  return JSON.parse(`[${unique.join(',')}]`);
}

/**
 * Create a human readable headline out of the commit type
 * @param type the type like fix, feat...
 */
function getCommitType(type: string, config: ChangelogConfig): string | undefined {

  // if no configuration is provided return the type as headlines
  if (!config.commitTypes) {
    return type;
  }

  if (config.commitTypes.hasOwnProperty(type)) {
    return config.commitTypes[type];
  }
  // return undefined if the type is not in the configuration,
  // then we want to drop it!
  return undefined;
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
