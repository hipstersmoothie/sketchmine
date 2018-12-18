import { ChangelogDate } from '../changelog.interface';

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
  date: ChangelogDate;
  version: string;
  commits: GitCommit[];
}
