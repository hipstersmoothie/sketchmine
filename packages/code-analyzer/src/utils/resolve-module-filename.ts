import { isFile } from '@sketchmine/node-helpers';
import { resolve, join } from 'path';

export const RESOLVE_MODULE_FILENAME_ERROR = (fileName: string) =>
  `The specified module: ./${fileName} cannot be resolved!`;

/**
 * Resolve a typescript Module to a file in the filesystem.
 * @example
 * Converts a `./index` to `./index.ts` or
 * `path/to/library` to `path/to/library/index.ts`
 * @param fileName path to file
 */
export function resolveModuleFilename(fileName: string): string {
  // if the fileName is the exact file on the fs return it
  if (isFile(fileName)) {
    return resolve(fileName);
  }
  // if the file does not exist try to append the ts extension.
  let resolved = `${fileName}.ts`;

  if (isFile(resolved)) {
    return resolve(resolved);
  }
  // maybe it was a path to a module and we have to append the index.ts for barrel files
  resolved = join(fileName, 'index.ts');

  if (isFile(resolved)) {
    return resolve(resolved);
  }

  throw Error(RESOLVE_MODULE_FILENAME_ERROR(fileName));
}
