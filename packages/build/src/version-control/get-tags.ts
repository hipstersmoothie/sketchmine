import { request, RequestOptions } from 'https';
import { ClientRequest, IncomingMessage } from 'http';
import {  BitbucketTagList } from '../interfaces';

export function getTags(
  repositorySlug = 'global-resources',
  projectKey = 'UX',
): Promise<string[] | undefined> {
  const options: RequestOptions = {
    host: 'bitbucket.lab.dynatrace.org',
    // tslint:disable-next-line: max-line-length
    path: `/rest/api/1.0/projects/${projectKey}/repos/${repositorySlug}/tags`,
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
          const tags: BitbucketTagList = JSON.parse(Buffer.concat(chunks).toString());

          if (tags.hasOwnProperty('exceptionName')) {
            reject(tags);
          }

          if (tags.values.length > 0) {
            resolve(tags.values.map(t => t.displayId));
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
