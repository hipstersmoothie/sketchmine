import { IValdiationContext } from '../interfaces/IValidationRule';
import { ValidationError } from '../error/ValidationError';
import chalk from 'chalk';

enum THEMELESS {
  icons = 'icons',
  globalNavigations = 'global-navigations',
  member = 'member',
}

enum THEME_NAMES {
  dark = 'bg-dark',
  light = 'bg-light',
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
    return new ValidationError({
      message: `The symbolname should contain at least 1 backslash / so that it is correct grouped!`,
      ...object,
    });
  }

  // check if theme name is correct set
  const themeName = checkThemeInName(name);
  if (typeof themeName !== 'boolean') {
    return new ValidationError({
      message: themeName,
      ...object,
    });
  }

  // Check for duplicate names
  const names = homeworks.map(homework => homework.name);
  if (names.indexOf(task.name) !== names.lastIndexOf(task.name)) {
    return new ValidationError({
      message: chalk`Duplycated Symbol!\n  The Symbol {grey ${task.name}} exists!`,
      ...object,
    });
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
