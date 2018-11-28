import { SketchBase } from '@sketchmine/sketch-file-format';
import { readFile } from '@sketchmine/helpers';
import {
  NoForeignTextStylesError,
  NoSharedTextStylesError,
  NoSharedTextStylesOverridesError,
  WrongHeadlineError,
  InvalidTextColorError,
  TextTooSmallError,
} from '../../error/validation-error';
import { getFakeHomeworks } from '../../../tests/fixtures/fake-homeworks';
import { textStyleValidation } from './text-style-validation';

describe('[sketch-validator] › Text Style Validation › Tests usage of text styles defined in global library.', () => {
  let sketchDocument: SketchBase;

  beforeEach(async () => {
    sketchDocument = JSON.parse(
      await readFile('tests/fixtures/text-validation-document.json'),
    );
  });

  test('should check if validation fails when foreign text style property is empty in document.json', () => {
    sketchDocument.foreignTextStyles = []; // set foreign text styles to empty array
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textStyleValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(NoForeignTextStylesError);
  });

  test('should check if validation fails when no shared text style is used', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textStyleValidation(fakeHomeworks, 1);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(2);
    expect(result[1]).toBeInstanceOf(NoSharedTextStylesError);
  });

  test('should check if validation passes when no shared text style is used because color has been changed', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textStyleValidation(fakeHomeworks, 2);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeTruthy();
  });

  test('should check if validation fails when no shared text style is used because font size has been changed', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textStyleValidation(fakeHomeworks, 3);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(2);
    expect(result[1]).toBeInstanceOf(NoSharedTextStylesError);
  });

  test('should check if shared style has not been changed manually', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textStyleValidation(fakeHomeworks, 4);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(3);
    expect(result[1]).toBeInstanceOf(NoSharedTextStylesOverridesError);
  });

  test('should check if correct headline text styles are used', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textStyleValidation(fakeHomeworks, 5);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(3);
    expect(result[2]).toBeInstanceOf(WrongHeadlineError);
  });

  test('should check if only valid text colors are used', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textStyleValidation(fakeHomeworks, 6);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(4);
    expect(result[2]).toBeInstanceOf(InvalidTextColorError);
  });

  test('should check if no font smaller than 12px is used', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textStyleValidation(fakeHomeworks, 6);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(4);
    expect(result[1]).toBeInstanceOf(TextTooSmallError);
  });
});
