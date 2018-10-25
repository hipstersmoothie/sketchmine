const fs = require('fs');
const exec = require('child_process').exec;
const COMMIT_REGEX = new RegExp(/[A-Z]{2,4}-[0-9]{4,5}\s(build|ci|docs|feat|fix|perf|refactor|style|test)\((.+?)\):\s(.+)/gm);
const COMMIT_MESSAGE = version => `UX-0000 ci(sketch-validator): Automatic release: ${version} [skip-ci]`;

async function main(commit, pathToPackageJson) {
  if (!commit || !pathToPackageJson) {
    throw new Error('Please provide a git commit hash and a path to the package json')
  }

  const commitMessage = await getCommitMessage(commit);

  if (!commitMessage.match(COMMIT_REGEX)) {
    throw new Error('Commit message does not follow the commit guidelines! You can read them in the CONTRIBUTING.md');
  }

  const package = require(pathToPackageJson);
  const commitParts = COMMIT_REGEX.exec(commitMessage);

  if (commitParts[2].includes('sketch-validator')) {
    const bumped = bumpVersion(commitParts[1], package.version)
    updatePackageVersion(bumped, package, pathToPackageJson)
    await commitChanges(COMMIT_MESSAGE(bumped));
    return bumped
  }
  return 'no-version';
}

function updatePackageVersion(version, package, packagePath) {
  package.version = version;
  const content = JSON.stringify(package, null, 2);

  fs.writeFileSync(packagePath, `${content}\n`);
}


function bumpVersion(scope, curVersion) {
  const version = curVersion.split('.');
  switch(scope) {
    case 'fix':
      version[2]++;
      break;
    case 'feat':
      version[1]++;
      version[2] = 0;
      break;
  }
  return version.join('.');
}

async function getCommitMessage(commit) {
  return run(`git log --format=%B -n 1 ${commit}`);
}

async function commitChanges(message) {
  await run('git add .');
  await run(`git commit -m "${message}"`);
  await run('git push origin');
}

async function run(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err !== null){
        reject(err);
      } else if (typeof(stderr) != "string"){
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}


/** Call the main function with command line args */
/**
 * you have to provide two params
 * -p (path to the package.json)
 * -c commit hash
 */
if (require.main === module) {
  const args = parseCommandLineArgs(process.argv.slice(2));
  main(args.c, args.p)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then((version) => {
    console.log(version)
    process.exit(0);
  });
}



function parseCommandLineArgs(args) {
  const obj = {};
  let key = '';
  for (let i = 0, max = args.length; i < max; i++) {
    if (i % 2 === 0) {
      key = args[i].replace(/-/gm, '');
    } else {
      obj[key] = args[i];
    }
  }
  return obj;
}
