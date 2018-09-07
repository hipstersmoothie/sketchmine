import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { Logger } from './logger';
import { createDir } from './create-dir';
import { writeFile } from './write-file';

const log = new Logger();

/**
 * Safely writes Object or string as JSON file
 *
 * @param {string} filename
 * @param {Object | string} content
 * @returns {Promise<boolean | Error>}
 */
export function writeJSON(filename: string, content: Object | string, pretty = false): Promise<boolean | Error> {
  const _content = (typeof content === 'string') ? content : createJSON(content, pretty);
  const ext = path.extname(filename);
  const dir = path.dirname(filename);
  const f = ext.length > 0 ? filename : `${filename}.json`;

  return writeFile(f, _content);
}

function createJSON(content: any, pretty: boolean) {
  if (pretty) {
    return JSON.stringify(content, null, 2).replace(/\//g, '\\/');
  }
  return JSON.stringify(content).replace(/\//g, '\\/');
}
