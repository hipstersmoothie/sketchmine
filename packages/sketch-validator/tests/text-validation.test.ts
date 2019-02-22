import { Logger } from '@sketchmine/node-helpers';
import { rules } from '../src/config';
import { ErrorHandler } from '../src/error';
import {
  InvalidTextColorError,
  NoTextColorError,
  TextTooSmallError,
  WrongFontError,
} from '../src/error/validation-error';
import { Validator } from '../src/validator';
import { getSketchPagesWithText, getSketchPagesWithTextWithoutColor } from './fixtures/text-fixtures';

describe('[sketch-validator] › Text validation › Tests if the text validation succeeds and fails as expected.', () => {
  const log = new Logger();
  let validator: Validator;
  const handler = new ErrorHandler(log);

  beforeEach(async () => {
    const textValidationRule = rules.find(rule => rule.name === 'text-validation');
    validator = new Validator([textValidationRule], handler, 'product');
    handler.rulesStack = {};
  });

  test('should check if validation fails if invalid text color is used', () => {
    // color is a valid text color
    // rgb(69, 70, 70) == #454646 == $gray-700
    validator.files = getSketchPagesWithText(0, 'rgb(69, 70, 70)');
    validator.validate();

    const result = handler.rulesStack['text-validation'];
    expect(result.succeeding).toBe(6); // 2 text layers, 3 checks each
    expect(result.failing).toHaveLength(0);
  });

  test('should check if validation passes if valid text color is used', () => {
    // color is part of the Dynatrace color palette but not a valid text color
    // rgb(210, 239, 190) == #D2EFBE == $green-200
    validator.files = getSketchPagesWithText(0, 'rgb(210, 239, 190)');
    validator.validate();

    const result = handler.rulesStack['text-validation'];
    expect(result.succeeding).toBe(4); // 2 text layers, 3 checks each, 2 of them passing
    expect(result.failing).toHaveLength(2);
    expect(result.failing[0]).toBeInstanceOf(InvalidTextColorError);
    expect(result.failing[1]).toBeInstanceOf(InvalidTextColorError);
  });

  test('should check if a text color is set', () => {
    validator.files = getSketchPagesWithTextWithoutColor();
    validator.validate();

    const result = handler.rulesStack['text-validation'];
    expect(result.failing).toHaveLength(1);
    expect(result.failing[0]).toBeInstanceOf(NoTextColorError);
  });

  test('should check if no font smaller than 12px is used', () => {
    // color valid, text too small
    validator.files = getSketchPagesWithText(0, 'rgb(69, 70, 70)', '11px');
    validator.validate();

    const result = handler.rulesStack['text-validation'];
    expect(result.failing).toHaveLength(2);
    expect(result.failing[0]).toBeInstanceOf(TextTooSmallError);
    expect(result.failing[1]).toBeInstanceOf(TextTooSmallError);
  });

  test('should check if no font other than BerninaSans or Bitstream Vera is used', () => {
    // wrong font family
    validator.files = getSketchPagesWithText(0, 'rgb(69, 70, 70)', '14px', 'Helvetica Neue');
    validator.validate();

    const result = handler.rulesStack['text-validation'];
    expect(result.failing).toHaveLength(1);
    expect(result.failing[0]).toBeInstanceOf(WrongFontError);
  });
});
