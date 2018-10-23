import { IValidationRule } from './interfaces/validation-rule.interface';
import { symbolNameValidation } from './rules/symbol-name-validation';
import { colorValidation } from './rules/color-validation';
import { artboardValidation } from './rules/artboard-validation';
import { pageValidation } from './rules/page-validation';

/** Available sizes */
const artboardSizes: string[] = [
  '360',
  '1280',
  '1920',
];

export const DYNATRACE_LOGO_COLORS = [
  '#FFFFFF', /** logo-white */
  '#1496FF', /** logo-blue */
  '#6F2DA8', /** logo-purple */
  '#B4DC00', /** logo-limegreen */
  '#73BE28', /** logo-green */
  '#1A1A1A', /** logo-dark-gray */
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
    env: ['global', 'product'],
    validation: colorValidation,
    options: {
      dynatraceLogoColors: DYNATRACE_LOGO_COLORS,
      colors: '', // gets overriden by run function on node.js and otherwise by sketch plugin
    },
  },
  {
    selector: ['artboard'],
    name: 'arboard-validation',
    description: 'Check if the artboard names are valid.',
    env: ['product'],
    validation: artboardValidation,
    includePages: artboardSizes,
  },
  {
    selector: ['page'],
    name: 'page-validation',
    description: 'Check if the page names are valid.',
    env: ['product'],
    validation: pageValidation,
    options: {
      artboardSizes,
    },
  },
];
