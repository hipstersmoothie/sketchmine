import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { Logger } from './logger';
import { createDir } from '@utils/create-dir';

const log = new Logger();

/**
 * Safely writes Object or string as JSON file
 *
 * @param {string} filename
 * @param {Object | string} content
 * @returns {Promise<any>}
 */
export function writeJSON(filename: string, content: Object | string, pretty = false): Promise<any> {
  return new Promise((resolve, reject) => {
    const _content = (typeof content === 'string') ? content : createJSON(content, pretty);

    const ext = path.extname(filename);
    const dir = path.dirname(filename);
    const f = ext.length > 0 ? filename : `${filename}.json`;

    createDir(dir);
    fs.writeFile(f, _content, 'utf8', (error: NodeJS.ErrnoException) => {
      if (error) {
        const msg = chalk`{red Error writing Object to ${f}}\n${error.message}`;
        log.error(msg);
        reject(Error(msg));
      }
      log.debug(chalk`✅ {green Successfully written Object to} {grey ${f}}`);
      resolve();
    });
  });
}

function createJSON(content: any, pretty: boolean) {
  if (pretty) {
    return JSON.stringify(content, null, 2).replace(/\//g, '\\/');
  }
  return JSON.stringify(content).replace(/\//g, '\\/');
}
