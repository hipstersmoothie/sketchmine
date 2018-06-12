import * as fs from 'fs';
import * as path from 'path';

/**
 * Deletes a folder recursivly and syncroneus
 * @param dir string
 */
export function delFolder(dir: string) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file, index) => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        delFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}
