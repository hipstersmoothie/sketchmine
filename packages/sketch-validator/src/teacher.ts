import { SketchObjectTypes } from '@sketchmine/sketch-file-format';
import { IValidationContext, IValidationRule } from './interfaces/validation-rule.interface';
import { ErrorHandler } from './error/error-handler';
import { ValidationError } from './error/validation-error';

/**
 * The teacher that applies the rules to the homeworks.
 */
export class Teacher {

  constructor(
    private _rules: IValidationRule[],
    private handler: ErrorHandler,
  ) { }

  improve(homeworks: IValidationContext[]) {
    for (let i = 0, max = homeworks.length; i < max; i += 1) {
      this.applyCorrection(homeworks, i);
    }
  }

  /**
   * Runs validation functions against prepared validation context, i.e. all parts of the given Sketch file
   * that are needed for the specified validation rule.
   * @param homeworks – Array of IValidationContext objects. Each object contains all the information from
   * the Sketch file that is needed for the specified validation rule.
   * @param currentTask – Number of task to validate (position in homeworks array).
   */
  private applyCorrection(homeworks: IValidationContext[], currentTask: number) {
    const task = homeworks[currentTask];
    task.ruleNames.forEach((ruleName) => {
      const matchingRule = this._rules.find(rule => rule.name === ruleName);

      // If there is no rule defined in the config that matches the rule name given in my task, return.
      if (!matchingRule) {
        return;
      }

      // Run the validation function given for the matching rule name.
      const marks:(ValidationError | boolean)[] = matchingRule.validation
        .call(null, homeworks, currentTask);

      if (marks instanceof Array) {
        marks.forEach((mark) => {
          if (mark === true) {
            this.handler.addSuccess(matchingRule);
          } else if (mark instanceof ValidationError) {
            mark.description = matchingRule.description;
            mark.parents = task.parents;
            this.handler.addError(matchingRule, mark);
          }
        });
      }
    });
  }
}
