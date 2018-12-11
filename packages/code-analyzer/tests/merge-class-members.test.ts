import { mergeClassMembers } from '../src/utils';

describe('[code-analyzer] › utils › merge class members from implements and extends', () => {

  test('Merge an empty values array with a values array that contains properties', () => {
    const original = [{ type: 'property', key: 'color', value: [] }];
    const toBeMerged = [{
      type: 'property',
      key: 'color',
      value: ['"main"', '"accent"', '"warning"', '"error"', '"cta"', undefined],
    }];

    const result = mergeClassMembers(original, toBeMerged);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].value).toHaveLength(6);
    expect(result[0]).toMatchObject({
      type: 'property',
      key: 'color',
      value: expect.arrayContaining(['"main"', '"accent"', '"warning"', '"error"', '"cta"', undefined]),
    });
  });

  test('Merge the same strings with the same strings should return the same thing', () => {
    const values = [{
      type: 'property',
      key: 'color',
      value: ['"main"', '"accent"', '"warning"', '"error"', '"cta"', undefined],
    }];

    const result = mergeClassMembers(values, values);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].value).toHaveLength(6);
    expect(result[0]).toMatchObject({
      type: 'property',
      key: 'color',
      value: expect.arrayContaining(['"main"', '"accent"', '"warning"', '"error"', '"cta"', undefined]),
    });
  });


  test('Merge the two arrays and make one large out of them', () => {
    const original = [{ type: 'property', key: 'color', value: ['"cta"'] }];
    const toBeMerged = [{ type: 'property', key: 'color', value: ['"main"', '"accent"'] }];

    const result = mergeClassMembers(original, toBeMerged);
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
