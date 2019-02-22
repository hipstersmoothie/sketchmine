import { Logger, readFile } from '@sketchmine/node-helpers';
import { colorToSketchColor, SketchBase } from '@sketchmine/sketch-file-format';
import { rules } from '../src/config';
import { ErrorHandler } from '../src/error';
import {
  NoForeignTextStylesError,
  NoSharedTextStylesError,
  NoSharedTextStylesOverridesError,
} from '../src/error/validation-error';
import { textStyleValidation } from '../src/rules/text-style-validation';
import { Validator } from '../src/validator';
import { getTaskFixtures } from './fixtures/task-fixtures';
import { getSketchPagesWithModifiedTextLayer, getSketchPagesWithText } from './fixtures/text-fixtures';

// tslint:disable-next-line max-line-length
describe('[sketch-validator] › Text style validation › Tests if the color validation passes and fails as expected.', () => {
  const log = new Logger();
  let validator: Validator;
  const handler = new ErrorHandler(log);
  let documentFixture: SketchBase;

  beforeEach(async () => {
    const textValidationRule = rules.find(rule => rule.name === 'text-style-validation');
    validator = new Validator([textValidationRule], handler, 'product');
    handler.rulesStack = {};
    documentFixture = JSON.parse(
      await readFile('tests/fixtures/text-validation-document.json'),
    );
  });

  test('should check if validation fails when foreign text style property is empty in document.json', async () => {
    documentFixture.foreignTextStyles = []; // set foreign text styles to empty array
    await validator.addDocumentFile(documentFixture);
    validator.files = getSketchPagesWithText(0);
    validator.validate();

    const result = handler.rulesStack['text-style-validation'];
    expect(result.succeeding).toBe(0);
    expect(result.failing).toHaveLength(4); // 2 text layers, 2 errors each
    expect(result.failing[0]).toBeInstanceOf(NoForeignTextStylesError);
    expect(result.failing[2]).toBeInstanceOf(NoForeignTextStylesError);
  });

  test('should check if validation fails when no shared text style is used', async () => {
    await validator.addDocumentFile(documentFixture);
    validator.files = getSketchPagesWithText(0);
    validator.validate();

    const result = handler.rulesStack['text-style-validation'];
    expect(result.succeeding).toBe(2); // foreign text styles are given in documentFixture
    expect(result.failing).toHaveLength(2); // 2 text layers not using a shared text style
    expect(result.failing[0]).toBeInstanceOf(NoSharedTextStylesError);
    expect(result.failing[1]).toBeInstanceOf(NoSharedTextStylesError);
  });

  // tslint:disable-next-line max-line-length
  test('should check if validation passes when no shared text style is used because color has been changed', async () => {
    await validator.addDocumentFile(documentFixture);
    validator.files = getSketchPagesWithModifiedTextLayer(colorToSketchColor('#00a1b2'));
    validator.validate();

    const result = handler.rulesStack['text-style-validation'];
    expect(result.succeeding).toBe(1); // foreign text styles given
    expect(result.failing).toHaveLength(0); // text does not use text style which is okay because it contains two colors
  });

  // tslint:disable-next-line max-line-length
  test('should check if validation fails when no shared text style is used because font size has been changed', async () => {
    await validator.addDocumentFile(documentFixture);
    validator.files = getSketchPagesWithModifiedTextLayer(20);
    validator.validate();

    const result = handler.rulesStack['text-style-validation'];
    expect(result.succeeding).toBe(1); // foreign text styles given
    expect(result.failing).toHaveLength(1); // error because no text style is used and font size has been modified
    expect(result.failing[0]).toBeInstanceOf(NoSharedTextStylesError);
  });

  test('should check if shared style has not been changed manually', () => {
    const fakeHomeworks = getTaskFixtures(documentFixture);
    const result = textStyleValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(3);
    expect(result[1]).toBeInstanceOf(NoSharedTextStylesOverridesError);
  });
});
