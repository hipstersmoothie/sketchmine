import * as minimist from 'minimist';

/**
 * Configuration arguments for the command line args
 */
export interface ConfigArguments {
  meta: string;
  appShell: string;
  examples: string; /** path to examples folder */
}

/**
 * Merges the default config arguments with the command line inputs
 * @param args Merged config arguments
 * @param config default config args from .json
 * @return {ConfigArguments}
 */
export function parseCommandlineArgs(args: string[], config: any): ConfigArguments {
  return Object.assign(config, minimist(args));
}
