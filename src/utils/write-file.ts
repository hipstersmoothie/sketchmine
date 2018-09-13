import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { Logger } from './logger';
import { createDir } from './create-dir';

const log = new Logger();

/**
 * Safely writes Object or string as JSON file
 *
 * @param {string} filename filename
 * @param {string} content text to bewritten
 * @param {string} encoding default utf8
 * @returns {Promise<boolean | Error>}
 */
export function writeFile(filename: string, content: string, encoding = 'utf8'): Promise<boolean | Error> {
  return new Promise((resolve, reject) => {

    const dir = path.dirname(filename);

    createDir(dir);

    fs.writeFile(filename, content, encoding, (error: NodeJS.ErrnoException) => {
      if (error) {
        reject(Error(chalk`{red Error writing Object to ${filename}}`));
      }
      log.debug(chalk`✅ {green Successfully written Object to} {grey ${filename}}`);
      resolve(true);
    });
  });
}
