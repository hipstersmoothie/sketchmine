import { Property, mergeClassMembers } from '../src';

describe('[code-analyzer] › utils › merge class members from implements and extends', () => {

  test('providing an empty array should return an empty array', () => {
    const result = mergeClassMembers([]);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });

  test('providing an array with undefined should return an empty array', () => {
    const result = mergeClassMembers([undefined]);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });

  test('providing multiple arrays with undefined and null should return an empty array', () => {
    const result = mergeClassMembers([undefined], [], [null], undefined);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });

  test('providing an array and a property should return array with property', () => {
    const property = { type: 'property', key: 'color', value: 'true' };
    const result = mergeClassMembers([undefined], property) as Property[];
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result).toMatchObject([property]);
  });

  test('merging an empty values array with a values array that contains properties', () => {
    const original = [{ type: 'property', key: 'color', value: [] }];
    const toBeMerged = [{
      type: 'property',
      key: 'color',
      value: ['"main"', '"accent"', '"warning"', '"error"', '"cta"', undefined],
    }];

    const result = mergeClassMembers(original, toBeMerged) as Property[];
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].value).toHaveLength(5);
    expect(result[0]).toMatchObject({
      type: 'property',
      key: 'color',
      value: expect.arrayContaining(['"main"', '"accent"', '"warning"', '"error"', '"cta"']),
    });
  });

  test('merging the same strings with the same strings should return the same thing', () => {
    const values = [{
      type: 'property',
      key: 'color',
      value: ['"main"', '"accent"', '"warning"', '"error"', '"cta"'],
    }];

    const result = mergeClassMembers(values, values) as Property[];
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].value).toHaveLength(5);
    expect(result[0]).toMatchObject({
      type: 'property',
      key: 'color',
      value: expect.arrayContaining(['"main"', '"accent"', '"warning"', '"error"', '"cta"']),
    });
  });

  test('merging the two arrays should create one combined', () => {
    const original = [{ type: 'property', key: 'color', value: ['"cta"'] }];
    const toBeMerged = [{ type: 'property', key: 'color', value: ['"main"', '"accent"'] }];

    const result = mergeClassMembers(original, toBeMerged) as Property[];
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].value).toHaveLength(3);
    expect(result[0]).toMatchObject({
      type: 'property',
      key: 'color',
      value: expect.arrayContaining(['"main"', '"accent"', '"cta"']),
    });
  });

  test('merging the two arrays should create one combined with with unique values', () => {
    const original = [{ type: 'property', key: 'color', value: ['"cta"', '"main"'] }];
    const toBeMerged = [{ type: 'property', key: 'color', value: ['"main"', '"accent"'] }];

    const result = mergeClassMembers(original, toBeMerged) as Property[];
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].value).toHaveLength(3);
    expect(result[0]).toMatchObject({
      type: 'property',
      key: 'color',
      value: expect.arrayContaining(['"main"', '"accent"', '"cta"']),
    });
  });
});
