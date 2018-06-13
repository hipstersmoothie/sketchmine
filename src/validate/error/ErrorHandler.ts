import { ValidationError, ColorNotInPaletteError } from './ValidationError';
import chalk from 'chalk';

export class ErrorHandler {
  private static instance: ErrorHandler;
  private static _messages: ValidationError[] = [];

  static get messages(): ValidationError[] { return ErrorHandler._messages; }

  static addError(error: ValidationError) {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    ErrorHandler._messages.push(error);
    return ErrorHandler.instance;
  }

  static emit() {
    const colors = new Set();
    for (let i = 1, max = ErrorHandler._messages.length; i <= max; i += 1) {
      const item = ErrorHandler._messages[i - 1];
      console.log(
        chalk`{bold ${i.toString()}) {magenta ${item.objectId}}} — ${item.name}\n${item.message}\n`,
      );

      if (item instanceof ColorNotInPaletteError) {
        colors.add(item.color);
      }
    }

    console.log(
      chalk`{bgRed Error, failed {bold ${ErrorHandler._messages.length.toString()} times} }` +
      chalk`{bgRed while validating the .sketch file:\n\n}`,
    );

    console.log(`There are ${colors.size.toString()} colors not in the Dynatrace color Palette`);
    console.log(Object.values(colors).join(', '));

    const error = ErrorHandler.messages[0];
    throw error;
  }
}
