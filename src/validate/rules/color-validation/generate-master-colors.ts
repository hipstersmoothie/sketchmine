import { readFileSync, lstatSync } from 'fs';
import { join } from 'path';
import { Logger } from '@utils';
import chalk from 'chalk';

const log = new Logger();
const DYNATRACE_LOGO_COLORS = [
  '#FFFFFF', /** logo-white */
  '#1496FF', /** logo-blue */
  '#6F2DA8', /** logo-purple */
  '#B4DC00', /** logo-limegreen */
  '#73BE28', /** logo-green */
  '#1A1A1A', /** logo-dark-gray */
];

const COLORS_FILE = join(__dirname, '_tmp/', '_colors.scss');

export function generateMasterColors(): string[] {

  if (!lstatSync(COLORS_FILE).isFile()) {
    log.error(
      chalk`Please use the {bgBlue  [sh src/validate/prepare.sh] } ` +
      chalk`script to get the {grey _colors.scs}s file `);
    throw new Error(`${COLORS_FILE} file not found!`);
  }
  const colors: string[] = DYNATRACE_LOGO_COLORS;
  const allColors = readFileSync(COLORS_FILE).toString();
  const regex = /\$(\w+?)\-(\d+?)\:\s*?(#[0-9a-f]+|rgba?\([0-9\s\,]+?\))/gm;

  let match = regex.exec(allColors);
  while (match !== null) {
    colors.push(match[3].toUpperCase());
    match = regex.exec(allColors);
  }
  return colors;
}
