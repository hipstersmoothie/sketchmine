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
  const match = gitCommit.subject.trim().match(config.commitRegex);
  const fullMatch = match ? match[0] : undefined;
  const bitbucketIssues = match ? [match[1]] : [];
  const commitType = match ? match[2] : undefined;
  const scopes = match ? match[3] : '';
  const message = match ? match[4] : undefined;

  // only commits that pass the regex should be listed in the changelog
  if (
    !fullMatch ||
    !commitType || // type like (chore, refactor, docs, etc...) is required
    !message // message is required for changelog as well
  ) {
    return;
  }

  const headline = getCommitType(commitType, config);

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
    bitbucketIssues,
    scopes,
    commitType,
    message,
  };

  // check if there are github issues in the message
  const gitIssues = message.match(GITHUB_ISSUE_REGEX);
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
