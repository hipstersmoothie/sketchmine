import { ValidationError } from './validation-error';
import { Rule } from '../interfaces/error-handler.interface';
import { BaseErrorHandler } from './base-error-handler';

export class ErrorHandler extends BaseErrorHandler {

  emit() {
    let throwingError: ValidationError; // save one Error to throw for exit code
    let stackedOutput = '';

    for (const rule in this.rulesStack) {
      if (this.rulesStack.hasOwnProperty(rule)) {
        const element = this.rulesStack[rule];
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
            stackedOutput += `\n\t${element.description}\n`;
          }
        }
      }
    }

    this.logger.info(stackedOutput);

    if (throwingError) {
      this.logger.error(
        `The Error occurred in the Object with the id: ${throwingError.objectId} ${throwingError.name}\n`,
      );
      throw throwingError;
    }
  }

  /**
   *
   * @param element The Error
   * @param type Type as number { 0 = success, 1 = warning, 2 = error }
   */
  printErrorStatus(element: Rule, rule: string, type: number): string {
    switch (type) {
      case 0:
        return `\n\n✅\t${rule} — passed ${element.succeeding.toString()} times.`;
      case 1:
        return `\n\n⚠️\t${rule} – warned ${element.failing.length.toString()} times.`;
      case 2:
        return `\n\n⛔️\t${rule} – failed ${element.failing.length.toString()} times.`;
    }

  }
}
