import { IValidationRule } from './interfaces/validation-rule';
import { symbolNameValidation } from './rules/symbol-name-validation';
import { colorValidation } from './rules/color-validation';

export const rules: IValidationRule[] = [
  {
    selector: ['symbolMaster'],
    name: 'symbol-name-validation',
    description: `Validation if the symbol names matches the Dynatrace Sketch naming conventions.` +
    ``,
    validation: symbolNameValidation,
  },
  {
    selector: ['shapeGroup', 'rectangle', 'path'],
    name: 'color-palette-validation',
    description: 'Check if the used colors are in our color palette.',
    ignoreArtboards: ['full-color-palette'],
    validation: colorValidation,
  },
];
