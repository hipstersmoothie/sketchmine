import { ValidationError } from '../error/validation-error';

export namespace IErrorHandler {
  export interface RulesStack {
    [name: string]: Rule;
  }

  export interface Rule {
    failing: ValidationError[];
    succeeding: number;
    description?: string;
    warning?: boolean; // if it rule should throw or warn
  }

}