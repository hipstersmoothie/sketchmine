import chalk from 'chalk';
import { ValidationError, ColorNotInPaletteError } from '../../error/validation-error';
import { round } from '@sketch-draw/helpers/util';
import { rgbToHex, Logger } from '@utils';
import { IValidationContext } from '../../interfaces/validation-rule.interface';
import { IFill, IBorder } from '@sketch-draw/interfaces';
import { generateMasterColors } from './generate-master-colors';

const log = new Logger();
const colors: string[] = generateMasterColors();

export function colorValidation(
  homeworks: IValidationContext[],
  currentTask: number,
  ): (ValidationError | boolean)[] {

  const task = homeworks[currentTask];
  if (!task) {
    log.error(
      chalk`{bgRed [color-validation.ts]} -> colorValdiation needs a valid task` +
      chalk`{cyan IValdiationContext[]} parameter with index!\n`,
    );
    return;
  }

  const errors: (ValidationError | boolean)[] = [];

  if (task.style) {
    if (task.style.fills) {
      for (let i = 0, max = task.style.fills.length; i < max; i += 1) {
        const color = task.style.fills[i];
        errors.push(colorInPalette(task, color));
      }
    }
    if (task.style.borders) {
      for (let i = 0, max = task.style.borders.length; i < max; i += 1) {
        const color = task.style.borders[i];
        errors.push(colorInPalette(task, color));
      }
    }
  }
  return errors;
}

export function colorInPalette(task: IValidationContext, fill: IFill | IBorder): ColorNotInPaletteError | boolean {
  /** only activated Fills should be validated */
  if (fill.hasOwnProperty('isEnabled') && !fill.isEnabled) {
    return true;
  }

  const hex = rgbToHex(
    round(fill.color.red * 255, 0),
    round(fill.color.green * 255, 0),
    round(fill.color.blue * 255, 0),
  ).toUpperCase();

  if (!colors.includes(hex)) {
    return new ColorNotInPaletteError(
      hex,
      {
        objectId: task.do_objectID,
        name: task.name,
        message: chalk`The Color {bold {hex('${hex}') ███} ${hex}} is not in the Dynatrace Color Palette!\n` +
        chalk`Take a look at {grey https://styles.lab.dynatrace.org/resources/colors}\n`,
      },
    );
  }
  return true;
}
