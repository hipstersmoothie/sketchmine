import { request, RequestOptions } from 'https';
import { ClientRequest, IncomingMessage } from 'http';
import { BitbucketBranchList } from '../interfaces';

export function findBranchesWithPrefix(
  prefix: string,
  repositorySlug = 'global-resources',
  projectKey = 'UX',
): Promise<string[] | undefined> {
  const options: RequestOptions = {
    host: 'bitbucket.lab.dynatrace.org',
    // tslint:disable-next-line: max-line-length
    path: `/rest/api/1.0/projects/${projectKey}/repos/${repositorySlug}/branches?filterText=${prefix}&orderBy=MODIFICATION`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    const clientRequest: ClientRequest = request(options, (res: IncomingMessage) => {
      const chunks: Uint8Array[] = [];
      res.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      res.on('end', () => {
        try {
          const branchList: BitbucketBranchList = JSON.parse(Buffer.concat(chunks).toString());

          if (branchList.values.length > 0) {
            resolve(branchList.values.map(b => b.displayId));
          } else {
            resolve(undefined);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    clientRequest.end();
  });
}
