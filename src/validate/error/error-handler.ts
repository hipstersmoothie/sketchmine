import { ValidationError, ColorNotInPaletteError, FileNameError } from './validation-error';
import chalk from 'chalk';
import { IErrorHandler } from '../interfaces/error-handler.interface';
import { IValidationRule } from '../interfaces/validation-rule.interface';
import { Logger } from '@utils/logger';

const log = new Logger();

export class ErrorHandler {

  private static instance: ErrorHandler;
  private _rulesStack: IErrorHandler.RulesStack = {};
  private _colors: Set<string> = new Set();

  // Singelton pattern Constructor returning instance if it exists
  constructor() {
    if (ErrorHandler.instance) {
      return ErrorHandler.instance;
    }
    ErrorHandler.instance = this;
  }

  destroy() {
    this._rulesStack = {};
    this._colors = new Set();
  }

  addError(rule: IValidationRule, error: ValidationError) {
    if (this._rulesStack.hasOwnProperty(rule.name)) {
      this._rulesStack[rule.name].failing.push(error);
      return;
    }
    this._rulesStack[rule.name] = {
      succeeding: 0,
      failing: [error],
      warning: rule.hasOwnProperty('warning') && rule.warning,
      description: rule.description,
    };
  }

  addSuccess(rule: IValidationRule) {
    if (this._rulesStack.hasOwnProperty(rule.name)) {
      this._rulesStack[rule.name].succeeding += 1;
      return;
    }
    this._rulesStack[rule.name] = {
      succeeding: 1,
      failing: [],
      warning: rule.hasOwnProperty('warning') && rule.warning,
      description: rule.description,
    };
  }

  emit() {
    let throwingError: ValidationError; // save one Error to throw for exit code
    let stackedOutput = '';

    for (const rule in this._rulesStack) {
      if (!this._rulesStack.hasOwnProperty(rule)) { continue; }
      const element = this._rulesStack[rule];
      const isWarning = element.warning;

      if (element.failing.length === 0) {
        stackedOutput += this.printErrorStatus(element, rule, 0);
      } else {
        if (!isWarning) {
          throwingError = element.failing[0];
          stackedOutput += this.printErrorStatus(element, rule, 2);
        } else {
          stackedOutput += this.printErrorStatus(element, rule, 1);
        }

        if (element.description) {
          stackedOutput += chalk`\n{grey \t${element.description}}\n`;
        }

        if (process.env.DEBUG) {
          this.tracedFailings(element.failing, isWarning);
        }

        if (this._colors.size > 0) {
          stackedOutput += this.colorPaletteError();
        }

      }
    }

    if (throwingError) {
      log.debug(chalk`\n{red 🚨 ––––––––––––––––––––––––––––––––––––––––––––––––––––––– 🚨}\n`);
    }

    log.notice(stackedOutput);

    if (throwingError) {
      log.error(chalk`{redBright The Error occured in the Object with the id: ${throwingError.objectId}} ` +
        chalk`{red ${throwingError.name}}\n`);

      throw throwingError;
    }
  }

  /**
   *
   * @param element The Error
   * @param type Type as number { 0 = success, 1 = warning, 2 = error }
   */
  printErrorStatus(element: IErrorHandler.Rule, rule: string, type: number): string {
    switch (type) {
      case 0:
        return chalk`\n\n{green ✅\t${rule}} {grey — passed ${element.succeeding.toString()} times.}`;
      case 1:
        return chalk`\n\n{yellow ⚠️\t${rule}} {grey – warned ${element.failing.length.toString()} times.}`;
      case 2:
        return chalk`\n\n{red ⛔️\t${rule}} {grey – failed ${element.failing.length.toString()} times.}`;
    }

  }

  private colorPaletteError(): string {
    let output = chalk`{grey There are {white ${this._colors.size.toString()} Colors} used, }` +
    chalk`{grey that are not in the color palette:\n\n}`;
    if (process.env.VERBOSE) {
      Array.from(this._colors).forEach(color => output += chalk`{hex('${color}') ███} ${color}  `);
      output += '\n\n';
    }
    this._colors.clear();
    return output;
  }

  private tracedFailings(failings: ValidationError[], warning: boolean) {
    const color = warning ? 'yellow' : 'redBright';

    for (let i = 1, max = failings.length; i <= max; i += 1) {
      const item = failings[i - 1];
      if (item instanceof FileNameError) {
        console.log(
          chalk`{${color} ${i.toString()}) ${item.constructor.name}} → in Folder ${item.name} with filename: \n` +
          chalk`{${color} ${item.objectId}}\n` +
          chalk`${item.message}\n`,
        );
        continue;
      }
      const trace = (item.parents.artboard) ? item.parents.artboard : item.parents.symbolMaster;
      console.log(
        chalk`{${color} ${i.toString()}) ${item.constructor.name}} → {grey ${item.parents.page} → ${trace}}\n` +
        chalk`{${color} ${item.objectId}} — ${item.name}\n` +
        chalk`${item.message}\n`,
      );

      if (item instanceof ColorNotInPaletteError) {
        this._colors.add(item.color);
      }
    }
  }
}
