import { IValdiationContext } from '../interfaces/IValidationRule';
import { ValidationError } from '../error/ValidationError';

export abstract class Validation {
  // make abstract class to extend the single validations

  constructor(
    homeworks: IValdiationContext[],
    currentTask: number,
  ) {}

  abstract validate(): ValidationError | boolean;
}
