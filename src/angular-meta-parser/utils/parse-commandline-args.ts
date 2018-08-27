import minimist from 'minimist';

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
 * @param config default config args from .json
 * @return {ConfigArguments}
 */
export function parseCommandlineArgs(args: string[], config: any): ConfigArguments {
  return Object.assign(config.args, minimist(args));
}
