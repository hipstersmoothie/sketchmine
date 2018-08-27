/**
 * Converts CamelCase to kebab-case
 * @example FoBarBaz to fo-bar-baz
 * @param word word in Camel Case
 */
export function camelCaseToKebabCase(word: string) {
  return word.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);
}
