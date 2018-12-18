export interface GitCommit {
  hash: string;
  abbrevHash: string;
  authorName: string;
  authorEmail: string;
  authorDate: string;
  authorDateRel: string;
  committerName: string;
  committerEmail: string;
  committerDate: string;
  committerDateRel: string;
  subject: string;
  body: string;
}

export interface GitVersion {
  name?: string;
  version: string;
  commits: GitCommit[];
}
