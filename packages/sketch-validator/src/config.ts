import { SketchObjectTypes } from '@sketchmine/sketch-file-format';
import { IValidationRule, ValidationRequirements } from './interfaces/validation-rule.interface';
import { artboardValidation } from './rules/artboard-validation';
import { colorValidation } from './rules/color-validation';
import { pageValidation } from './rules/page-validation';
import { symbolNameValidation } from './rules/symbol-name-validation';
import { textStyleValidation } from './rules/text-style-validation';

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

/** Available headline text styles */
const HEADLINE_TEXT_STYLES = [
  '1920-H1', '1920-H2', '1920-H3',
  '1280-H1', '1280-H2', '1280-H3',
  '360-H1', '360-H2', '360-H3',
];

/** Valid text colors */
const VALID_TEXT_COLORS = [
  '#FFFFFF', // white
  '#CCCCCC', // gray-300
  '#B7B7B7', // gray-400
  '#898989', // gray-500
  '#454646', // gray-700, text color
  '#00A1B2', // turquoise-600, link color
  '#00848e', // turquoise-700, link hover color
  '#DC172A', // red-500, error color
  '#C41425', // red-600, error hover color
  '#5EAD35', // green-600
  '#3F962A', // green-700
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
      dynatraceLogoColors: DYNATRACE_LOGO_COLORS,
      colors: '', // gets overriden by run function on node.js and otherwise by sketch plugin
      requirements: [ValidationRequirements.Style],
    },
  },
  {
    selector: [SketchObjectTypes.Artboard],
    name: 'artboard-validation',
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
      requirements: [
        ValidationRequirements.AttributedString,
        ValidationRequirements.DocumentReference,
        ValidationRequirements.Style,
      ],
      HEADLINE_TEXT_STYLES,
      VALID_TEXT_COLORS,
    },
  },
];
