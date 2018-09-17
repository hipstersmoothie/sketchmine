import chalk from 'chalk';
import { ValidationError, ArtboardNamingError, ArtboardSizeError } from '../../error/validation-error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';
import { IFrame } from '@sketch-draw/interfaces';
import { Logger } from '@utils';

const log = new Logger();

/** Available arboard sizes */
export enum ArtboardSize {
  smallScreen = '360',
  mediumScreen = '1280',
  largeScreen = '1920',
}

export const CONTAIN_ARTBOARD_SIZE_ERROR =
  chalk`The artboard name has to include the artboard size: {grey ${Object.values(ArtboardSize).join(', ')}}`;

export const INVALID_ARTBOARD_NAME_ERROR =
  chalk`The artboard size does not match the size, stated in the name.`;

/**
 * Takes a homework and correct it like a teacher 👩🏼‍🏫
 * check if the name matches following rules:
 *  - has at least three parts, separated with a -
 *  - contains the screensize
 *  - the width of the artboard matches the name
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

  const errors: (ValidationError | boolean)[] = [];
  const name = task.name.split('-');
  const artboardNameCheck = checkArboardName(name);
  const artboardSizeCheck = checkArboardSize(task.frame, name[0]);
  const object = {
    objectId: task.do_objectID,
    name: task.name,
  };

  if (name.length < 3) {
    errors.push(new ArtboardNamingError({
      message: `The artboard name should contain at least artboardsize, folder name and feature name`,
      ...object,
    }));
  } else if (typeof artboardNameCheck !== 'boolean') {
    errors.push(new ArtboardNamingError({
      message: artboardNameCheck,
      ...object,
    }));
  } else if (typeof artboardSizeCheck !== 'boolean') {
    errors.push(new ArtboardSizeError({
      message: artboardSizeCheck,
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
export function checkArboardName(name: string[]): boolean | string {
  const sizes = Object.values(ArtboardSize);
  if (sizes.includes(name[0])) {
    return true;
  }
  return CONTAIN_ARTBOARD_SIZE_ERROR;
}

/**
 * validates if size in name matches the actual artboard width
 * @param frame frame of current artboard
 * @param name artboard name
 * @returns boolean | string
 */
export function checkArboardSize(frame: IFrame, name: string): boolean | string {
  if (frame.width === parseInt(name, 10)) {
    return true;
  }
  return INVALID_ARTBOARD_NAME_ERROR;
}
