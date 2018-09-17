import { artboardValidation } from './artboard-validation';
import { ArtboardNamingError, ArtboardSizeError } from '../../error/validation-error';

describe('Artboard Validation', () => {

  it('should check if validation passes for name with three parts', () => {
    const fakeHomeworks = [{
      _class: 'symbolMaster',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1280-services-serviceflow-test',
      frame: {
        width: 1280,
      },
    }] as any[];
    expect(artboardValidation(fakeHomeworks, 0)).toBeTruthy();
  });

  it('should check if validation fails for name with two parts', () => {
    const fakeHomeworks = [{
      _class: 'symbolMaster',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1280-services',
      frame: {
        width: 1280,
      },
    }] as any[];
    const result = artboardValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    result.forEach(r => expect(r).toBeInstanceOf(ArtboardNamingError));
  });

  it('should check if validation fails for invalid artboard size in name', () => {
    const fakeHomeworks = [{
      _class: 'symbolMaster',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1240-services-serviceflow',
      frame: {
        width: 1280,
      },
    }] as any[];
    const result = artboardValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    result.forEach(r => expect(r).toBeInstanceOf(ArtboardNamingError));
  });

  it('should check if validation fails if name does not match actual artboard size', () => {
    const fakeHomeworks = [{
      _class: 'symbolMaster',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1280-services-serviceflow',
      frame: {
        width: 1240,
      },
    }] as any[];
    const result = artboardValidation(fakeHomeworks, 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    result.forEach(r => expect(r).toBeInstanceOf(ArtboardSizeError));
  });
});
