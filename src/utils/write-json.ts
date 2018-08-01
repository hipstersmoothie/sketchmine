import * as fs from 'fs';
import chalk from 'chalk';

/**
 * Safely writes Object or string as JSON file
 *
 * @param {string} filename
 * @param {Object | string} content
 * @returns {Promise<any>}
 */
export function writeJSON(filename: string, content: Object | string): Promise<any> {
  return new Promise((resolve, reject) => {
    const _content = (typeof content === 'string') ? content : JSON.stringify(content).replace(/\//g, '\\/');

    fs.writeFile(`${filename}.json`, _content, 'utf8', (error: NodeJS.ErrnoException) => {
      if (error) {
        reject(Error(chalk(`{red Error writing Object to ${filename}.json}\n${error.message}`)));
      }
      if (process.env.DEBUG === 'true') {
        console.log(chalk`\tSuccessfully written Object to {grey ${filename}.json}`);
      }
      resolve();
    });
  });
}
