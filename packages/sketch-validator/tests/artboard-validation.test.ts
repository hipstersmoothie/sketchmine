import { Logger } from '@sketchmine/node-helpers';
import { rules } from '../src/config';
import { ArtboardEmptyError, ArtboardNamingError, ArtboardSizeError, ErrorHandler } from '../src/error';
import { Validator } from '../src/validator';
import { generateValidSketchPages } from './fixtures/page-fixtures';

// tslint:disable-next-line max-line-length
describe('[sketch-validator] › Artboard validation › Tests if the artboard validation succeeds and fails as expected.', () => {

  const log = new Logger();
  let validator: Validator;
  const handler = new ErrorHandler(log);

  beforeEach(() => {
    const artboardRule = rules.find(rule => rule.name === 'artboard-validation');
    validator = new Validator([artboardRule], handler, 'product');
    handler.rulesStack = {};
  });

  test('should check if validation passes for name with three parts', () => {
    validator.files = generateValidSketchPages(false);
    validator.validate();

    const result = handler.rulesStack['artboard-validation'];
    expect(result.succeeding).toBe(9); // 3 valid artboards, 3 checks each
    expect(result.failing).toHaveLength(0);
  });

  test('should check if validation fails for name with two parts', () => {
    validator.files = generateValidSketchPages(false);
    validator.files[0].layers[0].name = '360-test'; // artboard name with only 2 parts
    validator.validate();

    const result = handler.rulesStack['artboard-validation'];
    expect(result.succeeding).toBe(8);
    expect(result.failing[0]).toBeInstanceOf(ArtboardNamingError); // 1 wrong artboard name
  });

  test('should check if validation fails for invalid artboard size in name', () => {
    validator.files = generateValidSketchPages(false);
    validator.files[0].layers[0].name = '400-services-serviceflow'; // artboard name with wrong artboard size
    validator.validate();

    const result = handler.rulesStack['artboard-validation'];
    expect(result.succeeding).toBe(8);
    expect(result.failing[0]).toBeInstanceOf(ArtboardNamingError); // 1 wrong artboard name
  });

  test('should check if validation fails if an artboard has not a valid name', () => {
    validator.files = generateValidSketchPages(false);
    validator.files[0].layers[0].name = 'this-is-a-test'; // invalid artboard name
    validator.validate();

    const result = handler.rulesStack['artboard-validation'];
    expect(result.succeeding).toBe(8);
    expect(result.failing[0]).toBeInstanceOf(ArtboardNamingError); // 1 wrong artboard name
  });

  test('should check if validation fails if page does not have at least one artboard with a valid width', () => {
    validator.files = generateValidSketchPages(false);
    validator.files[0].layers[0].frame.width = 1280; // artboard size does not fit page name
    validator.validate();

    const result = handler.rulesStack['artboard-validation'];
    expect(result.succeeding).toBe(8);
    expect(result.failing[0]).toBeInstanceOf(ArtboardSizeError); // 1 artboard with wrong size
  });

  test('should check if validation fails if an artboard is left empty', () => {
    validator.files = generateValidSketchPages(false);
    validator.files[0].layers[0].layers = []; // unset content of first artboard on first page
    validator.validate();

    const result = handler.rulesStack['artboard-validation'];
    expect(result.succeeding).toBe(8);
    expect(result.failing[0]).toBeInstanceOf(ArtboardEmptyError); // 1 empty artboard
  });
});
