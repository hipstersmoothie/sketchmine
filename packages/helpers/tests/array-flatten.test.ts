import { arrayFlatten } from '../src/array-flatten';

describe('[utils] › array-flatten', () => {

  test('Flatten two dimensional array with depth 1', () => {
    const arr = [['a', 'b'], 'c'];
    const flattened = arrayFlatten(arr);
    expect(flattened).toBeInstanceOf(Array);
    expect(flattened).toHaveLength(3);
    expect(flattened).toContain('a');
    expect(flattened).toContain('b');
    expect(flattened).toContain('c');
  });

  test('flat array to be returned as the same', () => {
    const arr = ['a', 'b', 'c'];
    const flattened = arrayFlatten(arr);
    expect(flattened).toEqual(arr);
  });

  test('Flatten array with depth 3', () => {
    const arr = [[['a'], 'b'], ['c']];
    const flattened = arrayFlatten(arr);
    expect(flattened).toBeInstanceOf(Array);
    expect(flattened).toHaveLength(3);
    expect(flattened).toContain('a');
    expect(flattened).toContain('b');
    expect(flattened).toContain('c');
  });

  test('Flatten array with depth 7', () => {
    const arr = [[['a', [[[['b']]]]], 'c'], ['d']];
    const flattened = arrayFlatten(arr);
    expect(flattened).toBeInstanceOf(Array);
    expect(flattened).toHaveLength(4);
    expect(flattened).toContain('a');
    expect(flattened).toContain('b');
    expect(flattened).toContain('c');
    expect(flattened).toContain('d');
  });
});
