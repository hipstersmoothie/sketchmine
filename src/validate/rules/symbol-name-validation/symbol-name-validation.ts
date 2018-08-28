import chalk from 'chalk';
import { ValidationError, WrongSymbolNamingError, DuplicatedSymbolError } from '../../error/validation-error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';
import { Logger } from '@utils';

const log = new Logger();

/** Components that do not need a theme name */
export enum ThemeLess {
  icons = 'icons',
  globalNavigations = 'global-navigation',
  menubar = 'menubar',
}

/** Available Theme names */
export enum ThemeNames {
  dark = 'dark-bg',
  light = 'light-bg',
}

export const CONTAIN_THEME_NAME_ERROR =
  chalk`The symbol name has to include a theme name: {grey ${Object.values(ThemeNames).join(', ')}}`;

/**
 * Takes a homework and correct it like a teacher 👩🏼‍🏫
 * check if the name matches following rules:
 *  - at least two parts component/state or component/theme/state
 *  - contains theme name
 *  - is not duplicate in file
 * @param homeworks List of Validation Rules
 * @param currentTask number of the current task to validate
 */
export function symbolNameValidation(
  homeworks: IValidationContext[],
  currentTask: number,
  ): (ValidationError | boolean)[] {
  const task = homeworks[currentTask];
  if (!task) {
    log.error(
      chalk`{bgRed [symbol-name-validation.ts]} -> symbolNameValidation needs a valid task` +
      chalk`{cyan IValdiationContext[]} parameter with index!\n`,
    );
    return;
  }

  const errors: (ValidationError | boolean)[] = [];
  const name = task.name.split('/');
  const themeName = checkThemeInName(name);
  const names = homeworks.map(homework => homework.name);
  const object = {
    objectId: task.do_objectID,
    name: task.name,
  };

  if (name.length < 2) {
    errors.push(new WrongSymbolNamingError({
      message: `The symbolname should contain at least 1 backslash / so that it is correct grouped!`,
      ...object,
    }));
  } else if (typeof themeName !== 'boolean') {
    errors.push(new WrongSymbolNamingError({
      message: themeName,
      ...object,
    }));
  } else if (names.indexOf(task.name) !== names.lastIndexOf(task.name)) {
    errors.push(new DuplicatedSymbolError({
      message: chalk`Duplycated Symbol!\nThe Symbol {grey ${task.name}} exists!`,
      ...object,
    }));
  } else {
    errors.push(true);
  }

  return errors;
}

/**
 * Check if the thme name is in the name
 * if string is returned it is the error message
 * @param name string[]
 * @returns boolean | string
 */
export function checkThemeInName(name: string[]): boolean | string {
  if (Object.values(ThemeLess).includes(name[0])) {
    return true;
  }
  const themes = Object.values(ThemeNames);
  if (themes.includes(name[1])) {
    return true;
  }
  return CONTAIN_THEME_NAME_ERROR;
}
