import {
  ValidationError,
  PageNamingError,
  NoArtboardFoundError,
  EmptyPageError,
  PAGE_NAME_ERROR_MESSAGE,
  NO_ARTBOARD_ERROR_MESSAGE,
  EMPTY_PAGE_ERROR_MESSAGE,
} from '../../error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';

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
  const errors: (ValidationError | boolean)[] = [];
  const task = homeworks[currentTask];

  if (!task) {
    console.error('[page-validation.ts]} -> pageValidation needs a valid task');
    return;
  }

  if (
    !task.ruleOptions ||
    !task.ruleOptions.hasOwnProperty('artboardSizes') ||
    !task.ruleOptions.hasOwnProperty('children') // will be added in the validator programmatically
  ) {
    throw Error('Please provide the artboard sizes in the configuration');
  }

  // we need to filter all the pages out of all the homeworks
  const filteredHomeworks = homeworks.filter(h => h._class === 'page');

  const pageNameCheck = checkPageName(filteredHomeworks, task.ruleOptions.artboardSizes);

  const object = {
    objectId: task.do_objectID,
    name: task.name,
  };

  // check if the page has any children (symbol master, artboards...)
  if (!task.ruleOptions.children) {
    errors.push(new EmptyPageError({
      message: EMPTY_PAGE_ERROR_MESSAGE(task.name),
      ...object,
    }));
  }

  let hasArtboards = false;
  let isSymboldMaster = false;

  const artboards = task.ruleOptions.children
    .filter(c => c.class === 'artboard');

  const symboldMasters = task.ruleOptions.children
  .filter(c =>
    c.class === 'symbolMaster');

  isSymboldMaster = task.ruleOptions.children.length === symboldMasters.length && symboldMasters.length > 0;
  hasArtboards = artboards.length > 0;

  // if page is a symbol master, we do not validate
  if (isSymboldMaster) {
    return errors;
  }

  // if the page is not a symbol master, check if it has artboards
  if (!hasArtboards) {
    errors.push(new NoArtboardFoundError({
      message: NO_ARTBOARD_ERROR_MESSAGE,
      ...object,
    }));
  }
  if (!pageNameCheck) {
    errors.push(new PageNamingError({
      message: PAGE_NAME_ERROR_MESSAGE(task.ruleOptions.artboardSizes),
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
export function checkPageName(tasks: IValidationContext[], sizes: string[]): boolean {
  const allPageNames = tasks.map(t => t.name);
  const missing = sizes.filter(size => allPageNames.indexOf(size) < 0);
  if (missing.length <= 0) {
    return true;
  }
  return false;
}
