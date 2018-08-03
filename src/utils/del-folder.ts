import * as fs from 'fs';
import * as path from 'path';

/**
 * Deletes a folder recursivly and syncroneus
 * @param dir string
 */
export function delDir(dir: string) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        delDir(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}
