import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { createDir } from './create-dir';

/**
 * Copy file from one destination to another destination
 *
 * @param file string
 * @param dest string
 */
export function copyFile(file: string, dest: string) {
  const filename = path.basename(file);
  const source = fs.createReadStream(file);
  createDir(dest);
  const destSource = fs.createWriteStream(path.resolve(dest, filename));

  source.pipe(destSource);
  source.on('end', () => {
    if (process.env.DEBUG) {
      console.log(chalk`\n\tSuccessfully copied {grey ${file}} to ⇢ \n\t{grey ${dest}}`);
    }
  });
  source.on('error', (error) => {
    throw Error(chalk`\n\n🚨 {bgRed Failed copying file "${file}" }\n${error}`);
  });
}
