import { SketchBase } from '@sketch-draw/interfaces';
import { readFile } from '@utils';
import {
  NoForeignTextStylesError,
  NoSharedTextStylesError,
  NoSharedTextStylesOverridesError,
} from '../../error/validation-error';
import { getFakeHomeworks } from './fake-homeworks';
import { textStyleValidation } from './text-style-validation';

describe('[sketch-validator] › Text Style Validation › Tests', () => {
  let sketchDocument: SketchBase;

  beforeEach(async () => {
    sketchDocument = JSON.parse(await readFile('tests/fixtures/text-validation-document.json'));
  });

  test('should check if validation fails when foreign text style property is empty in document.json', () => {
    sketchDocument.foreignTextStyles = []; // set foreign text styles to empty array
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textStyleValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(NoForeignTextStylesError);
  });

  test('should check if validation fails if no shared text style is used', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textStyleValidation(fakeHomeworks, 1);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(NoSharedTextStylesError);
  });

  test('should check if shared style has not been changed manually', () => {
    const fakeHomeworks = getFakeHomeworks(sketchDocument);
    const result = textStyleValidation(fakeHomeworks, 2);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(NoSharedTextStylesOverridesError);
  });
});
