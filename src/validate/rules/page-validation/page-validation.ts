import chalk from 'chalk';
import { ValidationError, PageNamingError } from '../../error/validation-error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';
import { Logger } from '@utils';
import { PAGE_NAME_ERROR_MESSAGE } from '../../error/error-messages';

const log = new Logger();

/**
 * Takes a homework and corrects it like a teacher 👩🏼‍🏫
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
  if (!filteredHomeworks) {
    log.error(
      chalk`{bgRed [page-validation.ts]} -> pageValidation needs a valid task` +
      chalk`{cyan IValdiationContext[]} parameter with index!\n`,
    );
    return;
  }

  if (!homeworks[currentTask].ruleOptions || !homeworks[currentTask].ruleOptions.hasOwnProperty('artboardSizes')) {
    throw Error('Please provide the artboard sizes in the configuration');
  }

  const errors: (ValidationError | boolean)[] = [];
  const pageNameCheck = checkPageName(filteredHomeworks);

  let object;

  if (filteredHomeworks[currentTask]) {
    object = {
      objectId: filteredHomeworks[currentTask].do_objectID,
      name: filteredHomeworks[currentTask].name,
    };
  }

  if (!pageNameCheck) {
    errors.push(new PageNamingError({
      message: PAGE_NAME_ERROR_MESSAGE(homeworks[currentTask].ruleOptions.artboardSizes),
      ...object,
    }));
  } else {
    errors.push(true);
  }
  return errors;
}

/**
 * Check if the page name matches one of the valid sizes
 * @param taks IValidationContext[]
 * @returns boolean
 */
export function checkPageName(tasks: IValidationContext[]): boolean {
  const sizes = tasks[0].ruleOptions.artboardSizes;
  const taskNames = tasks.map(t => t.name);
  const missing = sizes.filter(size => taskNames.indexOf(size) < 0);
  if (missing.length <= 0) {
    return true;
  }
  return false;
}
