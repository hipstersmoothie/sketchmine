import { join, resolve, dirname } from 'path';
import { ParseResult } from './parsed-nodes';
import { adjustPathAliases, readTsConfig } from './utils';
import { applyTransformers } from './resolvers';
import { parseFile } from './parse-file';
import { writeJSON } from '@sketchmine/node-helpers';

/**
 * The Main function that takes command line args build the AST and transforms the AST,
 * generate a JSON representation from it and write it to the outFile.
 * @param {string[]} args Array of command line args
 * @returns {Promise<number>} returns a promise with the exit code
 */
export async function main(
  rootDir: string,
  library: string,
  outFile: string = 'meta-information.json',
  inFile: string = 'index.ts',
  tsConfig: string = 'tsconfig.json',
  inMemory: boolean = false,
  blackList: Set<string> | null,
): Promise<number | any> {

  if (!rootDir || !library) {
    throw new Error('The --rootDir and the --library, to the angular components has to be specified!');
  }

  const pkg = resolve(rootDir, 'package.json');
  const pkgJSON = require(pkg);
  const tsconfig = resolve(rootDir, tsConfig);
  const nodeModules = join(dirname(pkg), 'node_modules');
  const entryFile = resolve(rootDir, library, inFile);
  const parseResults = new Map<string, ParseResult>();

  const config = await readTsConfig(tsconfig);
  await parseFile(entryFile, adjustPathAliases(config, join(rootDir, library)), parseResults, nodeModules, blackList);

  const meta = applyTransformers(parseResults);

  const result = {
    version: pkgJSON.version,
    components: meta,
  };

  if (inMemory) {
    return result;
  }
  /** write the JSON structure to the outFile */
  await writeJSON(outFile, result, false);

  // return exit code
  return 0;
}
