import { SketchObjectTypes } from '@sketchmine/sketch-file-format';
import { Validator } from '../src/validator';
import { Teacher } from '../src/teacher';
import { colorValidation } from '../src/rules/color-validation';
import { IValidationRule } from '../src/interfaces/validation-rule.interface';
import { ErrorHandler } from '../src/error';
import { Logger } from '@sketchmine/node-helpers';

const fixture = require('./fixtures/validation-fixture.json');
const RULE_FIXTURE: IValidationRule = {
  selector: [SketchObjectTypes.ShapeGroup, SketchObjectTypes.Rectangle, SketchObjectTypes.Path],
  name: 'color-palette-validation',
  description: 'Check if the used colors are in our color palette.',
  ignoreArtboards: ['full-color-palette'],
  validation: colorValidation,
};
jest.mock('../src/teacher');

const log = new Logger();
const handler = new ErrorHandler(log);

describe('Sketch Validation', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('if color rule gets applied when no environment product', async () => {
    RULE_FIXTURE.env = ['product'];
    const productValidator = new Validator([RULE_FIXTURE], handler, 'global');
    await productValidator.addFile(fixture);
    await productValidator.validate();
    expect(Teacher).not.toHaveBeenCalled();
    expect(Teacher.prototype.improve).not.toHaveBeenCalled();
    expect(productValidator.matchedRules).toHaveLength(0);
  });

  test('if color rule gets applied when no environment is set', async () => {
    RULE_FIXTURE.env = undefined;
    const productValidator = new Validator([RULE_FIXTURE], handler, 'product');
    await productValidator.addFile(fixture);
    await productValidator.validate();
    expect(Teacher).toHaveBeenCalledTimes(1);
    expect(Teacher.prototype.improve).toHaveBeenCalled();
    expect(productValidator.matchedRules).toHaveLength(10);
  });

  test('if no rules are applied if environment doesn\'t match', async () => {
    RULE_FIXTURE.env = ['product', 'global'];
    const productValidator = new Validator([RULE_FIXTURE], handler, 'blubber');
    await productValidator.addFile(fixture);
    await productValidator.validate();
    expect(Teacher).not.toHaveBeenCalled();
    expect(Teacher.prototype.improve).not.toHaveBeenCalled();
    expect(productValidator.matchedRules).toHaveLength(0);
  });

  test('if all rules are applied if multiple environments are set', async () => {
    RULE_FIXTURE.env = ['product', 'global'];
    const productValidator = new Validator([RULE_FIXTURE], handler, 'product');
    await productValidator.addFile(fixture);
    await productValidator.validate();
    expect(Teacher).toHaveBeenCalledTimes(1);
    expect(Teacher.prototype.improve).toHaveBeenCalled();
    expect(productValidator.matchedRules).toHaveLength(10);
  });
});
