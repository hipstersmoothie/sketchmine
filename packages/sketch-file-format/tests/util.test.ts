import { cssToRGBA } from '../src/helpers';

describe('[sketch-file-format] › convert css colors to RGBA', () => {

  test('convert #ff5e99 to rgba(255, 94, 153, 1)', () => {
    const color = cssToRGBA('#ff5e99');
    expect(color).toMatchObject(expect.objectContaining({ r: 255, g: 94, b: 153, a: 1 }));
  });

  test('convert rgb(255, 94, 153) to rgba(255, 94, 153, 1)', () => {
    const color = cssToRGBA('rgb(255, 94, 153)');
    expect(color).toMatchObject(expect.objectContaining({ r: 255, g: 94, b: 153, a: 1 }));
  });

  test('convert empty string to rgba(0, 0, 0, 0)', () => {
    const color = cssToRGBA('');
    expect(color).toMatchObject(expect.objectContaining({ r: 0, g: 0, b: 0, a: 0 }));
  });
});
