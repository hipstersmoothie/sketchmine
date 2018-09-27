import { pageValidation } from './page-validation';
import { PageNamingError } from '../../error/validation-error';

describe('Page Validation', () => {

  test('should check if validation passes if all pages have valid names', () => {
    const fakeHomeworks = [{
      _class: 'page',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '360',
    },
    { _class: 'page',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1280',
    },
    { _class: 'page',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1920',
    },
    { _class: 'page',
    do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
    name: 'SymbolMaster',
    }] as any[];
    expect(pageValidation(fakeHomeworks, 0)).toBeTruthy();
  });

  test('should check if validation fails if pages are missing', () => {
    const fakeHomeworks = [{
      _class: 'page',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '360',
    }] as any[];
    const result = pageValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    result.forEach(r => expect(r).toBeInstanceOf(PageNamingError));
  });

  test('should check if validation fails if pages have wrong names', () => {
    const fakeHomeworks = [{
      _class: 'page',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '340',
    },
    { _class: 'page',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1280',
    },
    { _class: 'page',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1920',
    }] as any[];
    const result = pageValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    result.forEach(r => expect(r).toBeInstanceOf(PageNamingError));
  });
});
