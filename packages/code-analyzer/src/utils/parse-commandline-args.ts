import chalk from 'chalk';
import { displayHelp } from '@sketchmine/node-helpers';
import { resolve } from 'path';

/**
 * Configuration arguments for the command line args
 */
export interface ConfigArguments {
  rootDir: string;
  library: string; /** path to library realitve fromm rootDir */
  inFile: string;
  tsConfig: string;
  outFile: string;
}

const helpText = `
This package is only meant for internal use @Dynatrace.
The code-analyzer works like a compiler that is analyzing the provided
source code of the angular components library and generates an abstract syntax tree
short AST from the Angular Components. The output of the meta information
is provided in the JSON format and contains all information about all the components
in a library and their variants.

This solution is currently tailored for the dynatrace angular components library,
feel free to commit pull request with your solution for your company!
`;

const cmdFlags = [
  {
    flags: ['h', 'help'],
    text: 'displays the help page 📓',
  },
  {
    flags: ['c', 'config'],
    text: chalk`path to the configuration file {grey (config.json)} ⚙️`,
  },
  {
    divider: true,
    text: 'if no config is provided those three arguments have to be provided:',
  },
  {
    flags: ['rootDir'],
    text: 'path to the repository of the components library. 🗄',
  },
  {
    flags: ['library'],
    text: chalk`Path to the library folder relative from root.`,
  },
  {
    flags: ['inFile'],
    text: 'Starting point for the code analysis default: {grey index.ts}',
  },
  {
    flags: ['tsConfig'],
    text: 'Path to the tsconfig, defaults to {grey <rootDir>/tsconfig.json}',
  },
  {
    flags: ['outFile'],
    text: chalk`The resulting JSON file for the meta information like: {grey meta-info.json}`,
  },
];

const DEFAULT_CONFIG = 'config.json';

/**
 * Merges the default config arguments with the command line inputs
 * @param args Merged config arguments
 * @return {ConfigArguments}
 */
export function parseCommandlineArgs(args: string[]): ConfigArguments {
  const parsedArgs = require('minimist')(args);

  if (parsedArgs.hasOwnProperty('h') || parsedArgs.hasOwnProperty('help') || args.length === 0) {
    displayHelp(helpText, cmdFlags);
  }
  let conf: Partial<ConfigArguments> = {};

  if (parsedArgs.hasOwnProperty('c') || parsedArgs.hasOwnProperty('config')) {
    conf = require(resolve(parsedArgs.c || parsedArgs.config));
  }

  if (parsedArgs.hasOwnProperty('rootDir')) { conf['rootDir'] = parsedArgs.rootDir; }
  if (parsedArgs.hasOwnProperty('library')) { conf['library'] = parsedArgs.library; }
  if (parsedArgs.hasOwnProperty('inFile')) { conf['inFile'] = parsedArgs.inFile; }
  if (parsedArgs.hasOwnProperty('tsConfig')) { conf['tsConfig'] = parsedArgs.tsConfig; }
  if (parsedArgs.hasOwnProperty('outFile')) { conf['outFile'] = parsedArgs.outFile; }

  return conf as ConfigArguments;
}
