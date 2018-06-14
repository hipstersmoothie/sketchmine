import chalk from 'chalk';
import { IValidationContext, IValidationRule, SketchModel } from './interfaces/IValidationRule';
import { ErrorHandler } from './error/ErrorHandler';
import { ValidationError } from './error/ValidationError';

export class Teacher {
  private _handler: ErrorHandler;

  constructor(private _rules: IValidationRule[]) {
    this._handler = new ErrorHandler();
  }

  improve(homework: IValidationContext[]) {
    for (let i = 0, max = homework.length; i < max; i += 1) {
      this.applyCorrection(homework, i);
    }
  }

  private applyCorrection(homework: IValidationContext[], currentTask: number) {
    const task = homework[currentTask];
    const specification = this._rules.find(rule => rule.selector.includes(task._class as SketchModel));

    if (!specification) {
      return;
    }

    try {
      const marks:(ValidationError | boolean)[] = specification.validation
        .call(this, homework, currentTask);

      if (marks instanceof Array) {
        marks.forEach((mark) => {
          if (typeof mark === 'boolean' && mark === true) {
            this._handler.addSuccess(specification);
          } else if (mark instanceof ValidationError) {
            mark.description = specification.description;
            mark.parents = task.parents;
            this._handler.addError(specification, mark);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
