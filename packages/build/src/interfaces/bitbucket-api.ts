/**
 * Interfaces according the API of Bitbucket Server
 * @see https://docs.atlassian.com/bitbucket-server/rest/5.16.0/bitbucket-rest.html
 */
export interface BitbucketBranchList extends BitbucketAPIList {
  values: BitBucketBranch[];
}
export interface BitbucketTagList extends BitbucketAPIList {
  values: BitBucketBranch[];
}

export interface BitbucketAPIList {
  size: number;
  limit: number;
  isLastPage: boolean;
  values: (BitBucketBranch | BitbucketTag)[];
  start: number;
  nextPageStart?: number;
}

export interface BitBucketAPIEntry {
  id: string;
  displayId: string;
  latestCommit: string;
  latestChangeset: string;
}

export interface BitBucketBranch extends BitBucketAPIEntry {
  type: 'BRANCH';
  isDefault: boolean;
}

export interface BitbucketTag extends BitBucketAPIEntry {
  type: 'TAG';
  hash: any;
}
