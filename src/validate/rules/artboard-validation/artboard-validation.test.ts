import { artboardValidation } from './artboard-validation';
import { ArtboardNamingError, ArtboardSizeError } from '../../error/validation-error';

describe('Artboard Validation', () => {

  test('should check if validation passes for name with three parts', () => {
    const fakeHomeworks = [{
      _class: 'artboard',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1280-services-serviceflow',
      frame: {
        width: 1280,
      },
      parents: {
        page: '1280',
      },
    }] as any[];
    expect(artboardValidation(fakeHomeworks, 0)).toBeTruthy();
  });

  test('should check if validation fails for name with two parts', () => {
    const fakeHomeworks = [{
      _class: 'artboard',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1280-services',
      frame: {
        width: 1280,
      },
      parents: {
        page: '1280',
      },
    }] as any[];
    const result = artboardValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    result.forEach(r => expect(r).toBeInstanceOf(ArtboardNamingError));
  });

  test('should check if validation fails for invalid artboard size in name', () => {
    const fakeHomeworks = [{
      _class: 'artboard',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1240-services-serviceflow',
      frame: {
        width: 1280,
      },
      parents: {
        page: '1280',
      },
    }] as any[];
    const result = artboardValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    result.forEach(r => expect(r).toBeInstanceOf(ArtboardNamingError));
  });

  test('should check if validation passes if size stated in artboard name does match size stated in page name', () => {
    const fakeHomeworks = [{
      _class: 'artboard',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1280-services-serviceflow',
      frame: {
        width: 1280,
      },
      parents: {
        page: '1280',
      },
    }] as any[];
    expect(artboardValidation(fakeHomeworks, 0)).toBeTruthy();
  });

  test('should check if validation fails if size stated in artboard name does not match size stated in page name', () => {
    const fakeHomeworks = [{
      _class: 'artboard',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1270-services-serviceflow',
      frame: {
        width: 1280,
      },
      parents: {
        page: '1280',
      },
    }] as any[];
    const result = artboardValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    result.forEach(r => expect(r).toBeInstanceOf(ArtboardNamingError));
  });

  test('should check if validation fails if page does not have at least one artboard with a valid width', () => {
    const fakeHomeworks = [{
      _class: 'artboard',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1280-services-serviceflow',
      frame: {
        width: 1920,
      },
      parents: {
        page: '1280',
      },
    }] as any[];
    const result = artboardValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    result.forEach(r => expect(r).toBeInstanceOf(ArtboardSizeError));
  });
});
