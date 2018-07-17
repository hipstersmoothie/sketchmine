import * as path from 'path';
import * as fs from 'fs';

/**
 * Creates synchroneous a folder
 *
 * @param folder string
 */
export function createDir(folder: string) {
  if (!folder) {
    throw new Error('Could not create the folder, no path provided!');
  }
  if (!fs.existsSync(path.resolve(folder))) {
    fs.mkdirSync(path.resolve(folder));
  }
}
