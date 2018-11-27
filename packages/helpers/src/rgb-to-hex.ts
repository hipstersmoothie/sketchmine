function toHex(color: number) {
  const hex = color.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * converts rgb to HEX
 * @param r number
 * @param g number
 * @param b number
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
