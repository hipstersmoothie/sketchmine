import { ValidationError } from './validation-error';
import { RulesStack } from '../interfaces/error-handler.interface';
import { IValidationRule } from '../interfaces/validation-rule.interface';

export type logFn = (message: string, ...args: any[]) => void;

export interface ErrorLogger {
  error: logFn;
  warning: logFn;
  notice: logFn;
  info: logFn;
  debug: logFn;
}

export abstract class BaseErrorHandler {
  protected static instance: BaseErrorHandler;
  rulesStack: RulesStack = {};

  constructor(protected logger: ErrorLogger) {
    if (BaseErrorHandler.instance) {
      return BaseErrorHandler.instance;
    }
    BaseErrorHandler.instance = this;
  }

  destroy() {
    this.rulesStack = {};
    BaseErrorHandler.instance = undefined;
  }

  addError(rule: IValidationRule, error: ValidationError) {
    if (this.rulesStack.hasOwnProperty(rule.name)) {
      this.rulesStack[rule.name].failing.push(error);
      return;
    }
    this.addNewRuleToRulesStack(rule, [error]);
  }

  addSuccess(rule: IValidationRule) {
    if (this.rulesStack.hasOwnProperty(rule.name)) {
      this.rulesStack[rule.name].succeeding += 1;
      return;
    }
    this.addNewRuleToRulesStack(rule, [], 1);
  }

  protected addNewRuleToRulesStack(rule: IValidationRule, failing: ValidationError[], succeeding: number = 0) {
    this.rulesStack[rule.name] = {
      succeeding,
      failing,
      warning: this.ruleHasWarning(rule),
      description: rule.description,
    };
  }

  protected ruleHasWarning(rule: IValidationRule): boolean {
    return rule.hasOwnProperty('warning') && rule.warning;
  }

  abstract emit(): void;
}
