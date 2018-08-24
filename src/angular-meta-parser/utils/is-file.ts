import { existsSync, lstatSync } from 'fs';

export function isFile(fileName: string): boolean {
  return existsSync(fileName) && lstatSync(fileName).isFile();
}
