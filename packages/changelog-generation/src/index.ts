import { executeCommand as exec, readFile } from '@sketchmine/node-helpers';
import { getCommits, getVersionTags, GitVersion } from './git';
import { render } from './renderer';
import { transformer } from './transformer';
import { resolve } from 'path';

const file = resolve('CHANGELOG.md');

async function main(): Promise<void> {
  const versions: GitVersion[] = [];
  // const tags = await getVersionTags();
  // // insert undefined as placeholder
  // tags.unshift(undefined);

  const tags = ['v2.1.0', 'v2.2.0'];

  for (let i = 0, max = tags.length; i < max; i += 1) {
    if (i % 2) {
      const arr = [tags[i - 1], tags[i]].filter(v => v !== undefined);
      versions.push(await getCommits(arr));
    } else if (tags.length - 1 === i) {
      versions.push(await getCommits([tags[i]]));
    }
  }

  const ctx = {
    versions: transformer(versions),
  };

  const result = await render('templates/changelog.hbs', ctx);
  console.log(result);
}

main().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
