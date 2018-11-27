import * as path from 'path';
import * as ts from 'typescript';
import { isFile, readFile } from '@utils';

export const READ_TSCONFIG_ERROR = config => `Failed parsing ${config} as ts.CompilerOptions.`;

/**
 * Parse the tsconfig.json for `compilerOptions.paths` object
 * and adjust the paths according to the provided `rootDir`
 * @param {ts.CompilerOptions} config Path to the tsconfig.json
 * @param {string} rootDir Root directory of the components library
 * @returns {Map<string, string>} Map with the adjusted Paths
 */
export function adjustPathAliases(tsconfig: any | null, rootDir: string): Map<string, string> {
  const adjustedPaths = new Map<string, string>();

  if (tsconfig) {
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

export async function readTsConfig(config: string): Promise<any | null> {
  const tsConfigPath = path.resolve(config);
  let compilerOptions = {};

  if (!isFile(tsConfigPath)) { return null; }
  const tsconfig = await readFile(tsConfigPath);

  try {
    compilerOptions = JSON.parse(tsconfig);
  } catch (error) {
    throw Error(READ_TSCONFIG_ERROR(config));
  }

  return compilerOptions;
}
