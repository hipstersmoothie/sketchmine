import * as util from 'util';
import * as fs from 'fs';
import chalk from 'chalk';

const read = util.promisify(fs.readFile);

/**
 * async / await implementation of readFile
 * @param path string
 * @param encoding string
 */
export async function readFile(path: string, encoding = 'utf8'): Promise<string> {
  try {
    return await read(path, encoding);
  } catch (error) {
    console.log(
      chalk`{bgRed Error: reading File:}\n{grey ${path}}\n\n`,
      error,
    );
  }
}
