import { IValdiationContext, IValidationRule } from './interfaces/IValidationRule';
import chalk from 'chalk';

export class Teacher {

  constructor(private _rules: IValidationRule[]) {}

  improve(homework: IValdiationContext[]) {
    for (let i = 0, max = homework.length; i < max; i += 1) {
      this.applyCorrection(homework, i);
    }
  }

  private applyCorrection(homework: IValdiationContext[], currentTask: number) {
    const task = homework[currentTask];
    const specification = this._rules.find(rule => rule.selector === task._class);

    if (!specification) {
      return;
    }

    try {
      const mark = specification.validation.call(specification.validation, homework, currentTask);

      if (typeof mark === 'boolean' && mark === true) {
        console.log(
          chalk`{green ✔︎ ${specification.name}} {grey — passed for} ${task.name}`,
        );
        return;
      }
      console.log(
        chalk`{redBright ✘ ${specification.name} failed!}\n\n`,
        chalk` {red ${mark.name}}\n`,
        chalk` ${mark.message}\n\n`,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
