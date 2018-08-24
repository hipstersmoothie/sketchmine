import { existsSync, lstatSync } from 'fs';

/**
 * Check if the string is a file
 * @param {string} fileName path to file
 * @returns {boolean}
 */
export function isFile(fileName: string): boolean {
  return existsSync(fileName) && lstatSync(fileName).isFile();
}
