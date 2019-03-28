import {
  ValidationError,
  ArtboardNamingError,
  ArtboardSizeError,
  ArtboardEmptyError,
  ARTBOARD_SIZE_ERROR_MESSAGE,
  ARTBOARD_EMPTY_ERROR_MESSAGE,
  ARTBOARD_NAME_ERROR_MESSAGE,
  IValidationErrorContext,
} from '../../error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';

/**
 * Takes a homework and corrects it like a teacher 👩🏼‍🏫
 * check if the name matches following rules:
 *  - has at least three parts, separated with a -
 *  - contains the screensize
 *  - every page contains at least one artboard with a valid width
 * @param homeworks List of Validation Rules
 * @param currentTask number of the current task to validate
 */
export function artboardValidation(
  homeworks: IValidationContext[],
  currentTask: number,
  ): (ValidationError | boolean)[] {
  const task = homeworks[currentTask];
  if (!task) {
    console.error('[artboard-validation.ts] -> artboardValidation needs a valid task');
    return;
  }

  /**
   * Check if the page contains at least one artboard with a valid size
   * Filter homeworks that are from type artboard, that have the same parent
   * as the current task and include the artboard validation rule.
   */
  const includeArtboardSize = homeworks
    .filter(homework =>
      homework._class === 'artboard' &&
      homework.parents.page === task.parents.page &&
      homework.ruleNames.includes('artboard-validation'))
    .some(homework =>
      homework.frame &&
      Math.round(homework.frame.width) === parseInt(task.parents.page, 10));

  /**
   * Check if the artboard is empty.
   */
  const artboardEmpty =
    task._class === 'artboard' &&
    (!task.ruleOptions.layerSize || task.ruleOptions.layerSize < 1);

  const errors: (ValidationError | boolean)[] = [];
  const name = task.name.split('-');
  const artboardNameCheck = checkArboardName(task, name);
  const object: Partial<IValidationErrorContext> = {
    objectId: task.do_objectID,
    name: task.name,
  };

  // check artboard size
  if (!includeArtboardSize) {
    errors.push(new ArtboardSizeError({
      message: ARTBOARD_SIZE_ERROR_MESSAGE,
      ...object,
    } as IValidationErrorContext));
  } else {
    errors.push(true);
  }

  // check if artboard is empty
  if (artboardEmpty) {
    errors.push(new ArtboardEmptyError({
      message: ARTBOARD_EMPTY_ERROR_MESSAGE,
      ...object,
    } as IValidationErrorContext));
  } else {
    errors.push(true);
  }

  // check artboard name
  if (name.length < 3) {
    errors.push(new ArtboardNamingError({
      message: ARTBOARD_NAME_ERROR_MESSAGE,
      ...object,
    } as IValidationErrorContext));
  } else if (!artboardNameCheck) {
    errors.push(new ArtboardNamingError({
      message: ARTBOARD_NAME_ERROR_MESSAGE,
      ...object,
    } as IValidationErrorContext));
  } else {
    errors.push(true);
  }

  return errors;
}

/**
 * Check if the artboard size is in the name
 * @param task IValidationContext
 * @param name string[]
 * @returns boolean
 */
export function checkArboardName(task: IValidationContext, name: string[]): boolean {
  if (name[0] === task.parents.page) {
    return true;
  }
  return false;
}
