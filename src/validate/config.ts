import { SketchObjectTypes } from '@sketch-draw/interfaces';
import { IValidationRule, ValidationRequirements } from './interfaces/validation-rule.interface';
import { artboardValidation } from './rules/artboard-validation';
import { colorValidation } from './rules/color-validation';
import { pageValidation } from './rules/page-validation';
import { symbolNameValidation } from './rules/symbol-name-validation';
// import { textStyleValidation } from './rules/text-style-validation';

/** Available sizes */
const artboardSizes: string[] = [
  '360',
  '1280',
  '1920',
];

export const rules: IValidationRule[] = [
  {
    selector: [SketchObjectTypes.SymbolMaster],
    name: 'symbol-name-validation',
    description: 'Validation if the symbol names matches the Dynatrace Sketch naming conventions.',
    env: ['global'],
    validation: symbolNameValidation,
  },
  {
    selector: [SketchObjectTypes.ShapeGroup, SketchObjectTypes.Rectangle, SketchObjectTypes.Path],
    name: 'color-palette-validation',
    description: 'Check if the used colors are in our color palette.',
    ignoreArtboards: ['full-color-palette'],
    env: ['global', 'product'],
    validation: colorValidation,
    options: {
      requirements: [ValidationRequirements.Style],
    },
  },
  {
    selector: [SketchObjectTypes.Artboard],
    name: 'arboard-validation',
    description: 'Check if the artboard names are valid.',
    env: ['product'],
    validation: artboardValidation,
    includePages: artboardSizes,
    options: {
      requirements: [ValidationRequirements.LayerSize, ValidationRequirements.Frame],
    },
  },
  {
    selector: [SketchObjectTypes.Page],
    name: 'page-validation',
    description: 'Check if the page names are valid.',
    env: ['product'],
    validation: pageValidation,
    options: {
      artboardSizes,
    },
  },
  {
    selector: [SketchObjectTypes.Text],
    name: 'text-style-validation',
    description: 'Check if text styles are used correctly.',
    env: ['product'],
    validation: textStyleValidation,
    includePages: artboardSizes,
    options: {
      requirements: [ValidationRequirements.DocumentReference, ValidationRequirements.Style],
    },
  },
];
