import { CentralDirectory, Open as unzip } from 'unzipper';
import chalk from 'chalk';

/**
 * Get a Promised Array of File buffers from zip,
 * you can filter only certain files from zip.
 * @param pathToZip string
 * @param filter? RegExp – Use a regex to match only certain files in zip /pages\/.*?\.json/
 * @returns Promise<Buffer[]>
 */
export async function zipToBuffer(pathToZip: string, filter?: RegExp): Promise<Buffer[]> {
  try {
    const zip: CentralDirectory = await unzip.file(pathToZip);
    let files = zip.files;
    if (filter) {
      files = await files.filter(file => file.path.match(filter)) as any;
    }
    return Promise.all(files.map(async file => await file.buffer()));
  } catch (error) {
    console.log(chalk`{bgRed Error unzipping File:\n}{grey ${pathToZip}}`);
    throw Error(error);
  }
}

export default zipToBuffer;
