const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const BREAKING_WORD = 'BREAKING_CHANGE'
const COMMIT_REGEX = new RegExp(/[A-Z]{2,4}-[0-9]{4,5}\s(build|ci|docs|feat|fix|perf|refactor|style|test)\((.+?)\):\s(.+)/gm);
// const COMMIT_MESSAGE = version => `UX-0000 ci(sketch-validator): Automatic release: ${version} [skip ci]`;
// const GIT_ORIGIN = (user, pass) => `https://${user}:${pass}@bitbucket.lab.dynatrace.org/scm/wx/ng-sketch.git`

// async function main(commit, pathToPackageJson, branch) {
//   if (!commit || !pathToPackageJson) {
//     throw new Error('Please provide a git commit hash and a path to the package json');
//   }

//   const commitMessage = await getCommitMessage(commit);

//   if (!commitMessage.match(COMMIT_REGEX)) {
//     throw new Error('Commit message does not follow the commit guidelines! You can read them in the CONTRIBUTING.md');
//   }

//   const package = require(pathToPackageJson);
//   const commitParts = COMMIT_REGEX.exec(commitMessage);

//   if (commitParts[2].includes('sketch-validator')) {
//     const bumped = bumpVersion(commitParts[1], package.version)
//     updatePackageVersion(bumped, package, pathToPackageJson)
//     await commitChanges(COMMIT_MESSAGE(bumped), branch, bumped);
//     return bumped
//   }
//   return 'no-version';
// }




// function bumpVersion(scope, curVersion) {
//   const version = curVersion.split('.');
//   switch(scope) {
//     case 'fix':
//       version[2]++;
//       break;
//     case 'feat':
//       version[1]++;
//       version[2] = 0;
//       break;
//   }
//   return version.join('.');
// }

// async function getCommitMessage(commit) {
//   return run(`git log --format=%B -n 1 ${commit}`);
// }

// async function commitChanges(message, branch, version) {
//   const origin = GIT_ORIGIN(process.env.GIT_USER, process.env.GIT_PASS);
//   const tag = `sketch-validator-${version}`;
//   await run('git add .');
//   await run(`git commit -m "${message}"`);
//   await run(`git tag -a ${tag} -m "This is an automatic version bump. [skip ci]"`);
//   await run(`git push ${origin} ${tag}`);
//   await run(`git push ${origin} HEAD:${branch}`);
// }
const https = require("https");
const SKETCH_VALIDATION_API = 'https://artifactory.lab.dynatrace.org/artifactory/npm-dynatrace-release-local/.npm/%40dynatrace/sketch-validation/package.json'

/**
 * @param {string} endpoint The endpoint to fetch the data from the dynatrace artifactory
 * @returns {string} latest version from artifactory
 */
async function getLatestVersion(endpoint) {
  const data = await getJSON(endpoint);
  return data['dist-tags'].latest;
}

/**
 * uses the node native https to get a JSON
 * @param {string} url url to get
 * @param {string} encoding default utf8
 * @returns {Object}
 */
function getJSON(url, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      res.setEncoding(encoding);
      let body = '';
      res.on('data', data => body += data);
      res.on('end', () => resolve(JSON.parse(body)))
    }).on('error', e => reject(e));
  })
}

/**
 * execute shell commands and return stdout as promise value
 * @param {string} command command that schould be executed by child_process
 * @returns {Promise<string>} Promise with the stdout string
 */
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

/**
 * bumps the version and returns string version
 * @param {string} current current version string in format major.minor.patch
 * @param {boolean} major major bump
 * @param {boolean} minor minor bump
 * @param {boolean} patch patch bump
 * @returns {string} bumped version
 */
function bumpVersion(current, major, minor, patch) {
  const version = current.split('.');

  if (major) {
    version[0]++;
    version[1] = 0;
    version[2] = 0;
  } else if (minor) {
    version[1]++;
    version[2] = 0;
  } else if (patch) {
    version[2]++;
  }
  return version.join('.');
}

/**
 *
 * @param {string} path path to the file
 * @param {string} content content
 * @param {boolean} insertFinalNewline if the file should end with a new line
 * @return {Promise<void | Error>}
 */
function writeFile(path, content, insertFinalNewline = true) {
  const contentWithNewLine = insertFinalNewline ? `${content}\n` : content;
  return new Promise((resolve, reject) => {
    fs.writeFileSync(path, contentWithNewLine, err => {
      if (err) {
       reject(err);
      }
      resolve();
    });
  });
}

/**
 *
 * @param {string} bumped bumped version
 * @param {*} package
 * @param {string} packagePath path to the package.json
 */
async function updatePackageVersion(bumpedVersion, packagePath) {
  const package = require(packagePath);
  package.version = bumpedVersion;
  const content = JSON.stringify(package, null, 2);

  await writeFile(packagePath, content);
  console.log(`✅ successfully written version ${version} to ${packagePath}`);
}

/**
 * bumps the version of the @dynatrace/sketch-validator npm package according to the commit messages
 * between the difference of two branches
 *
 * @param {string} baseBranch base branch to compare (default master)
 * @param {string} currentBranch your branch to compare (default HEAD)
 * @returns {string} bumped version
 */
async function main(baseBranch = 'master', currentBranch = 'HEAD') {
  const messageString = await run(`git log ${baseBranch}..${currentBranch} --pretty=format:"%s"`)
  let major = false;
  let minor = false;
  let patch = false;

  messageString
    .split('\n')
    .map(message => COMMIT_REGEX.exec(message))
    .forEach(message => {
      if (message && message[2].includes('sketch-validator')) {
        if (message[1] === 'fix') { patch = true; }
        if (message[1] === 'feat') { minor = true; }
        if (message[3].includes(BREAKING_WORD)) { major = true}
      }
    });

  if (!major && !minor && !patch) {
    return 'no-version'
  }

  const version = await getLatestVersion(SKETCH_VALIDATION_API);
  const bumped = bumpVersion(version, major, minor, patch);
  console.log('[@dynatrace/sketch-validator] versioning ➢ old version: ', version)
  console.log('[@dynatrace/sketch-validator] versioning ➢ bumped version: ', bumped)
  return bumped;
}

/**
 * Call the main function with command line args
 *
 * @see
 * you have to provide two params
 * -b base branch to compare (master)
 * -c current branch to compare (HEAD)
 * -p path to package.json
 */
if (require.main === module) {
  const args = parseCommandLineArgs(process.argv.slice(2));


  if (!args.p || !fs.existsSync(path.join(process.cwd(), args.p))) {
    throw new Error('You have to provide a path to the package.json');
  }

  main(args.b, args.c)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(async (version) => {
    await writeFile('.validator-version', version, false);
    await updatePackageVersion(version, path.join(process.cwd(), args.p))
  });
}

/**
 * parses the command line arguments from `process.argv.slice(2)`
 * @param {string[]} args array of arguments
 */
function parseCommandLineArgs(args) {
  const obj = {};
  let key = '';
  for (let i = 0, max = args.length; i < max; i++) {
    if (i % 2 === 0) {
      key = args[i].replace(/^-+/gm, '');
    } else {
      obj[key] = args[i];
    }
  }
  return obj;
}
