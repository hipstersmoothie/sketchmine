import * as fs from 'fs';

export function isFile(fileName: string): boolean {
  return fs.existsSync(fileName) && fs.lstatSync(fileName).isFile();
}
