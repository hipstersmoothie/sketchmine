import { resolveTextAlign } from './resolve-text-align';
import { TextAlignment } from './sketch-constants';

describe('[sketch-generator] › helpers › resolve text align', () => {
  test('text align start', () => {
    expect(resolveTextAlign('start')).toEqual(TextAlignment.Left);
  });

  test('text align end', () => {
    expect(resolveTextAlign('end')).toEqual(TextAlignment.Right);
  });

  test('text align justify', () => {
    expect(resolveTextAlign('justify')).toEqual(TextAlignment.Justified);
  });

  test('text align right', () => {
    expect(resolveTextAlign('right')).toEqual(TextAlignment.Right);
  });

  test('text align left', () => {
    expect(resolveTextAlign('left')).toEqual(TextAlignment.Left);
  });

  test('text align center', () => {
    expect(resolveTextAlign('center')).toEqual(TextAlignment.Center);
  });

  test('text align -webkit-center', () => {
    expect(resolveTextAlign('-webkit-center')).toEqual(TextAlignment.Center);
  });

  test('text align -webkit-right', () => {
    expect(resolveTextAlign('-webkit-right')).toEqual(TextAlignment.Right);
  });

  test('text align -webkit-left', () => {
    expect(resolveTextAlign('-webkit-left')).toEqual(TextAlignment.Left);
  });
});
