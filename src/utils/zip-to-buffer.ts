import { CentralDirectory, Open as unzip } from 'unzipper';
import chalk from 'chalk';

export interface fileBuffer {
  path: string;
  buffer: Buffer;
}

/**
 * Get a Promised Array of File buffers from zip,
 * you can filter only certain files from zip.
 * @param pathToZip string
 * @param filter? RegExp – Use a regex to match only certain files in zip /pages\/.*?\.json/
 * @returns Promise<Buffer[]>
 */
export async function zipToBuffer(pathToZip: string, filter?: RegExp): Promise<fileBuffer[]> {
  try {
    const zip: CentralDirectory = await unzip.file(pathToZip);
    let files = zip.files;
    if (filter) {
      files = await files.filter(file => file.path.match(filter)) as any;
    }
    const promises = files.map(async (file) => {
      const buffer = await file.buffer();
      return {
        path: file.path,
        buffer,
      } as fileBuffer;
    });
    return Promise.all(promises);
  } catch (error) {
    console.log(chalk`{bgRed Error unzipping File:\n}{grey ${pathToZip}}`);
    throw Error(error);
  }
}

export default zipToBuffer;
