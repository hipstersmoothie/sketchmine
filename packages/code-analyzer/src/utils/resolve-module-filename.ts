import * as path from 'path';
import { isFile } from '@sketchmine/helpers';

/**
 * Resolve a typescript Module to a file in the filesystem.
 * @example
 * Converts a `./index` to `./index.ts` or
 * `path/to/library` to `path/to/library/index.ts`
 * @param fileName path to file
 */
export function resolveModuleFilename(fileName: string) {
  if (isFile(fileName)) {
    return fileName;
  }
  let resolved = `${fileName}.ts`;
  if (isFile(resolved)) {
    return resolved;
  }
  resolved = path.join(fileName, 'index.ts');
  if (isFile(resolved)) {
    return resolved;
  }
  throw Error(`The specified filename: ${fileName} cannot be resolved!`);
}
