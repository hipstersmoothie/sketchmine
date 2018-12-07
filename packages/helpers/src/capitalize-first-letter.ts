/**
 * Capitalizes the first letter of a word.
 * @param word word where first letter has to be capitalized
 */
export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
