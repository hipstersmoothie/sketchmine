import chalk from 'chalk';
import { displayHelp, CliCommand } from '@sketchmine/node-helpers';
import { SketchBuilderConfig } from '../config.interface';
import { resolve, join } from 'path';
import { readFileSync } from 'fs';
const helpText = chalk`
The sketch-builder is the heart pice of this library.
It takes control over generating {grey .sketch} files from any html
that is provided to the library. It can draw a symbol Library or just
any plain web page.

The orchestration for drawing the whole library is done by the {grey @sketchmine/library} itself.
For further documentation about how to configure the {grey config.json} please visit the {grey README.md}
`;

const sampleConfig = readFileSync(join(__dirname, '..', 'config.sample-page.json')).toString();

const cmdFlags: CliCommand[] = [
  {
    flags: ['h', 'help'],
    text: 'displays the help page 📓\n',
  },
  {
    flags: ['c', 'config'],
    text: chalk`path to the configuration file {grey (config.json)} – take a look at the README.md`,
  },
  {
    divider: true,
    text: chalk`{grey The <config.json> should have at least following properties:}

${jsonSyntaxHighlight(sampleConfig)}`,
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

function jsonSyntaxHighlight(code: string): string {
  const PROPERTY_REGEX = /(".*?"):/gm;
  const VALUE_REGEX = /:.*?(".*?")/gm;
  const BRACKETS_REGEX = /([\{\}])/gm;

  let highlighted = highlightColor(PROPERTY_REGEX, code, '#e65f63');
  highlighted = highlightColor(VALUE_REGEX, highlighted, '#74b477');
  return highlightColor(BRACKETS_REGEX, highlighted, '#DEADED');
}

function highlightColor(regex: RegExp, code: string, color: string) {
  if (!color || !regex || !code) {
    return code;
  }
  return code.replace(regex, replacer);

  function replacer(...matches): string {
    return matches[0].replace(matches[1], `${chalk.hex(color)(matches[1])}`);
  }
}
