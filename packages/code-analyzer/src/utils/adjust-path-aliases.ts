import { join }from 'path';
import { Logger } from '@sketchmine/node-helpers';
import chalk from 'chalk';

const log = new Logger();

export interface CompilerOptionsPath {
  [key: string]: string[];
}

/**
 * Map the tsconfig.json `compilerOptions.paths` entries to the absolute path
 * that is provided with the `rootDir`
 * @example
 ```
  Map { '@angular/cdk/*' => '/Users/path/to/material2/src/cdk/*' }
 ```
 * @param {ts.CompilerOptions} config Path to the tsconfig.json
 * @param {string} rootDir Root directory of the components library
 * @returns {Map<string, string>} Map with the adjusted Paths
 */
export function adjustPathAliases(tsconfig: any | null, rootDir: string): Map<string, string> {
  const adjustedPaths = new Map<string, string>();

  if (tsconfig) {
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
      const paths = tsconfig.compilerOptions.paths as CompilerOptionsPath;
      for (const alias in paths) {
        if (paths.hasOwnProperty(alias)) {
          const cleanPath =  resolvePath(paths[alias][0], alias, rootDir);

          if (cleanPath) {
            adjustedPaths.set(alias, cleanPath);
          }
        }
      }
    }
  }
  return adjustedPaths;
}

/**
 * resolves the path to an absolute path according the alias
 * from the tsconfig compilerOptions path.
 *
 * @param {string} path path from the `tsconfig.compilerOptions.paths` like `../cdk/`
 * @param {string} alias the alias from the paths like `@angular/cdk/*`
 * @param {string} rootDir the absolute path to the library like `/Users/path/to/material2/`
 * @returns {null | string} returns null if path includes `node_modules`
 */
export function resolvePath(path: string, alias: string, rootDir): null | string {
  let cleanPath = path;
  const suffixes = [];
  if (cleanPath.includes('node_modules')) {
    // tslint:disable-next-line:max-line-length
    log.warning(chalk`Resolving paths from the {grey node_modules} is currently not supported!\n{grey ${path} → ${alias}}`);
    return null;
  }

  if (cleanPath.endsWith('*')) {
    // remove glob from path and store it.
    cleanPath = cleanPath.slice(0, -1);
    // push the star to the suffixes array.
    suffixes.unshift('*');
  }

  if (cleanPath.endsWith('/')) {
    // remove last backslash and store it again.
    cleanPath = cleanPath.slice(0, -1);
    // push the backslash to the start of the array.
    suffixes.unshift('/');
  }

  // if the rootDir ends with the clean path, so the path was already provided in the tsconfig
  // we don't have to join it.
  if (rootDir.endsWith(cleanPath)) {
    return join(rootDir, suffixes.join(''));
  }

  return join(rootDir, cleanPath, suffixes.join(''));
}
