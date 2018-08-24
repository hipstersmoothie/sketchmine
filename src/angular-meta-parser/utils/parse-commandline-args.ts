import minimist from 'minimist';

const config = require('./config.json');

/**
 * Configuration arguments for the command line args
 */
export interface ConfigArguments {
  rootDir: string;
  inFile: string;
  outFile: string;
  config: string; /** Path to tsconfig.json */
  pkg: string; /** Path to package.json */
}

/**
 * Merges the default config arguments with the command line inputs
 * @param args Merged config arguments
 * @return {ConfigArguments}
 */
export function parseCommandlineArgs(args: string[]): ConfigArguments {
  return Object.assign(config.args, minimist(args));
}
