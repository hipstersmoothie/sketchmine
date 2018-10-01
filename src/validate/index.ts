import { zipToBuffer as unzip, Logger } from '@utils';
import { rules } from './config';
import { Validator } from './validator';
import chalk from 'chalk';
import { ErrorHandler } from './error/error-handler';
import minimist from 'minimist';
import { join } from 'path';
import { filenameValidation } from './rules/file-name-validation';

const env = process.env.ENVIRONMENT || 'global';
const log = new Logger();
const validator = new Validator(rules, env);
const handler = new ErrorHandler();

const DEFAULT_TEST_FILE = join(process.cwd(), 'tests', 'fixtures', 'name-validation-test.sketch');

export async function main(args: string[]) {
  const file = minimist(args).file || DEFAULT_TEST_FILE;

  log.notice(chalk`💎💎💎  Start Validating Sketch File:  💎💎💎\n`);
  log.notice(`validate file: ${file}`);

  // validate the file name
  filenameValidation(file);

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
    return 0;
  });
}

/** Call the main function with command line args */
if (require.main === module) {
  const args = process.argv.slice(2);
  main(args).catch((err) => {
    log.error(err as any);
    process.exit(1);
  })
  .then((code: number) => {
    process.exit(code);
  });
}
