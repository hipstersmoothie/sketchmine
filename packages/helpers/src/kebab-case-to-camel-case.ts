/**
 * Converts kebab-case-words to camelCase
 * @example kebab-case-words to camelCase
 * @param word word in kebab-case
 */
export function kebabCaseToCamelCase(word: string):string {
  return word.replace(/(\-\w)/g, matches);
}

function matches(matches: string): string {
  return matches[1].toUpperCase();
}
