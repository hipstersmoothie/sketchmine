import chalk from 'chalk';
import {
  ValidationError,
  ArtboardNamingError,
  ArtboardSizeError,
  ArtboardEmptyError,
} from '../../error/validation-error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';
import { Logger } from '@utils/logger';
import {
  ARTBOARD_SIZE_ERROR_MESSAGE,
  ARTBOARD_EMPTY_ERROR_MESSAGE,
  ARTBOARD_NAME_ERROR_MESSAGE,
} from '../../error/error-messages';

const log = new Logger();

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
    log.error(
      chalk`{bgRed [artboard-validation.ts]} -> artboardValidation needs a valid task` +
      chalk`{cyan IValdiationContext[]} parameter with index!\n`,
    );
    return;
  }

  /**
   * Check if the page contains at least one artboard with a valid size
   */
  const includeArtboardSize = homeworks
    .filter(homework =>
      homework._class === 'artboard' &&
      homework.parents.page === task.parents.page)
    .some(homework =>
      homework.frame.width === parseInt(task.parents.page, 10));

  const emptyArtboards = homeworks
    .some(homework =>
      homework._class === 'artboard' &&
      (!homework.ruleOptions.layerSize ||
      homework.ruleOptions.layerSize < 1));

  const errors: (ValidationError | boolean)[] = [];
  const name = task.name.split('-');
  const artboardNameCheck = checkArboardName(task, name);
  const object = {
    objectId: task.do_objectID,
    name: task.name,
  };

  if (!includeArtboardSize) {
    errors.push(new ArtboardSizeError({
      message: ARTBOARD_SIZE_ERROR_MESSAGE,
      ...object,
    }));
  }
  if (emptyArtboards) {
    errors.push(new ArtboardEmptyError({
      message: ARTBOARD_EMPTY_ERROR_MESSAGE,
      ...object,
    }));
  }
  if (name.length < 3) {
    errors.push(new ArtboardNamingError({
      message: ARTBOARD_NAME_ERROR_MESSAGE,
      ...object,
    }));
  } else if (!artboardNameCheck) {
    errors.push(new ArtboardNamingError({
      message: ARTBOARD_NAME_ERROR_MESSAGE,
      ...object,
    }));
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
