interface Reviewer {
  user: { name: string; };
}

interface Ref {
  id: string;
}

interface BitbucketPullRequest {
  title: string;
  description: string;
  state: 'OPEN' | 'CLOSE';
  closed: boolean;
  fromRef: Ref;
  toRef: Ref;
  locked: false;
  reviewers: Reviewer[];
}

export class PullRequest {

  title: string = 'Automatic Library update.';
  description: string = `**New Library updates** 🚀
Please update your sketch library!.`;
  reviewers: string[] = [];

  constructor(public branch: string) {}

  addReviewer(name: string) {
    this.reviewers.push(name);
  }

  getReviewers(): Reviewer[] {
    return this.reviewers.map((name: string) => { return { user: { name } }; });
  }

  create(): BitbucketPullRequest {
    return {
      title: this.title,
      description: this.description,
      state: 'OPEN',
      closed: false,
      fromRef: { id: `refs/heads/${this.branch}` },
      toRef: { id: 'refs/heads/master' },
      locked: false,
      reviewers: this.getReviewers(),
    };
  }
}
