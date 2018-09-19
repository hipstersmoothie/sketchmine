import { writeFile as write } from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { Logger } from './logger';
import { createDir } from './create-dir';
import { promisify } from 'util';

const writeFileAsync = promisify(write);
const log = new Logger();

/**
 * Safely writes Object or string as JSON file
 *
 * @param {string} filename filename
 * @param {string} content text to bewritten
 * @param {string} encoding default utf8
 * @returns {Promise<boolean | Error>}
 */
export async function writeFile(filename: string, content: string, encoding = 'utf8'): Promise<boolean | Error> {
  const dir = path.dirname(filename);
  createDir(dir);
  try {
    await writeFileAsync(filename, content, encoding);
    log.debug(chalk`{green Successfully written Object to} {grey ${filename}}`, undefined, '✅');
  } catch (error) {
    throw Error(chalk`{red Error writing Object to ${filename}}`);
  }
  return true;
}
