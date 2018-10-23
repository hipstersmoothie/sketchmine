/**
 * This function generates a list of all possible colors from the angular-components library
 * _colors.scss file.
 * Add the static Dynatrace logo colors in case they are not present in the angular-components
 * @example https://regex101.com/r/nuKQ0X/2
 * @param logoColors String array of hex values from the logo colos.
 * @param allColors the file content of the _colors.scss file
 */
export function generateMasterColors(logoColors: string[], allColors: string): string[] {
  const colors: string[] = logoColors;
  const regex = /\$(\w+?)\-(\d+?)\:\s*?(#[0-9a-f]+|rgba?\([0-9\s\,]+?\))/gm;

  /** @example https://regex101.com/r/xVkRwW/1 */
  const threeDigitsHex = /#([a-fA-F0-9]{3})$/;

  let match = regex.exec(allColors);
  while (match !== null) {
    /** regex converts 3digits hex to 6 digits hex */
    const c = match[3].toUpperCase().replace(threeDigitsHex, '#$1$1');
    colors.push(c);
    match = regex.exec(allColors);
  }
  return colors;
}
