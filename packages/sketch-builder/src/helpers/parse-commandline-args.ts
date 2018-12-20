import chalk from 'chalk';
import { displayHelp } from '@sketchmine/node-helpers';
import { SketchBuilderConfig } from '../config.interface';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const helpText = chalk`
The sketch-builder is the heart pice of this library.
It takes control over generating {grey .sketch} files from any html
that is provided to the library. It can draw a symbol Library or just
any plain web page.

The orchestration for drawing the whole library is done by the {grey @sketchmine/library} itself.
For further documentation about how to configure the {grey config.json} please visit the {grey README.md}
`;

const sampleConfig = readFileSync('config.sample-page.json').toString();

const cmdFlags = [
  {
    flags: ['h', 'help'],
    text: 'displays the help page 📓\n',
  },
  {
    flags: ['c', 'config'],
    text: chalk`path to the configuration file {grey (config.json)} – take a look at the README.md

{grey The <config.json> should have at least following properties:}

${sampleConfig}`,
  },
];

/**
 * Reads the provided config or return the help page
 * @param args Merged config arguments
 * @return {SketchBuilderConfig}
 */
export function parseCommandlineArgs(args: string[]): SketchBuilderConfig {
  const parsedArgs = require('minimist')(args);

  if (parsedArgs.hasOwnProperty('c') || parsedArgs.hasOwnProperty('config')) {
    return require(resolve(parsedArgs.c || parsedArgs.config));
  }

  displayHelp(helpText, cmdFlags);
}
