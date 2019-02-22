import { SketchObjectTypes } from '@sketchmine/sketch-file-format';
import { DuplicatedSymbolError, WrongSymbolNamingError } from '../src/error/validation-error';
import { checkThemeInName, symbolNameValidation } from '../src/rules/symbol-name-validation';
import { generateMinimumTaskFixture } from './fixtures/minimum-task-fixture';

// tslint:disable-next-line max-line-length
describe('[sketch-validator] › Symbol name validation › Tests if the symbol name validation succeeds and fails as expected.', () => {

  test('should check for themeless', () => {
    const name = 'menubar\/action'.split('/');
    expect(checkThemeInName(name)).toBeTruthy();
  });
  test('should check if theme name is used', () => {
    const name = 'componenent-name\/action'.split('/');
    expect(checkThemeInName(name)).toBeFalsy();
  });
  test('should check if correct theme name like dark-bg or light-bg is used', () => {
    const nameWrongTheme = 'componenent-name\/dark-theme\/action'.split('/');
    expect(checkThemeInName(nameWrongTheme)).toBeFalsy();
    const nameLight = 'componenent-name\/light-bg\/action'.split('/');
    expect(checkThemeInName(nameLight)).toBeTruthy();
    const nameDark = 'componenent-name\/dark-bg\/action'.split('/');
    expect(checkThemeInName(nameDark)).toBeTruthy();
  });

  test('should contain at least two parts', () => {
    const fakeHomeworks = [
      generateMinimumTaskFixture('component-name', SketchObjectTypes.SymbolMaster),
    ] as any[];

    const result = symbolNameValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    result.forEach(r => expect(r).toBeInstanceOf(WrongSymbolNamingError));
  });

  test('should pass for »component-name\/light-bg\/state«', () => {
    const fakeHomeworks = [
      generateMinimumTaskFixture('component-name\/light-bg\/state', SketchObjectTypes.SymbolMaster),
    ] as any[];

    const result = symbolNameValidation(fakeHomeworks, 0);
    expect(result).toBeTruthy();
  });

  test('should check for duplicate components', () => {
    const fakeHomeworks = [
      generateMinimumTaskFixture('component-name\/light-bg\/state', SketchObjectTypes.SymbolMaster),
      generateMinimumTaskFixture('component-name\/light-bg\/state', SketchObjectTypes.SymbolMaster),
    ] as any[];

    const result = symbolNameValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(DuplicatedSymbolError);
  });
});
