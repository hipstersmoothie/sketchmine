import { SketchObjectTypes } from '@sketchmine/sketch-file-format';
import { artboardValidation } from '../../src/rules/artboard-validation';
import { DYNATRACE_LOGO_COLORS, ARTBOARD_SIZES, rules } from '../../src/config';
import { IValidationRule, ValidationRequirements } from '../../src/interfaces/validation-rule.interface';

export const ANOTHER_RULE: IValidationRule = {
  selector: [SketchObjectTypes.Artboard],
  name: 'another-validation',
  description: 'This is a rule only used for testing.',
  validation: artboardValidation,
  includePages: ARTBOARD_SIZES,
  ignoreArtboards: ['1280-test-ab'],
  env: ['product'],
  options: {
    requirements: [
      ValidationRequirements.LayerSize,
      ValidationRequirements.Frame,
    ],
  },
};

export const ALL_REQUIREMENTS_RULE: IValidationRule = {
  selector: [
    SketchObjectTypes.Path,
    SketchObjectTypes.ShapePath,
    SketchObjectTypes.ShapeGroup,
    SketchObjectTypes.Rectangle,
    SketchObjectTypes.Text,
    SketchObjectTypes.Artboard,
  ],
  name: 'some-validation',
  description: 'This is a rule used only for testing.',
  validation: artboardValidation,
  env: ['product'],
  options: {
    requirements: [
      ValidationRequirements.AttributedString,
      ValidationRequirements.BackgroundColor,
      ValidationRequirements.Children,
      ValidationRequirements.DocumentReference,
      ValidationRequirements.Frame,
      ValidationRequirements.LayerSize,
      ValidationRequirements.Style,
    ],
  },
};
