import { SketchColorBase, round } from '@sketchmine/sketch-file-format';
import { rgbToHex } from '@sketchmine/helpers';
import { ValidationError, ColorNotInPaletteError, COLOR_ERROR_MESSAGE } from '../../error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';
import { generateMasterColors } from './generate-master-colors';

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
    console.error('[color-validation.ts] -> colorValdiation needs a valid task');
    return;
  }

  const logoColors = task.ruleOptions.dynatraceLogoColors;
  const allColors = task.ruleOptions.colors;
  const colors: string[] = generateMasterColors(logoColors, allColors);
  const errors: (ValidationError | boolean)[] = [];

  if (task.style) {
    if (task.style.fills) {
      for (let i = 0, max = task.style.fills.length; i < max; i += 1) {
        const styleProperty = task.style.fills[i];
        errors.push(colorInPalette(task, styleProperty, colors));
      }
    }
    if (task.style.borders) {
      for (let i = 0, max = task.style.borders.length; i < max; i += 1) {
        const styleProperty = task.style.borders[i];
        errors.push(colorInPalette(task, styleProperty, colors));
      }
    }
  }
  if (task.ruleOptions.backgroundColor) {
    errors.push(colorInPalette(task, { color: task.ruleOptions.backgroundColor }, colors));
  }
  return errors;
}

/**
 * validates a fill/border
 * @param task current Task for validation (context object)
 * @param styleProperty the fill, border or color to validate
 */
export function colorInPalette(
  task: IValidationContext,
  styleProperty: Partial<SketchColorBase>,
  colors: string[],
): ColorNotInPaletteError | boolean {
  /** only activated Fills should be validated */
  if (styleProperty.hasOwnProperty('isEnabled') && !styleProperty.isEnabled) {
    return true;
  }

  const hex = rgbToHex(
    round(styleProperty.color.red * 255, 0),
    round(styleProperty.color.green * 255, 0),
    round(styleProperty.color.blue * 255, 0),
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
