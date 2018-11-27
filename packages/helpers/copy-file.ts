import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { createDir } from './create-dir';

/**
 * Copy file from one destination to another destination
 *
 * @param {string} file
 * @param {string} dest
 * @returns {Promise<any>}
 */
export function copyFile(file: string, dest: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const filename = path.basename(file);
    const source = fs.createReadStream(file);
    createDir(dest);

    const destSource = fs.createWriteStream(path.resolve(dest, filename));

    source.pipe(destSource);
    source.on('end', () => {
      if (process.env.DEBUG) {
        console.log(chalk`\tSuccessfully copied {grey ${file}} to ⇢ \n\t{grey ${dest}}`);
      }
      resolve();
    });
    source.on('error', (error) => {
      reject(Error(chalk`\n\n🚨 {bgRed Failed copying file "${file}" }\n${error}`));
    });
  });
}
