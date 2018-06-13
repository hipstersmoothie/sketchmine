import * as path from 'path';
import { zipToBuffer as unzip } from '../utils/zip-to-buffer';
import { rules } from './config';
import { Validator } from './Validator';
import chalk from 'chalk';
import { ErrorHandler } from './error/ErrorHandler';

const allComponents = path.resolve('tests/fixtures/01_all_components_library.sketch');
const url = path.resolve('tests/fixtures/name-validation-test.sketch');

const validator = new Validator(rules);

unzip(allComponents, /pages\/.*?\.json/).then(async (result) => {
  try {
    console.log(chalk`\n⏱  Parsing and Validating ${result.length.toString()} Pages: \n\n`);
    await result.forEach((file) => {
      const content = file.toString();
      try {
        const page = JSON.parse(content);

        validator.addFile(page);
      } catch (error) {
        console.log(content);
        console.log(content.substring(2181820, 2182000));
        throw Error(error);
      }
    });
  } catch (error) {
    console.log(chalk`{bgRed Error Parsing Files:\n}`);
    console.log(error);
  }

  validator.validate();
  ErrorHandler.emit();
});
