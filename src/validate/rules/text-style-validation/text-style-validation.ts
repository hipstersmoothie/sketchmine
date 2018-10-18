import { Logger } from '@utils';
import chalk from 'chalk';
import {
  NO_FOREIGN_TEXT_STYLES_ERROR_MESSAGE,
  NO_SHARED_TEXT_STYLES_ERROR_MESSAGE,
  NO_SHARED_TEXT_STYLES_OVERRIDES_ERROR_MESSAGE,
} from '../../error/error-messages';
import {
  NoForeignTextStylesError,
  NoSharedTextStylesError,
  ValidationError,
  NoSharedTextStylesOverridesError,
} from '../../error/validation-error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';

const log = new Logger();

/**
 * Takes a homework and corrects it like a teacher 👩🏼‍🏫
 * check if the text matches the following rules:
 *  - Sketch document must use a library for text styles, i.e. must have foreign text styles
 *  - every text node must use a text style defined in the library
 *  - text style object must be the same in document.json and page.json
 * @param homeworks List of Validation Rules
 * @param currentTask number of the current task to validate
 */
export function textStyleValidation(
  homeworks: IValidationContext[],
  currentTask: number,
  ): (ValidationError | boolean)[] {

  const task = homeworks[currentTask];
  const object = {
    objectId: task.do_objectID,
    name: task.name,
  };

  if (!task) {
    log.error(
      chalk`{bgRed [text-style-validation.ts]} -> textStyleValidation needs a valid task` +
      chalk`{cyan IValdiationContext[]} parameter with index!\n`,
    );
    return;
  }

  const errors: (ValidationError | boolean)[] = [];

  if (!task.document) {
    log.error('document.json is needed for text style validation');
    return;
  }

  /**
   * Check if Sketch file uses library text styles.
   */
  if (task.document.foreignTextStyles.length < 1) {
    errors.push(new NoForeignTextStylesError({
      message: NO_FOREIGN_TEXT_STYLES_ERROR_MESSAGE,
      ...object,
    }));
  }

  /**
   * Check if text node uses a text style defined in the library.
   */
  if (!task.sharedStyleID) {
    errors.push(new NoSharedTextStylesError({
      message: NO_SHARED_TEXT_STYLES_ERROR_MESSAGE(task.name),
      ...object,
    }));
    return errors;
  }

  /**
   * Check if text style defined in document matches text style used on page.
   */
  task.document.foreignTextStyles.forEach((textstyle) => {
    if (textstyle.localSharedStyle.do_objectID === task.sharedStyleID) {
      if (!textstyle.localSharedStyle.value.textStyle) {
        log.error(`No text style given for ID ${textstyle.localSharedStyle.do_objectID} in document.json`);
      }
      if (!task.style || !task.style.textStyle) {
        log.error(`No text style given for ${task.sharedStyleID} in current task.`);
      }
      const sharedTextStyle = textstyle.localSharedStyle.value.textStyle.encodedAttributes;
      const pageTextStyle = task.style.textStyle.encodedAttributes;
      // TODO: deep compare these two objects instead of stringify
      if (!(JSON.stringify(sharedTextStyle) === JSON.stringify(pageTextStyle))) {
        errors.push(new NoSharedTextStylesOverridesError({
          message: NO_SHARED_TEXT_STYLES_OVERRIDES_ERROR_MESSAGE(task.name),
          ...object,
        }));
      }
    }
  });

  return errors;
}
