import { SketchBase } from '@sketchmine/sketch-file-format';
import { readFile } from '@sketchmine/node-helpers';
import {
  InvalidTextColorError,
  NoTextColorError,
  TextTooSmallError,
  WrongFontError,
} from '../src/error/validation-error';
import { getFakeHomeworks } from './fixtures/fake-homeworks';
import { textValidation } from '../src/rules/text-validation';

describe('[sketch-validator] › Text Validation › Tests usage of text in Sketch documents.', () => {
  let sketchDocument: SketchBase;

  beforeEach(async () => {
    sketchDocument = JSON.parse(
      await readFile('tests/fixtures/text-validation-document.json'),
    );
  });

  test('should check if only valid text colors are used', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textValidation(fakeHomeworks, 6);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(12);
    expect(result[3]).toBeInstanceOf(InvalidTextColorError);
  });

  test('should check if a text color is set', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textValidation(fakeHomeworks, 6);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(12);
    expect(result[9]).toBeInstanceOf(NoTextColorError);
  });

  test('should check if no font smaller than 12px is used', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textValidation(fakeHomeworks, 6);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(12);
    expect(result[1]).toBeInstanceOf(TextTooSmallError);
  });

  test('should check if no font other than BerninaSans or Bitstream Vera is used', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textValidation(fakeHomeworks, 6);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(12);
    expect(result[8]).toBeInstanceOf(WrongFontError);
  });
});
