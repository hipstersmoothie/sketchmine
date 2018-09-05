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

/**
 * This function generates a list of all possible colors from the angular-components library
 * _colors.scss file.
 * Add the static Dynatrace logo colors in case they are not present in the angular-components
 * @example https://regex101.com/r/nuKQ0X/2
 */
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

  /** @example https://regex101.com/r/xVkRwW/1 */
  const threeDigitsHex = /#([a-fA-F0-9]{3})$/;

  let match = regex.exec(allColors);
  while (match !== null) {
    /** regex converts 3digits hex to 6 digits hex */
    const c = match[3].toUpperCase().replace(threeDigitsHex, '#$1$1');
    colors.push(c);
    match = regex.exec(allColors);
  }
  return colors;
}
