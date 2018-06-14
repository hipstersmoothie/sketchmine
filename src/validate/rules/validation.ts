import { IValidationContext } from '../interfaces/IValidationRule';
import { ValidationError } from '../error/ValidationError';

export abstract class Validation {
  // make abstract class to extend the single validations

  constructor(
    homeworks: IValidationContext[],
    currentTask: number,
  ) {}

  abstract validate(): ValidationError | boolean;
}
