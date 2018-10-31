import { zipToBuffer as unzip, Logger, readFile } from '@utils';
import { rules } from './config';
import { resolve, join } from 'path';
import { lstatSync } from 'fs';
import { Validator } from './validator';
import chalk from 'chalk';
import { ErrorHandler } from './error/error-handler';
import minimist from 'minimist';
import { filenameValidation } from './rules/file-name-validation';

const log = new Logger();
const env = process.env.ENVIRONMENT || 'global';

const COLORS_FILE = resolve('_tmp/src/lib/core/style/_colors.scss');
const DEFAULT_TEST_FILE = join(process.cwd(), 'tests', 'fixtures', 'name-validation-test.sketch');

export async function main(args: string[]) {
  if (!lstatSync(COLORS_FILE).isFile()) {
    log.error(
      chalk`Please use the {bgBlue  [sh src/validate/prepare.sh] } ` +
      chalk`script to get the {grey _colors.scs}s file `);
    throw new Error(`${COLORS_FILE} file not found!`);
  }
  const file = minimist(args).file || DEFAULT_TEST_FILE;
  rules.find(rule => rule.name === 'color-palette-validation').options.colors = await readFile(COLORS_FILE);
  const validator = new Validator(rules, env);
  const handler = new ErrorHandler();

  log.notice(chalk`💎💎💎  Start Validating Sketch File:  💎💎💎\n`);
  log.notice(`Validate file: ${file}`);

  /** Validate the file name for product environment only. */
  if (env === 'product') {
    filenameValidation(file);
  }

  /** Unzip all the pages and the document.json file for the validation. */
  return unzip(file, /(document.json|pages\/.*?\.json)/).then(async (result) => {
    log.debug(chalk`\n⏱  Parsing and validating ${result.length.toString()} pages: \n\n`);
    await result.forEach((file) => {
      const content = file.buffer.toString();
      const page = JSON.parse(content);
      if (file.path === 'document.json') {
        validator.addDocumentFile(page);
      } else {
        validator.addFile(page);
      }
    });
    validator.validate();
    handler.emit();
    return 0;
  });
}

/** Call the main function with command line args. */
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
