import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';

/**
 * Creates synchroneous a folder
 *
 * @param folder string
 */
export function createDir(folder: string) {
  if (!folder) {
    throw new Error('Could not create the folder, no path provided!');
  }

  const f = path.resolve(folder);
  if (!fs.existsSync(f)) {
    fs.mkdirSync(f);
    if (process.env.DEBUG === 'true') {
      console.log(chalk`\tSuccessfully created Folder: {grey ${folder}}`);
    }
  }
}
