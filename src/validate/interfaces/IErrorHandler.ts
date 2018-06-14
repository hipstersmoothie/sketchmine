import { ValidationError } from '../error/ValidationError';

export namespace IErrorHandler {
  export interface RulesStack {
    [name: string]: Rule;
  }

  export interface Rule {
    failing: ValidationError[];
    succeeding: number;
    description?: string;
  }

}
