import { GitClient, openPullRequest } from './version-control';
import { GitUser } from './interfaces';

/** Jenkins build number */
const BUILD_NUMBER = process.env.BUILD_NUMBER || 0;

/**
 * -u, --user <USERNAME> (git user)
 * -p, --password <PASSWORD> (git password)
 * -v <VERSION> (version of the library)
 * -b <BRANCH_NAME>
 * --cwd <PATH_TO_DIR> (optional otherwise current working directory would be taken)
 */
async function main(args: string[]) {
  const { u, user, p, password, cwd, v, b } = require('minimist')(args);
  const gitUser: GitUser =  {
    username: u || user,
    password: p || password,
  };

  const git = new GitClient(cwd);
  git.currentBranch = b;
  git.addCredentials(gitUser);

  await git.commit(`feat(library): New library for version ${v} was generated.`);

  const suffix = `${v.replace(/\./g, '-')}-${BUILD_NUMBER}`;

  // when the branch name has the same suffix (build number and version)
  // it was created in this build and we need to open a pull request
  if (b.endsWith(suffix)) {
    await openPullRequest(b, gitUser, v);
  }
}

main(process.argv)
.then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
