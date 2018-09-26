import chalk from 'chalk';
import { ValidationError, PageNamingError } from '../../error/validation-error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';
import { Logger } from '@utils';

const log = new Logger();

/** Available arboard sizes */
export enum PageNames {
  smallScreen = '360',
  mediumScreen = '1280',
  largeScreen = '1920',
}

export const MATCH_PAGE_SIZE_ERROR =
  chalk`Every file needs to include pages with the following names: {grey ${Object.values(PageNames).join(', ')}}`;

/**
 * Takes a homework and correct it like a teacher 👩🏼‍🏫
 * check if the name matches following rules:
 *  - is a valid size
 * @param homeworks List of Validation Rules
 * @param currentTask number of the current task to validate
 */
export function pageValidation(
  homeworks: IValidationContext[],
  currentTask: number,
  ): (ValidationError | boolean)[] {
  const filteredHomeworks = homeworks.filter(h => h._class === 'page');
  const tasks = filteredHomeworks;
  if (!tasks) {
    log.error(
      chalk`{bgRed [page-validation.ts]} -> pageValidation needs a valid task` +
      chalk`{cyan IValdiationContext[]} parameter with index!\n`,
    );
    return;
  }

  const errors: (ValidationError | boolean)[] = [];
  const pageNameCheck = checkPageName(filteredHomeworks);

  const object = {
    objectId: filteredHomeworks[0].do_objectID,
    name: filteredHomeworks[0].name,
  };

  if (typeof pageNameCheck !== 'boolean') {
    errors.push(new PageNamingError({
      message: pageNameCheck,
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
export function checkPageName(tasks: IValidationContext[]): boolean | string {
  const sizes = Object.values(PageNames);
  const taskNames = tasks.map(t => t.name);
  const missing = sizes.filter(size => taskNames.indexOf(size) < 0);
  if (missing.length <= 0) {
    return true;
  }
  return MATCH_PAGE_SIZE_ERROR;
}
