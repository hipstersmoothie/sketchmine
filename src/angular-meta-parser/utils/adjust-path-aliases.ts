import * as path from 'path';
import { isFile } from './is-file';

/**
 * Parse the tsconfig.json for `compilerOptions.paths` object
 * and adjust the paths according to the provided `rootDir`
 * @param {string} config Path to the tsconfig.json
 * @param {string} rootDir Root directory of the components library
 * @returns {Map<string, string>} Map with the adjusted Paths
 */
export function adjustPathAliases(config: string, rootDir: string): Map<string, string> {
  const tsConfigPath = path.resolve(config);
  const adjustedPaths = new Map<string, string>();

  if (isFile(tsConfigPath)) {
    const tsconfig = require(path.resolve(config));
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
      const paths = tsconfig.compilerOptions.paths as { [key: string]: string[] };

      for (const alias in paths) {
        if (paths.hasOwnProperty(alias)) {
          const suffixes = [];
          let cleanPath = paths[alias][0];

          if (cleanPath.includes('node_modules')) {
            continue;
          }

          if (cleanPath.endsWith('*')) {
            cleanPath = cleanPath.slice(0, -1);
            suffixes.unshift('*');
          }
          if (cleanPath.endsWith('/')) {
            cleanPath = cleanPath.slice(0, -1);
            suffixes.unshift('/');
          }
          adjustedPaths.set(alias, rootDir.endsWith(cleanPath) ? rootDir + suffixes.join('') : alias);
        }
      }
    }
  }
  return adjustedPaths;
}
