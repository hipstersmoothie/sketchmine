import { zipToBuffer as unzip, Logger } from '@utils';
import { rules } from './config';
import { Validator } from './validator';
import chalk from 'chalk';
import { ErrorHandler } from './error/error-handler';
import { argv } from 'yargs';
import * as path from 'path';

const log = new Logger();
const validator = new Validator(rules);
const handler = new ErrorHandler();

const DEFAULT_TEST_FILE = path.join(process.cwd(), 'tests', 'fixtures', 'name-validation-test.sketch');

export async function main(file: string) {

  log.notice(chalk`💎💎💎  Start Validating Sketch File:  💎💎💎\n`);
  log.notice(`validate file: ${file}`);

  /** unzip only the pages for the validation */
  return unzip(file, /pages\/.*?\.json/).then(async (result) => {
    log.debug(chalk`\n⏱  Parsing and Validating ${result.length.toString()} Pages: \n\n`);
    await result.forEach((file) => {
      const content = file.buffer.toString();
      const page = JSON.parse(content);

      validator.addFile(page);
    });

    validator.validate();
    handler.emit();
    return Promise.resolve(0);
  });
}

/** Call the main function with command line args */
if (require.main === module) {
  const file = argv.file || DEFAULT_TEST_FILE;
  main(file).catch((err) => {
    log.error(err as any);
    process.exit(1);
  })
  .then((code: number) => {
    process.exit(code);
  });
}
