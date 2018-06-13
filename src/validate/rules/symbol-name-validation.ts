import { IValdiationContext } from '../interfaces/IValidationRule';
import { ValidationError, WrongSymbolNamingError, DuplicatedSymbolError } from '../error/ValidationError';
import chalk from 'chalk';
import { ErrorHandler } from '../error/ErrorHandler';

enum THEMELESS {
  icons = 'icons',
  globalNavigations = 'global-navigations',
  menubar = 'menubar',
}

enum THEME_NAMES {
  dark = 'dark-bg',
  light = 'light-bg',
}

export function symbolNameValidation(
  homeworks: IValdiationContext[],
  currentTask: number,
  ): ValidationError | boolean {
  const task = homeworks[currentTask];
  if (!task) {
    console.error(
      chalk`{bgRed [symbol-name-validation.ts]} -> symbolNameValidation needs a valid task` +
      chalk`{cyan IValdiationContext[]} parameter with index!\n`,
    );
    return false;
  }
  const name = task.name.split('/');
  const object = {
    objectId: task.do_objectID,
    name: task.name,
  };

  if (name.length < 2) {
    const error = new WrongSymbolNamingError({
      message: `The symbolname should contain at least 1 backslash / so that it is correct grouped!`,
      ...object,
    });
    ErrorHandler.addError(error);
  }

  // check if theme name is correct set
  const themeName = checkThemeInName(name);
  if (typeof themeName !== 'boolean') {
    const error = new WrongSymbolNamingError({
      message: themeName,
      ...object,
    });
    ErrorHandler.addError(error);
  }

  // Check for duplicate names
  const names = homeworks.map(homework => homework.name);
  if (names.indexOf(task.name) !== names.lastIndexOf(task.name)) {
    const error = new DuplicatedSymbolError({
      message: chalk`Duplycated Symbol!\nThe Symbol {grey ${task.name}} exists!`,
      ...object,
    });
    ErrorHandler.addError(error);
  }

  return true;
}

/**
 * Check if the thme name is in the name
 * if string is returned it is the error message
 * @param name string[]
 * @returns boolean | string
 */
function checkThemeInName(name: string[]): boolean | string {
  if (Object.values(THEMELESS).includes(name[0])) {
    return true;
  }
  const themes = Object.values(THEME_NAMES);
  if (themes.includes(name[1])) {
    return true;
  }
  return chalk`The symbol name has to include a theme name: {grey ${themes.join(', ')} }`;
}
