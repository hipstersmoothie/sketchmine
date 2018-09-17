import chalk from 'chalk';
import { ValidationError, PageNamingError } from '../../error/validation-error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';
import { Logger } from '@utils';
import { checkArboardSize } from '../artboard-validation';

const log = new Logger();

/** Available arboard sizes */
export enum PageNames {
  smallScreen = '360',
  mediumScreen = '1280',
  largeScreen = '1920',
}

export const MATCH_PAGE_SIZE_ERROR =
  chalk`The page name has to match one of the valid sizes: {grey ${Object.values(PageNames).join(', ')}}`;

/**
 * Takes a homework and correct it like a teacher 👩🏼‍🏫
 * check if the name matches following rules:
 *  - is a valid size
 *  - contains at least one artboards of this size
 * @param homeworks List of Validation Rules
 * @param currentTask number of the current task to validate
 */
export function pageContentValidation(
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
  const artboardSizeOnPage = checkArboardSizeOnPage(task);
  const object = {
    objectId: task.do_objectID,
    name: task.name,
  };
  if (typeof artboardSizeOnPage !== 'boolean') {
    errors.push(new PageNamingError({
      message: artboardSizeOnPage,
      ...object,
    }));
  } else {
    errors.push(true);
  }
  return errors;
}

/**
 * Check if the page name matches one of the valid sizes
 * if string is returned it is the error message
 * @param name string[]
 * @returns boolean | string
 */
export function checkArboardSizeOnPage(task: IValidationContext): boolean | string {
  console.log(task);
  if (Object.keys(task).includes('layers')) {
    console.log('bllaaaaa');
    task['layers'].foreach(l => {
      console.log('l.frame.width, ', l.frame.width);
      console.log('task.name, ', task.name);
      if (l.frame.width == task.name) {
        return true;
      }
    });
  }
  return MATCH_PAGE_SIZE_ERROR;
}
