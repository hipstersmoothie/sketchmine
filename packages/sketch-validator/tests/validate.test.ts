import { Logger, readFile } from '@sketchmine/node-helpers';
import { SketchBase } from '@sketchmine/sketch-file-format';
import { rules } from '../src/config';
import { ErrorHandler } from '../src/error';
import { Teacher } from '../src/teacher';
import { Validator } from '../src/validator';
import { generateArtboardWithEnabledBackgroundColor } from './fixtures/artboard-fixtures';
import { generateValidSketchPages } from './fixtures/page-fixtures';
import { ALL_REQUIREMENTS_RULE, ANOTHER_RULE } from './fixtures/rule-fixtures';
import { getSketchPagesWithText } from './fixtures/text-fixtures';

jest.mock('../src/teacher');

// tslint:disable-next-line max-line-length
describe('[sketch-validator] › Sketch validator › Tests if the validator prepares tasks for all validations correctly.', () => {

  const log = new Logger();
  const handler = new ErrorHandler(log);
  let COLOR_VALIDATION_RULE;
  let ARTBOARD_VALIDATION_RULE;
  let documentFixture: SketchBase;

  beforeAll(async () => {
    COLOR_VALIDATION_RULE = rules.find(rule => rule.name === 'color-palette-validation');
    ARTBOARD_VALIDATION_RULE = rules.find(rule => rule.name === 'artboard-validation');
    documentFixture = JSON.parse(
      await readFile('tests/fixtures/text-validation-document.json'),
    );
  });

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

  test('if color rule does not get applied when product environment is not set', async () => {
    COLOR_VALIDATION_RULE.env = ['product'];
    const productValidator = new Validator([COLOR_VALIDATION_RULE], handler, 'global');
    productValidator.files = generateValidSketchPages(true);
    await productValidator.validate();

    expect(Teacher).not.toHaveBeenCalled();
    expect(Teacher.prototype.improve).not.toHaveBeenCalled();
    expect(productValidator.homeworks).toHaveLength(0);
  });

  test('if color rule gets applied when no environment is set', async () => {
    COLOR_VALIDATION_RULE.env = undefined;
    const productValidator = new Validator([COLOR_VALIDATION_RULE], handler, 'product');
    productValidator.files = generateValidSketchPages(true);
    await productValidator.validate();

    expect(Teacher).toHaveBeenCalledTimes(1);
    expect(Teacher.prototype.improve).toHaveBeenCalled();
    expect(productValidator.homeworks).toHaveLength(8); // 4 artboards, 4 rectangles
  });

  test('if no rules are applied if environment doesn\'t match', async () => {
    COLOR_VALIDATION_RULE.env = ['product', 'global'];
    const productValidator = new Validator([COLOR_VALIDATION_RULE], handler, 'blubber');
    productValidator.files = generateValidSketchPages(true);
    await productValidator.validate();

    expect(Teacher).not.toHaveBeenCalled();
    expect(Teacher.prototype.improve).not.toHaveBeenCalled();
    expect(productValidator.homeworks).toHaveLength(0);
  });

  test('if all rules are applied if multiple environments are set', async () => {
    COLOR_VALIDATION_RULE.env = ['product', 'global'];
    const productValidator = new Validator([COLOR_VALIDATION_RULE], handler, 'product');
    productValidator.files = generateValidSketchPages(true);
    await productValidator.validate();
    expect(Teacher).toHaveBeenCalledTimes(1);
    expect(Teacher.prototype.improve).toHaveBeenCalled();
    expect(productValidator.homeworks).toHaveLength(8); // 4 artboards, 4 rectangles
  });

  test('if only artboards are part of the resulting homeworks', async () => {
    const productValidator = new Validator([ARTBOARD_VALIDATION_RULE], handler, 'product');
    productValidator.files = generateValidSketchPages(true);
    await productValidator.validate();
    expect(Teacher).toHaveBeenCalledTimes(1);
    expect(Teacher.prototype.improve).toHaveBeenCalled();
    expect(productValidator.homeworks).toHaveLength(3);
    productValidator.homeworks.forEach(h => expect(h._class).toBe('artboard'));
  });

  test('if rule options are merged correctly for artboard selector', async () => {
    const rules = [COLOR_VALIDATION_RULE, ARTBOARD_VALIDATION_RULE];
    const validator = new Validator(rules, handler, 'product');
    validator.files = generateValidSketchPages(true);
    await validator.validate();

    expect(validator.homeworks[0]._class).toBe('artboard');
    expect(validator.homeworks[0].ruleOptions).toHaveProperty('dynatraceLogoColors');
    expect(validator.homeworks[0].ruleOptions).toHaveProperty('colors');
    expect(validator.homeworks[0].ruleOptions).toHaveProperty('requirements');
    expect(validator.homeworks[0].ruleOptions).toHaveProperty('layerSize');
    expect(validator.homeworks[0].ruleOptions.requirements).toHaveLength(4);
  });

  test('if excluding of rules works as expected', async () => {
    const ignoreArtboardValidator = new Validator([ANOTHER_RULE], handler, 'product');
    ignoreArtboardValidator.files = generateValidSketchPages(true);
    await ignoreArtboardValidator.validate();
    // There are 3 artboards (3 of the 4 pages are validated),
    // but one is ignored by the given rule
    expect(ignoreArtboardValidator.homeworks).toHaveLength(2);

    const envValidator = new Validator([ANOTHER_RULE], handler, 'fake');
    envValidator.files = generateValidSketchPages(true);
    await envValidator.validate();
    expect(envValidator.homeworks).toHaveLength(0); // Because environment does not match.

    ANOTHER_RULE.includePages = ['100'];
    const pagesValidator = new Validator([ANOTHER_RULE], handler, 'product');
    pagesValidator.files = generateValidSketchPages(true);
    await pagesValidator.validate();
    expect(pagesValidator.homeworks).toHaveLength(0); // Because includePages does not contain given page.
  });

  test('if rule requirements options generate the expected outcome', async () => {
    const allRequirementsValidator = new Validator([ALL_REQUIREMENTS_RULE], handler, 'product');
    const files = getSketchPagesWithText(1); // add some text to page with index 1
    files[0] = generateArtboardWithEnabledBackgroundColor(360, '#ccc'); // add background color to page with index 0
    allRequirementsValidator.files = files;
    await allRequirementsValidator.addDocumentFile(documentFixture);
    await allRequirementsValidator.validate();

    // homeworks[0] class: artboard
    expect(allRequirementsValidator.homeworks[0]).toHaveProperty('style');
    expect(allRequirementsValidator.homeworks[0]).toHaveProperty('frame');
    expect(allRequirementsValidator.homeworks[0].ruleOptions).toHaveProperty('backgroundColor');
    expect(allRequirementsValidator.homeworks[0].ruleOptions).toHaveProperty('layerSize');
    expect(allRequirementsValidator.homeworks[0].ruleOptions.layerSize).toBe(1);
    expect(allRequirementsValidator.homeworks[0].ruleOptions).toHaveProperty('children');
    expect(allRequirementsValidator.homeworks[0].ruleOptions.children).toHaveLength(1);
  });

  test('if rule requirements options generate the expected outcome when text styles are used', async () => {
    const allRequirementsValidator = new Validator([ALL_REQUIREMENTS_RULE], handler, 'product');
    const files = getSketchPagesWithText(1); // add some text to page with index 1

    /**
     * When a text style from a library is used in Sketch, an ID to the text style is
     * added to the text layer.
     *
     * The ID "9343FE57-1181-456A-801F-4046D11C9BBB" added here can be found in
     * fixtures/text-validation-document.json. The ID is only used for testing if the
     * validator adds the ID to the rule options. The styles itself don't match!
     */
    files[1].layers[0].layers
      .forEach((layer) => {
        if (layer._class === 'text') {
          layer.sharedStyleID = '9343FE57-1181-456A-801F-4046D11C9BBB';
        }
      });

    allRequirementsValidator.files = files;
    await allRequirementsValidator.addDocumentFile(documentFixture);
    await allRequirementsValidator.validate();

    // homeworks[4] class: text
    expect(allRequirementsValidator.homeworks[4].ruleOptions).toHaveProperty('sharedStyleID');
    expect(allRequirementsValidator.homeworks[4].ruleOptions).toHaveProperty('stringAttributes');
    expect(allRequirementsValidator.homeworks[4].ruleOptions.stringAttributes).toHaveLength(1);
    expect(allRequirementsValidator.homeworks[4].ruleOptions).toHaveProperty('document');
  });
});
