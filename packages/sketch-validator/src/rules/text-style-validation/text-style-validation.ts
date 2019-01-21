import { SketchAttribute } from '@sketchmine/sketch-file-format';
import {
  NoForeignTextStylesError,
  NoSharedTextStylesError,
  ValidationError,
  NoSharedTextStylesOverridesError,
  WrongHeadlineError,
  NO_FOREIGN_TEXT_STYLES_ERROR_MESSAGE,
  NO_SHARED_TEXT_STYLES_ERROR_MESSAGE,
  NO_SHARED_TEXT_STYLES_OVERRIDES_ERROR_MESSAGE,
  NO_WRONG_HEADLINE_ERROR,
  IValidationErrorContext,
} from '../../error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';
import isEqual from 'lodash/isEqual';

/**
 * Checks if string attributes are identical except for color attribute;
 * this one can be updated.
 * @param stringAttributes array of string attributes
 */
export const onlyColorChanged = (stringAttributes: SketchAttribute[]) => {
  const filteredAttributes = stringAttributes
    .map(stringAttribute => stringAttribute.attributes)
    .map((attributes) => {
      delete attributes.MSAttributedStringColorAttribute;
      return attributes;
    });

  // Compare string representation of filtered attributes
  for (let i = 1; i < filteredAttributes.length; i += 1) {
    if (!isEqual(filteredAttributes[i - 1], filteredAttributes[i])) {
      return false;
    }
  }
  return true;
};

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
  const object: Partial<IValidationErrorContext> = {
    objectId: task.do_objectID,
    name: task.name,
  };

  if (!task) {
    console.error('[text-style-validation.ts] -> textStyleValidation needs a valid task');
    return;
  }

  const errors: (ValidationError | boolean)[] = [];

  if (!task.ruleOptions.document) {
    console.error('document.json is needed for text style validation');
    return;
  }

  /**
   * Check if Sketch file uses library text styles.
   */
  if (task.ruleOptions.document.foreignTextStyles.length < 1) {
    errors.push(new NoForeignTextStylesError({
      message: NO_FOREIGN_TEXT_STYLES_ERROR_MESSAGE,
      ...object,
    } as IValidationErrorContext));
  } else {
    errors.push(true);
  }

  /**
   * Check if text node uses a text style defined in the library.
   * (We can return errors here, because for later checks the sharedStyleID is needed.)
   */
  if (!task.ruleOptions.sharedStyleID) {
    // It's okay not to use a shared style, but only if different text colors are used.
    if (task.ruleOptions.stringAttributes
        && task.ruleOptions.stringAttributes.length > 1
        && onlyColorChanged(task.ruleOptions.stringAttributes)) {
      return errors;
    }

    errors.push(new NoSharedTextStylesError({
      message: NO_SHARED_TEXT_STYLES_ERROR_MESSAGE(task.name),
      ...object,
    } as IValidationErrorContext));
    return errors;
  }

  const foreignTextStyle = task.ruleOptions.document.foreignTextStyles
    .find(textStyle => textStyle.localSharedStyle.do_objectID === task.ruleOptions.sharedStyleID);

  if (!foreignTextStyle) {
    console.error(`No foreign text style given that can be compared with ${task.ruleOptions.sharedStyleID}.`);
    return errors;
  }

  if (!foreignTextStyle.localSharedStyle.value.textStyle) {
    console.error(`No text style given for ID ${foreignTextStyle.localSharedStyle.do_objectID} in document.json`);
    return errors;
  }

  if (!task.style || !task.style.textStyle) {
    console.error(`No text style given for ${task.ruleOptions.sharedStyleID} in current task.`);
    return errors;
  }

  /**
   * Check if text style defined in document matches text style used on page.
   */
  const foreignTextStyleAttributes = foreignTextStyle.localSharedStyle.value.textStyle.encodedAttributes;
  const taskTextStyleAttributes = task.style.textStyle.encodedAttributes;

  if (!isEqual(foreignTextStyleAttributes, taskTextStyleAttributes)) {
    errors.push(new NoSharedTextStylesOverridesError({
      message: NO_SHARED_TEXT_STYLES_OVERRIDES_ERROR_MESSAGE(task.name),
      ...object,
    } as IValidationErrorContext));
  } else {
    errors.push(true);
  }

  /**
   * Check if selected text style matches artboard/page name.
   */
  const foreignTextStyleName = foreignTextStyle.localSharedStyle.name;
  const taskPageName = task.parents.page;
  if (task.ruleOptions.HEADLINE_TEXT_STYLES.includes(foreignTextStyleName)
      && !foreignTextStyleName.startsWith(taskPageName)) {
    errors.push(new WrongHeadlineError({
      message: NO_WRONG_HEADLINE_ERROR(task.name, task.parents.page),
      ...object,
    } as IValidationErrorContext));
  } else {
    errors.push(true);
  }

  return errors;
}
