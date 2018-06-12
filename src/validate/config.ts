import { IValidationRule } from './interfaces/IValidationRule';
import { symbolNameValidation } from './rules/symbol-name-validation';

export const rules: IValidationRule[] = [
  {
    selector: 'symbolMaster',
    name: 'symbol-name-validation',
    description: `Validation if the symbol names matches the Dynatrace Sketch naming conventions.` +
    ``,
    validation: symbolNameValidation,
  },
];
