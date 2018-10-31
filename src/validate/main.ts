import { lstatSync } from 'fs';
import { resolve, join } from 'path';
import { Validator } from './validator';
import chalk from 'chalk';
import { zipToBuffer as unzip, Logger, readFile } from '@utils';
import { ErrorHandler } from './error/error-handler';
import { filenameValidation } from './rules/file-name-validation';
import { IValidationRule } from './interfaces/validation-rule.interface';

const log = new Logger();

const COLORS_FILE = resolve('_tmp/src/lib/core/style/_colors.scss');

export async function main(file: string, rules: IValidationRule[], environment: string): Promise<number> {
  const colorValidationRule = rules.find(rule => rule.name === 'color-palette-validation');

  if (colorValidationRule) {
    if (!lstatSync(COLORS_FILE).isFile()) {
      log.error(
        chalk`Please use the {bgBlue  [sh src/validate/prepare.sh] } ` +
        chalk`script to get the {grey _colors.scs}s file `);
      throw new Error(`${COLORS_FILE} file not found!`);
    }
    colorValidationRule.options.colors = await readFile(COLORS_FILE);
  }

  const validator = new Validator(rules, environment);
  const handler = new ErrorHandler();

  log.notice(chalk`💎💎💎  Start Validating Sketch File:  💎💎💎\n`);
  log.notice(`Validate file: ${file}`);

  /** Validate the file name for product environment only. */
  if (environment === 'product') {
    filenameValidation(file);
  }

  /** Unzip all the pages and the document.json file for the validation. */
  return unzip(file, /(document\.json|pages\/.*?\.json)/).then(async (result) => {
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
