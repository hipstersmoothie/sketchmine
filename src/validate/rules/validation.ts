import { IValidationContext } from '../interfaces/validation-rule';
import { ValidationError } from '../error/validation-error';

export abstract class Validation {
  // make abstract class to extend the single validations

  constructor(
    homeworks: IValidationContext[],
    currentTask: number,
  ) {}

  abstract validate(): ValidationError | boolean;
}
