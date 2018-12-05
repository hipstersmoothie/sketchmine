import chalk from 'chalk';
import { displayHelp } from '@sketchmine/node-helpers';
import { SketchBuilderConfig } from '../config.interface';
import { resolve } from 'path';

const helpText = `
This package is only meant for internal use @Dynatrace.
The app-builder builds the example angular application out of our
pure examples to generate the dynatrace components library.
`;

const cmdFlags = [
  {
    flags: ['h', 'help'],
    text: 'displays the help page 📓',
  },
  {
    flags: ['c', 'config'],
    text: chalk`path to the configuration file {grey (config.json)} – take a look at the README.md`,
  },
];

const DEFAULT_CONFIG = 'config.json';

/**
 * Merges the default config arguments with the command line inputs
 * @param args Merged config arguments
 * @return {SketchBuilderConfig}
 */
export function parseCommandlineArgs(args: string[]): SketchBuilderConfig {
  const parsedArgs = require('minimist')(args);

  if (parsedArgs.hasOwnProperty('h') || parsedArgs.hasOwnProperty('help') || args.length === 0) {
    displayHelp(helpText, cmdFlags);
  }

  const defaultConfig = require(resolve(DEFAULT_CONFIG));
  let conf = {};

  if (parsedArgs.hasOwnProperty('c') || parsedArgs.hasOwnProperty('config')) {
    conf = require(resolve(parsedArgs.c || parsedArgs.config));
  }

  if (parsedArgs.hasOwnProperty('appShell')) { conf['appShell'] = parsedArgs.appShell; }
  if (parsedArgs.hasOwnProperty('meta')) { conf['meta'] = parsedArgs.meta; }
  if (parsedArgs.hasOwnProperty('examples')) { conf['examples'] = parsedArgs.examples; }

  return Object.assign(defaultConfig, conf);
}
