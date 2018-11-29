import { bytesToSize, cssToRGBA } from '../src/helpers';

describe('[sketch-generator] › convert bytes to SI sizes', () => {
  test('0bytes to equal 0 Byte', () => {
    expect(bytesToSize(0)).toEqual('0 Byte');
  });

  test('100bytes to equal 100 Bytes', () => {
    expect(bytesToSize(100)).toEqual('100 Bytes');
  });

  test('10024bytes to equal 1 KB', () => {
    expect(bytesToSize(1000)).toEqual('1000 Bytes');
    expect(bytesToSize(1024)).toEqual('1 KB');
  });

  test('1000000bytes to equal 977 KB', () => {
    expect(bytesToSize(1000000)).toEqual('977 KB');
  });

  test('1048576 bytes to equal 1 MB', () => {
    expect(bytesToSize(1048576)).toEqual('1 MB');
  });
});

describe('[sketch-generator] › convert css colors to RGBA', () => {

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
