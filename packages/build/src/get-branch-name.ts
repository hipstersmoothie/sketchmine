import { findBranchesWithPrefix, GitClient } from './version-control';
import { writeFile } from '@sketchmine/node-helpers';
import { resolve } from 'path';

/** Jenkins build number */
const BUILD_NUMBER = process.env.BUILD_NUMBER || 0;

/**
 * --prefix <BRANCH_PREFIX>
 * --version <VERSION>
 * -cwd <Current working directory>
 * --file (optional where branch name should be stored)
 */
async function main(args: string[]) {
  const { prefix, version, file, cwd } = require('minimist')(args);
  const git = new GitClient(cwd);

  const branches = await findBranchesWithPrefix(prefix);
  const name = (!branches || !branches.length) ?
    `${prefix}-${version.replace(/\./g, '-')}-${BUILD_NUMBER}` :
    branches[0];

  await git.checkoutBranch(name, !branches);

  const outFile = file || 'BRANCH';
  await writeFile(resolve(outFile), name);
}

main(process.argv.slice(2))
.then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
