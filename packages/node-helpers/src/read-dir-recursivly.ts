import { readdir, stat } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);

/**
 * Lists all children of a directory recursively. Is filterable
 * @param dir directory to list
 * @param regex Regular Expression to filter the items
 * @param allFiles List of files that can be passed optional to append the result.
 */
export async function readDirRecursively(
  dir: string,
  regex: RegExp = /.*/gm,
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
