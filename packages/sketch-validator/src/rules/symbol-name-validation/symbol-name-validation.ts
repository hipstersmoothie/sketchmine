import chalk from 'chalk';
import { ValidationError, WrongSymbolNamingError, DuplicatedSymbolError } from '../../error/validation-error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';
import {
  SYMBOL_NAME_ERROR_MESSAGE,
  THEME_NAME_ERROR_MESSAGE,
  DUPLICATE_SYMBOL_ERROR_MESSAGE,
} from '../../error/error-messages';

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

/**
 * Takes a homework and corrects it like a teacher 👩🏼‍🏫
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
    console.error(
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
      message: SYMBOL_NAME_ERROR_MESSAGE,
      ...object,
    }));
  } else if (!themeName) {
    errors.push(new WrongSymbolNamingError({
      message: THEME_NAME_ERROR_MESSAGE(ThemeNames),
      ...object,
    }));
  } else if (names.indexOf(task.name) !== names.lastIndexOf(task.name)) {
    errors.push(new DuplicatedSymbolError({
      message: DUPLICATE_SYMBOL_ERROR_MESSAGE(task.name),
      ...object,
    }));
  } else {
    errors.push(true);
  }

  return errors;
}

/**
 * Check if the thme name is in the name
 * @param name string[]
 * @returns boolean
 */
export function checkThemeInName(name: string[]): boolean {
  if (Object.values(ThemeLess).includes(name[0])) {
    return true;
  }
  const themes = Object.values(ThemeNames);
  if (themes.includes(name[1])) {
    return true;
  }
  return false;
}
