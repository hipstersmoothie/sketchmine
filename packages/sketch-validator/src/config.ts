import { SketchObjectTypes } from '@sketchmine/sketch-file-format';
import { IValidationRule, ValidationRequirements } from './interfaces/validation-rule.interface';
import { artboardValidation } from './rules/artboard-validation';
import { colorValidation } from './rules/color-validation';
import { pageValidation } from './rules/page-validation';
import { symbolNameValidation } from './rules/symbol-name-validation';
import { textStyleValidation } from './rules/text-style-validation';
import { textValidation } from './rules/text-validation';

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
  '#6D6D6D', // gray-600, pagination (deselected)
  '#454646', // gray-700, text color
  '#191919', // gray-900, pagination, table
  '#00A1B2', // turquoise-600, link color
  '#00848e', // turquoise-700, link hover color
  '#DC172A', // red-500, error color
  '#C41425', // red-600, error hover color
  '#5EAD35', // green-600
  '#3F962A', // green-700
  '#14A8F5', // blue-500, chart tab (deselected)
  '#008CDB', // blue-600, chart tab (selected)
  '#9355B7', // purple-500, chart tab (deselected)
  '#7C38A1', // purple-600, chart tab (selected)
  '#526CFF', // royal-blue-500, chart tab (deselected)
  '#4556D7', // royal-blue-600, chart tab (selected)
];

export const rules: IValidationRule[] = [
  {
    selector: [SketchObjectTypes.SymbolMaster],
    name: 'symbol-name-validation',
    description: 'Check if the symbol names matche the Dynatrace Sketch naming conventions.',
    env: ['global'],
    validation: symbolNameValidation,
  },
  {
    selector: [
      SketchObjectTypes.Path,
      SketchObjectTypes.ShapePath,
      SketchObjectTypes.ShapeGroup,
      SketchObjectTypes.Oval,
      SketchObjectTypes.Polygon,
      SketchObjectTypes.Rectangle,
      SketchObjectTypes.Triangle,
      SketchObjectTypes.Artboard, // Select artboard to validate the background color
    ],
    name: 'color-palette-validation',
    description: 'Check if the used colors are in our color palette.',
    ignoreArtboards: ['full-color-palette'],
    env: ['global', 'product'],
    validation: colorValidation,
    options: {
      dynatraceLogoColors: DYNATRACE_LOGO_COLORS,
      colors: '', // gets overriden by run function on node.js and otherwise by sketch plugin
      requirements: [
        ValidationRequirements.Style,
        ValidationRequirements.BackgroundColor,
      ],
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
      requirements: [ValidationRequirements.Children],
    },
  },
  {
    selector: [SketchObjectTypes.Text],
    name: 'text-style-validation',
    description: 'Check if text styles from the Sketch library are used correctly and have not been modified.',
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
  {
    selector: [SketchObjectTypes.Text],
    name: 'text-validation',
    description: 'Check if only valid font families, colors and sizes are used.',
    env: ['product'],
    validation: textValidation,
    includePages: artboardSizes,
    options: {
      requirements: [
        ValidationRequirements.AttributedString,
        ValidationRequirements.Style,
      ],
      HEADLINE_TEXT_STYLES,
      VALID_TEXT_COLORS,
    },
  },
];
