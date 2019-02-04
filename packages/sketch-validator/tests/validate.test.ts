import { Logger } from '@sketchmine/node-helpers';
import { SketchObjectTypes } from '@sketchmine/sketch-file-format';
import { DYNATRACE_LOGO_COLORS, ARTBOARD_SIZES } from '../src/config';
import { ErrorHandler } from '../src/error';
import { IValidationRule, ValidationRequirements } from '../src/interfaces/validation-rule.interface';
import { artboardValidation } from '../src/rules/artboard-validation';
import { colorValidation } from '../src/rules/color-validation';
import { Teacher } from '../src/teacher';
import { Validator } from '../src/validator';

const fixture = require('./fixtures/validation-fixture.json');
const fixture2 = require('./fixtures/validation-fixture-2.json');
const documentFixture = require('./fixtures/text-validation-document.json');
const COLOR_VALIDATION_RULE: IValidationRule = {
  selector: [
    SketchObjectTypes.Path,
    SketchObjectTypes.ShapePath,
    SketchObjectTypes.ShapeGroup,
    SketchObjectTypes.Oval,
    SketchObjectTypes.Polygon,
    SketchObjectTypes.Rectangle,
    SketchObjectTypes.Triangle,
    SketchObjectTypes.Artboard,
  ],
  name: 'color-palette-validation',
  description: 'Check if the used colors are in our color palette.',
  ignoreArtboards: ['full-color-palette'],
  validation: colorValidation,
  options: {
    dynatraceLogoColors: DYNATRACE_LOGO_COLORS,
    colors: '', // gets overriden by run function on node.js and otherwise by sketch plugin
    requirements: [
      ValidationRequirements.Style,
      ValidationRequirements.BackgroundColor,
    ],
  },
};
const ARTBOARD_VALIDATION_RULE: IValidationRule = {
  selector: [SketchObjectTypes.Artboard],
  name: 'artboard-validation',
  description: 'Check if the artboard names are valid.',
  validation: artboardValidation,
  includePages: ARTBOARD_SIZES,
  options: {
    requirements: [
      ValidationRequirements.LayerSize,
      ValidationRequirements.Frame,
    ],
  },
};
const ANOTHER_RULE: IValidationRule = {
  selector: [SketchObjectTypes.Artboard],
  name: 'another-validation',
  description: 'This is a rule only used for testing.',
  validation: artboardValidation,
  includePages: ARTBOARD_SIZES,
  ignoreArtboards: ['1280'],
  env: ['product'],
  options: {
    requirements: [
      ValidationRequirements.LayerSize,
      ValidationRequirements.Frame,
    ],
  },
};
const ALL_REQUIREMENTS_RULE: IValidationRule = {
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
jest.mock('../src/teacher');

const log = new Logger();
const handler = new ErrorHandler(log);

describe('Sketch Validation', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('if validator throws errors when no files are given', async () => {
    let error;
    const errorValidator = new Validator([ANOTHER_RULE], handler, 'product');
    try {
      await errorValidator.validate();
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(new Error('No files to validate!'));
  });

  test('if color rule gets applied when no environment product', async () => {
    COLOR_VALIDATION_RULE.env = ['product'];
    const productValidator = new Validator([COLOR_VALIDATION_RULE], handler, 'global');
    await productValidator.addFile(fixture);
    await productValidator.validate();
    expect(Teacher).not.toHaveBeenCalled();
    expect(Teacher.prototype.improve).not.toHaveBeenCalled();
    expect(productValidator.homeworks).toHaveLength(0);
  });

  test('if color rule gets applied when no environment is set', async () => {
    COLOR_VALIDATION_RULE.env = undefined;
    const productValidator = new Validator([COLOR_VALIDATION_RULE], handler, 'product');
    await productValidator.addFile(fixture);
    await productValidator.validate();
    expect(Teacher).toHaveBeenCalledTimes(1);
    expect(Teacher.prototype.improve).toHaveBeenCalled();
    expect(productValidator.homeworks).toHaveLength(10);
  });

  test('if no rules are applied if environment doesn\'t match', async () => {
    COLOR_VALIDATION_RULE.env = ['product', 'global'];
    const productValidator = new Validator([COLOR_VALIDATION_RULE], handler, 'blubber');
    await productValidator.addFile(fixture);
    await productValidator.validate();
    expect(Teacher).not.toHaveBeenCalled();
    expect(Teacher.prototype.improve).not.toHaveBeenCalled();
    expect(productValidator.homeworks).toHaveLength(0);
  });

  test('if all rules are applied if multiple environments are set', async () => {
    COLOR_VALIDATION_RULE.env = ['product', 'global'];
    const productValidator = new Validator([COLOR_VALIDATION_RULE], handler, 'product');
    await productValidator.addFile(fixture);
    await productValidator.validate();
    expect(Teacher).toHaveBeenCalledTimes(1);
    expect(Teacher.prototype.improve).toHaveBeenCalled();
    expect(productValidator.homeworks).toHaveLength(10);
  });

  test('if rule options are merged correctly for artboard selector', async () => {
    const rules = [COLOR_VALIDATION_RULE, ARTBOARD_VALIDATION_RULE];
    const validator = new Validator(
      rules,
      handler,
      'product',
    );
    await validator.addFile(fixture2);
    await validator.validate();
    expect(validator.homeworks[0].ruleOptions).toHaveProperty('dynatraceLogoColors');
    expect(validator.homeworks[0].ruleOptions).toHaveProperty('colors');
    expect(validator.homeworks[0].ruleOptions).toHaveProperty('requirements');
    expect(validator.homeworks[0].ruleOptions).toHaveProperty('layerSize');
    expect(validator.homeworks[0].ruleOptions.requirements).toHaveLength(4);
  });

  test('if excluding of rules works as expected', async () => {
    const ignoreArtboardValidator = new Validator(
      [ANOTHER_RULE],
      handler,
      'product',
    );
    await ignoreArtboardValidator.addFile(fixture2);
    await ignoreArtboardValidator.validate();
    expect(ignoreArtboardValidator.homeworks).toHaveLength(1); // There are 2 artboards, but one is ignored

    const envValidator = new Validator(
      [ANOTHER_RULE],
      handler,
      'fake',
    );
    await envValidator.addFile(fixture2);
    await envValidator.validate();
    expect(envValidator.homeworks).toHaveLength(0); // Because environment does not match.

    ANOTHER_RULE.includePages = ['100'];
    const pagesValidator = new Validator(
      [ANOTHER_RULE],
      handler,
      'product',
    );
    await pagesValidator.addFile(fixture2);
    await pagesValidator.validate();
    expect(pagesValidator.homeworks).toHaveLength(0); // Because includePages does not contain given page.
  });

  test('if rule requirements options generate the expected outcome', async () => {
    const validator = new Validator(
      [ALL_REQUIREMENTS_RULE],
      handler,
      'product',
    );
    await validator.addFile(fixture2);
    await validator.addDocumentFile(documentFixture);
    await validator.validate();
    // homeworks[0] class: artboard
    expect(validator.homeworks[0]).toHaveProperty('style');
    expect(validator.homeworks[0]).toHaveProperty('frame');
    expect(validator.homeworks[0].ruleOptions).toHaveProperty('backgroundColor');
    expect(validator.homeworks[0].ruleOptions).toHaveProperty('layerSize');
    expect(validator.homeworks[0].ruleOptions.layerSize).toBe(3);
    expect(validator.homeworks[0].ruleOptions).toHaveProperty('children');
    expect(validator.homeworks[0].ruleOptions.children).toHaveLength(3);
    // homeworks[6] class: text
    expect(validator.homeworks[6].ruleOptions).toHaveProperty('sharedStyleID');
    expect(validator.homeworks[6].ruleOptions).toHaveProperty('stringAttributes');
    expect(validator.homeworks[6].ruleOptions.stringAttributes).toHaveLength(1);
    expect(validator.homeworks[6].ruleOptions).toHaveProperty('document');
  });
});
