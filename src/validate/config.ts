import { IValidationRule } from './interfaces/validation-rule.interface';
import { symbolNameValidation } from './rules/symbol-name-validation';
import { colorValidation } from './rules/color-validation';
import { artboardValidation } from './rules/artboard-validation';
import { pageValidation } from './rules/page-validation';

/** Available sizes */
const artboardSizes: String[] = [
  '360',
  '1280',
  '1920',
];

export const rules: IValidationRule[] = [
  {
    selector: ['symbolMaster'],
    name: 'symbol-name-validation',
    description: 'Validation if the symbol names matches the Dynatrace Sketch naming conventions.',
    env: ['global'],
    validation: symbolNameValidation,
  },
  {
    selector: ['shapeGroup', 'rectangle', 'path'],
    name: 'color-palette-validation',
    description: 'Check if the used colors are in our color palette.',
    ignoreArtboards: ['full-color-palette'],
    env: ['product'],
    validation: colorValidation,
  },
  {
    selector: ['artboard'],
    name: 'arboard-validation',
    description: 'Check if the artboard names are valid.',
    validation: artboardValidation,
  },
  {
    selector: ['page'],
    name: 'page-validation',
    description: 'Check if the page names are valid.',
    validation: pageValidation,
    options: {
      artboardSizes,
    },
  },
];
