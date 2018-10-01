import { artboardValidation } from './artboard-validation';
import { ArtboardNamingError, ArtboardSizeError, ArtboardEmptyError } from '../../error/validation-error';
import { IValidationContext } from '../../interfaces/validation-rule.interface';



describe('Artboard Validation', () => {
  let fakeHomework: IValidationContext;

  beforeEach(() => {
    fakeHomework = {
      _class: 'artboard',
      do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
      name: '1280-services-serviceflow',
      frame: {
        width: 1280,
      },
      parents: {
        page: '1280',
      },
      layerSize: 3,
    } as IValidationContext;
  })

  test('should check if validation passes for name with three parts', () => {
    expect(artboardValidation([fakeHomework], 0)).toBeTruthy();
  });

  test('should check if validation fails for name with two parts', () => {
    fakeHomework.name = '1280-services';
    const result = artboardValidation([fakeHomework], 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ArtboardNamingError);
  });

  test('should check if validation fails for invalid artboard size in name', () => {
    fakeHomework.name = '1240-services-serviceflow';
    const result = artboardValidation([fakeHomework], 0);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ArtboardNamingError);
  });

  test('should check if validation fails if page does not have at least one artboard with a valid width', () => {
    fakeHomework.frame.width = 1920;
    const result = artboardValidation([fakeHomework], 0);
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(ArtboardSizeError);
  });

  test('should check if validation fails if an artboard is left empty', () => {
    fakeHomework.layerSize = 0;
    const result = artboardValidation([fakeHomework], 0);
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(ArtboardEmptyError);
  });
});
