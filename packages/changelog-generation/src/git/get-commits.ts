import { executeCommand as exec } from '@sketchmine/node-helpers';
import { GitVersion, GitCommit } from './git.interface';

/**
 * replaces new lines inside the { ... } in a string
 * @example
```
{"message": "this is a commit message"},
{"message": "this is a commit message

with new lines

"},
{"message": "another commit"},`
```

results in:

```
{"message": "this is a commit message"},
{"message": "this is a commit messageasdfasdfwith new linesasdfasdf"},
{"message": "another commit"}
```
*/
const ESCAPE_NEWLINE_REGEX = /[\r?\n](?!\{)/g;

const commitProperties = {
  hash: '%H',
  abbrevHash: '%h',
  authorName: '%an',
  authorEmail: '%ae',
  authorDate: '%ai',
  authorDateRel: '%ar',
  committerName: '%cn',
  committerEmail: '%ce',
  committerDate: '%cd',
  committerDateRel: '%cr',
  subject: '%s',
  body: '%b',
};

export async function getCommits(startToEnd: string[] = ['HEAD']): Promise<GitVersion> {
  const format = JSON.stringify(commitProperties);
  const pretty = ` --pretty="format:${format.replace(/\"/g, '\\"')},"`;

  const fromTo = startToEnd.length > 1 ? startToEnd.join('..') : startToEnd[0];
  const cmd = `git log ${fromTo}${pretty}`;
  const gitLog = await exec(cmd);
  const parsed = gitLog
    .replace(ESCAPE_NEWLINE_REGEX, '\/n') // replace newlines in commit messages with placeholder
    .slice(0, -1); // remove the last comma

  const commits = JSON.parse(`[${parsed}]`) as GitCommit[];
  const versionDate = new Date(commits[0].authorDate);

  return {
    date: {
      y: versionDate.getFullYear(),
      m: versionDate.getMonth(),
      d: versionDate.getDay(),
    },
    version: startToEnd.pop(),
    commits,
  };
}
