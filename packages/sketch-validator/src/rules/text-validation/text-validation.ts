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
  IValidationErrorContext,
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
  const object: Partial<IValidationErrorContext> = {
    objectId: task.do_objectID,
    name: task.name,
  };

  if (!task || !task.ruleOptions.stringAttributes) {
    console.error('[text-validation.ts] -> textValidation needs a valid task and string attributes');
    return;
  }

  // TODO: is it 12 or another value?
  const MIN_ALLOWED_FONT_SIZE = 12;
  const ALLOWED_FONT_FAMILIES_REGEX = [
    /bernina(.*)sans(.*)offc/gi,
    /bitstream(.*)vera/gi,
  ];

  const errors: (ValidationError | boolean)[] = [];

  /**
   * Check if text color is one of the defined valid text colors
   * and if the text is not smaller than 12px.
   */
  task.ruleOptions.stringAttributes.forEach((attribute: SketchAttribute) => {
    if (!attribute.attributes.MSAttributedStringColorAttribute) {
      errors.push(new NoTextColorError({
        message: NO_TEXT_COLOR_ERROR(task.name),
        ...object,
      } as IValidationErrorContext));
    } else {
      const colorHex = rgbToHex(
        round(attribute.attributes.MSAttributedStringColorAttribute.red * 255, 0),
        round(attribute.attributes.MSAttributedStringColorAttribute.green * 255, 0),
        round(attribute.attributes.MSAttributedStringColorAttribute.blue * 255, 0),
      ).toUpperCase();

      // Check text colors
      if (!task.ruleOptions.VALID_TEXT_COLORS.includes(colorHex)) {
        errors.push(new InvalidTextColorError({
          message: INVALID_TEXT_COLOR_ERROR(task.name, colorHex),
          ...object,
        } as IValidationErrorContext));
      } else {
        errors.push(true);
      }
    }

    const fontAttributes = attribute.attributes.MSAttributedStringFontAttribute.attributes;
    // Check font size
    if (fontAttributes.size < MIN_ALLOWED_FONT_SIZE) {
      errors.push(new TextTooSmallError({
        message: TEXT_TOO_SMALL_ERROR(task.name),
        ...object,
      } as IValidationErrorContext));
    } else {
      errors.push(true);
    }

    // Check font family name (not allowed to be anything else than BerninaSans or Bitstream Vera )
    const fontnameLowercase = fontAttributes.name.toLowerCase();
    const validFontname = ALLOWED_FONT_FAMILIES_REGEX.some(regex => fontnameLowercase.match(regex) !== null);
    if (!validFontname) {
      errors.push(new WrongFontError({
        message: WRONG_FONT_ERROR(task.name),
        ...object,
      } as IValidationErrorContext));
    } else {
      errors.push(true);
    }
  });

  return errors;
}
