const { src, dest, series, watch } = require('gulp');
const { resolve, join } = require('path');
const { spawn } = require('child_process');
const { red } = require('chalk');
const del = require('del');

const destDir = resolve('lib')
const SCHEMATICS_ROOT = resolve('src');

/**
 * Spawns a child process that compiles using tsc.
 * @param {string[]} flags Command-line flags to be passed to tsc.
 * @returns {Promise<void>} that resolves/rejects when the child process exits.
 */
function tscCompile(flags) {
  return new Promise((resolve, reject) => {
    const tscPath = './node_modules/.bin/tsc';
    const childProcess = spawn(tscPath, flags, { shell: true });

    // Pipe stdout and stderr from the npchild process.
    childProcess.stdout.on('data', (data) => console.log(`${data}`));
    childProcess.stderr.on('data', (data) => console.error(red(`${data}`)));
    childProcess.on('exit', (exitCode) => exitCode === 0 ? resolve() : reject());
  });
}

function clean() {
  return del([destDir]);
}

function copy() {
  return src([
    join(SCHEMATICS_ROOT, '**/*.json'),
    join(SCHEMATICS_ROOT, '*/files/**/*')
  ])
  .pipe(dest(destDir));
}

async function compile() {
  try {
    await tscCompile(['-p', resolve('tsconfig.json')]);
  } catch {
    throw new Error('Typescript failed compiling 🚑');
  };
}

function dev() {
  watch(join(SCHEMATICS_ROOT, '**/*'), series(compile, copy))
}

exports.clean = clean;
exports.copy = copy;
exports.compile = compile;
exports.dev = dev;
exports.default = series(clean, compile, copy);
