import { Logger } from '@utils';
import chalk from 'chalk';
import {
  NO_FOREIGN_TEXT_STYLES_ERROR_MESSAGE,
  NO_SHARED_TEXT_STYLES_ERROR_MESSAGE,
  NO_SHARED_TEXT_STYLES_OVERRIDES_ERROR_MESSAGE,
  NO_WRONG_HEADLINE_ERROR,
} from '../../error/error-messages';
import {
  NoForeignTextStylesError,
  NoSharedTextStylesError,
  ValidationError,
  NoSharedTextStylesOverridesError,
  WrongHeadlineError,
} from '../../error/validation-error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';

const log = new Logger();

const headlineTextStyles = [
  '1920-H1', '1920-H2', '1920-H3',
  '1280-H1', '1280-H2', '1280-H3',
  '360-H1', '360-H2', '360-H3',
];

/**
 * Takes a homework and corrects it like a teacher 👩🏼‍🏫
 * check if the text matches the following rules:
 *  - Sketch document must use a library for text styles, i.e. must contain foreign text styles.
 *  - Every text node must use a text style defined in the library. Exception:
 *    - If two font sizes or colors are used in one text field.
 *    - TODO: are there more exceptions? check with UX team.
 *  - Text style object must be the same in document.json and page.json (no modified text style).
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
    /**
     * If there are more attributed string attributes, it's okay if no shared style is used.
     * This can e.g. happen if a body text contains a link in a different font color
     * or text in one text field with different font sizes.
     */
    if (task.attributedStringSize && task.attributedStringSize > 1) {
      return errors;
    }

    errors.push(new NoSharedTextStylesError({
      message: NO_SHARED_TEXT_STYLES_ERROR_MESSAGE(task.name),
      ...object,
    }));
    return errors;
  }

  const foreignTextStyle = task.document.foreignTextStyles
    .find(textstyle => textstyle.localSharedStyle.do_objectID === task.sharedStyleID);

  if (!foreignTextStyle) {
    log.error(`No foreign text style given that can be compared with ${task.sharedStyleID}.`);
    return errors;
  }

  if (!foreignTextStyle.localSharedStyle.value.textStyle) {
    log.error(`No text style given for ID ${foreignTextStyle.localSharedStyle.do_objectID} in document.json`);
    return errors;
  }

  if (!task.style || !task.style.textStyle) {
    log.error(`No text style given for ${task.sharedStyleID} in current task.`);
    return errors;
  }

  /**
   * Check if text style defined in document matches text style used on page.
   */
  const foreignTextStyleAttributes = foreignTextStyle.localSharedStyle.value.textStyle.encodedAttributes;
  const taskTextStyleAttributes = task.style.textStyle.encodedAttributes;
  // TODO: deep compare these two objects instead of stringify
  if (!(JSON.stringify(foreignTextStyleAttributes) === JSON.stringify(taskTextStyleAttributes))) {
    errors.push(new NoSharedTextStylesOverridesError({
      message: NO_SHARED_TEXT_STYLES_OVERRIDES_ERROR_MESSAGE(task.name),
      ...object,
    }));
  }

  /**
   * Check if selected text style matches artboard/page name.
   */
  const foreignTextStyleName = foreignTextStyle.localSharedStyle.name;
  const taskPageName = task.parents.page;
  if (headlineTextStyles.includes(foreignTextStyleName) && !foreignTextStyleName.startsWith(taskPageName)) {
    errors.push(new WrongHeadlineError({
      message: NO_WRONG_HEADLINE_ERROR(task.name, task.parents.page),
      ...object,
    }));
  }

  return errors;
}
