import { findBranchesWithPrefix, GitClient, openPullRequest } from './version-control';
import { GitUser } from './interfaces';

/** Prefix for the branch in the design repository */
const BRANCH_PREFIX = 'feat/library-version-update';
/** Jenkins build number */
const BUILD_NUMBER = process.env.BUILD_NUMBER || 0;

/**
 * -u, --user <USERNAME> (git user)
 * -p, --password <PASSWORD> (git password)
 * -v <VERSION> (version of the library)
 * --cwd <PATH_TO_DIR> (optional otherwise current working directory would be taken)
 */
async function main(args: string[]) {
  const { u, user, p, password, cwd, v } = require('minimist')(args);
  const gitUser: GitUser =  {
    username: u || user,
    password: p || password,
  };

  try {
    const git = new GitClient(cwd);
    const branches = await findBranchesWithPrefix(BRANCH_PREFIX);

    git.addCredentials(gitUser);

    const name = (!branches || !branches.length) ? `${BRANCH_PREFIX}-${BUILD_NUMBER}` : branches[0];
    await git.checkoutBranch(name, !branches);
    await git.commit(`feat(library): New library for version ${v} was generated.`);

    // when the branch does not exist open a pull request
    if (!branches) {
      await openPullRequest(name, gitUser, v);
    }
  } catch (error) {
    throw Error(`Commit and open Pull Request failed with following error: ${error}`);
  }
}

main(process.argv)
.then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
