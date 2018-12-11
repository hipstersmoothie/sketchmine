import { resolve } from 'path';
import { isFile, readFile } from '@sketchmine/node-helpers';

export const READ_TSCONFIG_ERROR = config => `Failed parsing ${config} as ts.CompilerOptions.`;

/**
 * Reads the tsconfig.json file
 * @param {string} config path to the tsconfig.json file
 */
export async function readTsConfig(config: string): Promise<any | null> {
  const tsConfigPath = resolve(config);
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
