import { bytesToSize } from '../src/bytes-to-size';

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
