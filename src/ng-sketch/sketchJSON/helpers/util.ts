import * as fs from 'fs';
import * as path from 'path';

export function createDir(folder: string) {
  if (!folder) {
    throw new Error('Could not create the folder, no path provided!');
  }
  if (!fs.existsSync(path.resolve(folder))){
    fs.mkdirSync(path.resolve(folder));
  }
}

export function cleanDir(folder: string) {
  if (!folder) {
    throw new Error('Could not create the folder, no path provided!');
  }
  if (fs.existsSync(path.resolve(folder))) {
    // TODO: Clean folder first
  }
}

export function writeJSON(filename: string, content: Object | string) {
  content = (typeof content === 'string')? content : JSON.stringify(content);
  fs.writeFile(`${filename}.json`, content, 'utf8', () => {});
}

export function delFolder(dir: string) {
  if( fs.existsSync(dir) ) {
    fs.readdirSync(dir).forEach((file,index) => {
      const curPath = path.join(dir, file);
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        delFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
};
