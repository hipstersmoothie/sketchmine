import { readdir, stat } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);

export async function readDirRecursively(
  dir: string,
  regex: RegExp = null,
  allFiles: string[] = [],
): Promise<string[]> {
  const files = (await readdirAsync(dir)).map(file => join(dir, file));

  allFiles.push(...files);

  await Promise.all(files.map(async file => (
    (await statAsync(file)).isDirectory() && readDirRecursively(file, regex, allFiles)
  )));

  if (regex) {
    return allFiles.filter(file => file.match(regex));
  }
  return allFiles;
}
