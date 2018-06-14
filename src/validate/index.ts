import * as path from 'path';
import { zipToBuffer as unzip } from '../utils/zip-to-buffer';
import { rules } from './config';
import { Validator } from './validator';
import chalk from 'chalk';
import { ErrorHandler } from './error/error-handler';

const allComponents = path.resolve('tests/fixtures/01_all_components_library.sketch');
const url = path.resolve('tests/fixtures/name-validation-test.sketch');
const allFine = path.resolve('tests/fixtures/all-fine-validation.sketch');

const validator = new Validator(rules);
const handler = new ErrorHandler();

if (process.env.DEBUG) {
  process.env.VERBOSE = 'true';
}

console.log(chalk`\n💎💎💎  Start Validating Sketch File:  💎💎💎\n`);

unzip(url, /pages\/.*?\.json/).then(async (result) => {
  try {
    if (process.env.VERBOSE) {
      console.log(chalk`\n⏱  Parsing and Validating ${result.length.toString()} Pages: \n\n`);
    }
    await result.forEach((file) => {
      const content = file.toString();
      try {
        const page = JSON.parse(content);

        validator.addFile(page);
      } catch (error) {
        throw Error(error);
      }
    });
  } catch (error) {
    if (process.env.DEBUG) {
      console.log(chalk`{bgRed Error Parsing Files:\n}`);
      console.log(error);
    }
  }

  validator.validate();
  handler.emit();
}).catch((error) => {
  throw error;
});
