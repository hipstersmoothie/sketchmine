import { camelCaseToKebabCase } from './camel-case-to-kebab-case';

describe('[util] › camel case to kebab case', () => {

  test('Camel case to kebab case', () => {
    expect(camelCaseToKebabCase('DtButton')).toMatch('dt-button');
  });

  test('Camel case to kebab case', () => {
    expect(camelCaseToKebabCase('dtButton')).toMatch('dt-button');
  });

  test('if word is in kebab don\'t modify it', () => {
    expect(camelCaseToKebabCase('dt-button')).toMatch('dt-button');
  });

  test('word with double minus', () => {
    expect(camelCaseToKebabCase('Dt--Button')).toMatch('dt--button');
  });

  test('All uppercase', () => {
    expect(camelCaseToKebabCase('BUTTON')).toMatch('b-u-t-t-o-n');
  });

  test('long camel case', () => {
    expect(camelCaseToKebabCase('OneLongVeryLongWord-ThatMatches-Kebab'))
      .toMatch('one-long-very-long-word-that-matches-kebab');
  });

  test('if nothing is passed return empty string', () => {
    const result = camelCaseToKebabCase('');
    expect(result).toMatch('');
    expect(result).toHaveLength(0);
  });

  test('if undefined is passed return empty string', () => {
    const result = camelCaseToKebabCase(undefined);
    expect(result).toMatch('');
    expect(result).toHaveLength(0);
  });
});
