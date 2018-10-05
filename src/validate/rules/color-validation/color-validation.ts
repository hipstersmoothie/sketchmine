import chalk from 'chalk';
import { ValidationError, ColorNotInPaletteError } from '../../error/validation-error';
import { round } from '@sketch-draw/helpers/util';
import { rgbToHex, Logger } from '@utils';
import { IValidationContext } from '../../interfaces/validation-rule.interface';
import { SketchFill, SketchBorder } from '@sketch-draw/interfaces';
import { generateMasterColors } from './generate-master-colors';
import { COLOR_ERROR_MESSAGE } from '../../error/error-messages';

const log = new Logger();
const colors: string[] = generateMasterColors();

/**
 * Takes a homework and corrects it like a teacher 👩🏼‍🏫
 * check if the color is present in the dynatrace color palette and the fill/border is enabled
 * validates:
 *  - borders
 *  - fills
 * @param homeworks List of Validation Rules
 * @param currentTask number of the current task to validate
 */
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

/**
 * validates a fill/border
 * @param task current Task for validation (context object)
 * @param fill the fill or border to validate
 */
export function colorInPalette(
  task: IValidationContext,
  fill: SketchFill | SketchBorder,
): ColorNotInPaletteError | boolean {
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
        message: COLOR_ERROR_MESSAGE(hex),
      },
    );
  }
  return true;
}