import { SketchAttribute, round } from '@sketchmine/sketch-file-format';
import { rgbToHex } from '@sketchmine/helpers';
import {
  ValidationError,
  InvalidTextColorError,
  TextTooSmallError,
  NoTextColorError,
  WrongFontError,
  INVALID_TEXT_COLOR_ERROR,
  TEXT_TOO_SMALL_ERROR,
  NO_TEXT_COLOR_ERROR,
  WRONG_FONT_ERROR,
} from '../../error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';

/**
 * Takes a homework and corrects it like a teacher 👩🏼‍🏫
 * check if the text matches the following rules:
 *  - Text must use BerninaSans or Bitstream Vera font.
 *  - Text must have one of the colors from the Dynatrace color palette.
 *  - Text must not be smaller than 12px.
 * @param homeworks List of Validation Rules
 * @param currentTask number of the current task to validate
 */
export function textValidation(
  homeworks: IValidationContext[],
  currentTask: number,
  ): (ValidationError | boolean)[] {

  const task = homeworks[currentTask];
  const object = {
    objectId: task.do_objectID,
    name: task.name,
  };

  if (!task) {
    console.error('[text-validation.ts]} -> textValidation needs a valid task');
    return;
  }

  const errors: (ValidationError | boolean)[] = [];

  /**
   * Check if text color is one of the defined valid text colors
   * and if the text is not smaller than 12px.
   */
  if (task.ruleOptions.stringAttributes) {
    task.ruleOptions.stringAttributes.forEach((attribute) => {
      if (!attribute.attributes.MSAttributedStringColorAttribute) {
        errors.push(new NoTextColorError({
          message: NO_TEXT_COLOR_ERROR(task.name),
          ...object,
        }));
      } else {
        const colorHex = rgbToHex(
          round(attribute.attributes.MSAttributedStringColorAttribute.red * 255, 0),
          round(attribute.attributes.MSAttributedStringColorAttribute.green * 255, 0),
          round(attribute.attributes.MSAttributedStringColorAttribute.blue * 255, 0),
        ).toUpperCase();

        // Check text colors
        if (!task.ruleOptions.VALID_TEXT_COLORS.includes(colorHex)) {
          errors.push(new InvalidTextColorError({
            message: INVALID_TEXT_COLOR_ERROR(task.name),
            ...object,
          }));
        } else {
          errors.push(true);
        }
      }

      const fontAttributes = attribute.attributes.MSAttributedStringFontAttribute.attributes;
      // Check font size (not allowed to be smaller than 12px)
      // TODO: is it 12 or another value?
      if (fontAttributes.size < 12) {
        errors.push(new TextTooSmallError({
          message: TEXT_TOO_SMALL_ERROR(task.name),
          ...object,
        }));
      } else {
        errors.push(true);
      }

      // Check font family name (not allowed to be anything else than BerninaSans or Bitstream Vera )
      const fontnameLowercase = fontAttributes.name.toLowerCase();
      if (!fontnameLowercase.includes('bernina') && !fontnameLowercase.includes('bitstream')) {
        errors.push(new WrongFontError({
          message: WRONG_FONT_ERROR(task.name),
          ...object,
        }));
      } else {
        errors.push(true);
      }
    });
  }

  return errors;
}
