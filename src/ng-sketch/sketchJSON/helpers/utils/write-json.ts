import * as fs from 'fs';

/**
 * Safely writes Object or string as JSON file
 *
 * @param filename string
 * @param content Object | string
 */
export function writeJSON(filename: string, content: Object | string) {
  const _content = (typeof content === 'string') ? content : JSON.stringify(content);
  fs.writeFile(`${filename}.json`, _content, 'utf8', () => {});
}
