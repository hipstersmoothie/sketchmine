import * as path from 'path';
import { isFile } from './is-file';

export function resolveModuleFilename(fileName: string) {
  if (isFile(fileName)) { return fileName; }
  let resolved = `${fileName}.ts`;
  if (isFile(resolved)) { return resolved; }
  resolved = path.join(fileName, 'index.ts');
  if (isFile(resolved)) { return resolved; }
  throw Error(`The specified filename: ${fileName} cannot be resolved!`);
}
