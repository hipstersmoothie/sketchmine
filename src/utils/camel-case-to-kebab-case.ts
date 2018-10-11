/**
 * Converts CamelCase to kebab-case
 * @example FoBarBaz to fo-bar-baz
 * @param word word in Camel Case
 */
export function camelCaseToKebabCase(word: string): string {

  if (!word || word && typeof word !== 'string') { return ''; }

  const kebab = word
    .replace(/(-[A-Z])/g, replaceMinusUpper)
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase();

  return kebab.startsWith('-') ? kebab.substring(1) : kebab;
}

function replaceMinusUpper(...matches: string[]) {
  return `${matches[1]}`.toLowerCase();
}
