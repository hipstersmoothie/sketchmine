import { checkThemeInName, CONTAIN_THEME_NAME_ERROR, symbolNameValidation } from './symbol-name-validation';
import { WrongSymbolNamingError } from '../../error/validation-error';

describe('Symbol Name Validation', () => {

  it('should check for themeless', () => {
    const name = 'menubar\/action'.split('/');
    expect(checkThemeInName(name)).toBeTruthy();
  });
  it('should check if theme name is used', () => {
    const name = 'componenent-name\/action'.split('/');
    expect(checkThemeInName(name)).toBe(CONTAIN_THEME_NAME_ERROR);
  });
  it('should check if correct theme name like dark-bg or light-bg is used', () => {
    const nameWrongTheme = 'componenent-name\/dark-theme\/action'.split('/');
    expect(checkThemeInName(nameWrongTheme)).toBe(CONTAIN_THEME_NAME_ERROR);
    const nameLight = 'componenent-name\/light-bg\/action'.split('/');
    expect(checkThemeInName(nameLight)).toBeTruthy();
    const nameDark = 'componenent-name\/dark-bg\/action'.split('/');
    expect(checkThemeInName(nameDark)).toBeTruthy();
  });

  it('should contain at least two parts', () => {
    const fakeHomeworks = [{
      _class: 'symbolMaster',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: 'componenent-name',
    }] as any[];

    const result = symbolNameValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    result.forEach(r => expect(r).toBeInstanceOf(WrongSymbolNamingError));
  });

  it('should pass for »component-name\/light-bg\/state«', () => {
    const fakeHomeworks = [{
      _class: 'symbolMaster',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: 'component-name\/light-bg\/state',
    }] as any[];

    const result = symbolNameValidation(fakeHomeworks, 0);
    expect(result).toBeTruthy();
  });
});
