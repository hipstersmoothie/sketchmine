import chalk from 'chalk';
import { ValidationError, ArtboardNamingError, ArtboardSizeError } from '../../error/validation-error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';
import { Logger } from '@utils';

const log = new Logger();

/** Available arboard sizes */
export enum ArtboardSize {
  smallScreen = '360',
  mediumScreen = '1280',
  largeScreen = '1920',
}

const ARTBOARD_SIZES_INCLUDED = {
  360: false,
  1280: false,
  1920: false,
};

export const CONTAIN_ARTBOARD_SIZE_ERROR =
  chalk`The artboard name has to include the artboard size: {grey ${Object.values(ArtboardSize).join(', ')}}`;

export const INVALID_ARTBOARD_NAME_ERROR =
  chalk`The artboard size does not match the size, stated in the name.`;

/**
 * Takes a homework and correct it like a teacher 👩🏼‍🏫
 * check if the name matches following rules:
 *  - has at least three parts, separated with a -
 *  - contains the screensize
 *  - every page contains at least one artboard with a valid width
 *  - the size, stated in the artboard name meets the size stated in the page name
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
    .some(homework => homework.frame.width === parseInt(task.parents.page, 10));

  const errors: (ValidationError | boolean)[] = [];
  const name = task.name.split('-');
  const artboardNameCheck = checkArboardName(task, name);
  const object = {
    objectId: task.do_objectID,
    name: task.name,
  };

  if (!includeArtboardSize) {
    errors.push(new ArtboardSizeError({
      message:`Every page needs to have at least one artboard with a valid width (360, 1280, 1920).`,
      ...object,
    }));
  }

  if (name.length < 3) {
    errors.push(new ArtboardNamingError({
      message: `The artboard name should contain at least artboardsize, folder name and feature name.`,
      ...object,
    }));
  }
  if (typeof artboardNameCheck !== 'boolean') {
    errors.push(new ArtboardNamingError({
      message: `The artboard name should start with the artboard/pagesize (360, 1280, 1920).`,
      ...object,
    }));
  } else {
    errors.push(true);
  }
  return errors;
}

/**
 * Check if the artboard size is in the name
 * if string is returned it is the error message
 * @param name string[]
 * @returns boolean | string
 */
export function checkArboardName(task: IValidationContext, name: string[]): boolean | string {
  const sizes = Object.values(ArtboardSize);
  if (name[0] === task.parents.page) {
    return true;
  }
  return CONTAIN_ARTBOARD_SIZE_ERROR;
}
