export interface Commit {
  hash: string;
  author: CommitAuthor;
  gitIssues: string[];
  bitbucketIssues: string[];
  scopes: string;
  type: string;
  message: string;
}

export interface CommitAuthor {
  name: string;
  email: string;
}

export interface CommitIssue {
  number: string;
  url: string;
}
