import { request, RequestOptions } from 'https';
import { ClientRequest, IncomingMessage } from 'http';

import { PullRequest } from './pull-request';
import { GitUser } from '../interfaces';

export function openPullRequest(
  branch: string,
  user: GitUser,
  version: string,
  repositorySlug = 'global-resources',
  projectKey = 'UX',
): Promise<void> {
  const options = {
    auth: `${user.username}:${decodeURIComponent(user.password)}`,
    host: 'bitbucket.lab.dynatrace.org',
    path: `/rest/api/1.0/projects/${projectKey}/repos/${repositorySlug}/pull-requests`,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  };

  const pr = new PullRequest(branch);
  pr.title = `Automatic Library update for Angular Components version: ${version}`;
  pr.addReviewer('simon.ludwig');
  pr.addReviewer('Ursula.Wieshofer');

  return new Promise((resolve, reject) => {
    const req: ClientRequest = request(options, (res: IncomingMessage) => {
      const chunks: Uint8Array[] = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () =>  resolve());
    });

    req.on('error', err =>  reject(err));
    req.write(JSON.stringify(pr.create()));
    req.end();
  });
}
