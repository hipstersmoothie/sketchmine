import * as path from 'path';
import { mkdirSync, existsSync } from 'fs';
import chalk from 'chalk';

/**
 * Creates synchroneous a folder
 *
 * @param folder string
 */
export function createDir(targetDir: string, { isRelativeToScript = false } = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      if (!existsSync(curDir)) {
        mkdirSync(curDir);
      }
    } catch (err) {
      if (err.code === 'EEXIST') { /** curDir already exists! */
        return curDir;
      }

      /** To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows. */
      if (err.code === 'ENOENT') { /** Throw the original parentDir error on curDir `ENOENT` failure. */
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || caughtErr && targetDir === curDir) {
        throw err; /** Throw if it's just the last created dir. */
      }
    }

    return curDir;
  // tslint:disable-next-line
  }, initDir);
}

// export function createDirOld(folder: string) {
//   if (!folder) {
//     throw new Error('Could not create the folder, no path provided!');
//   }

//   const f = path.resolve(folder);
//   if (!existsSync(f)) {
//     mkdirSync(f);
//     if (process.env.DEBUG === 'true') {
//       console.log(chalk`\tSuccessfully created Folder: {grey ${folder}}`);
//     }
//   }
// }
