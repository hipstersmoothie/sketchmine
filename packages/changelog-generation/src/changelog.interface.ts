export interface ChangelogCommit {
  headline: string;
  hash: string;
  author: CommitAuthor;
  date: ChangelogDate;
  gitIssues: string[];
  bitbucketIssues: string[];
  scopes: string;
  commitType: string;
  message: string;
}

export interface ChangelogDate {
  y: number;
  m: number;
  d: number;
}

export interface CommitAuthor {
  name: string;
  email: string;
}

export interface ChangelogVersion {
  date: ChangelogDate;
  version: string;
  contributors: CommitAuthor[];
  types: { [key: string]: ChangelogCommit[] };
}

export interface ChangelogConfig {
  commitRegex: RegExp;
  commitTypes?: { [key: string]: string };
  globals?: { [key: string]: string };
}
