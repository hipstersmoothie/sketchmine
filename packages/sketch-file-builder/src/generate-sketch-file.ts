import { createDir, FileBuffer, Logger, bytesToSize } from '@sketchmine/node-helpers';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

const archiver = require('archiver');
const log = new Logger();

/**
 * Generate a .sketch file from a local folder or an array of fileBuffers
 * @param outDir string
 * @param fileName string – without .sketch
 * @param content Buffer[] | string
 * @returns Promise<void | Error> to check when the sketch file was generated.
 */
export function generateSketchFile(
  outDir: string,
  fileName: string,
  content: FileBuffer[] | string,
): Promise<void | Error> {
  return new Promise((resolve, reject) => {
    createDir(outDir);
    const file = path.resolve(outDir, `${fileName}.sketch`);
    const output = fs.createWriteStream(file);
    const archive = archiver('zip');

    log.debug(chalk`Created Write Stream for {grey ${file}}`);

    output.on('close',  () => {
      log.notice(
        chalk`\n✅ \t{greenBright Sketch file}: {magenta ${fileName}.sketch} – ` +
        chalk`was successfully generated with: {cyan ${bytesToSize(archive.pointer())}}\n` +
        chalk`\tIn the folder: {grey ${path.resolve(outDir)}/}\n\n`,
      );
      resolve();
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        log.debug('Sketch-File could not be written: ENOENT', err);
      } else {
        reject(err);
      }
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    if (content instanceof  Array) {
      content.forEach((file: FileBuffer) => {
        archive.append(file.buffer, { name: file.path });
      });
    } else {
      archive.directory(content, false);
    }

    archive.finalize();
  });
}
