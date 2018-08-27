import { zipToBuffer as unzip, Logger } from '@utils';
import { rules } from './config';
import { Validator } from './validator';
import chalk from 'chalk';
import { ErrorHandler } from './error/error-handler';
import { argv } from 'yargs';

const log = new Logger();
const validator = new Validator(rules);
const handler = new ErrorHandler();

if (process.env.DEBUG) {
  process.env.VERBOSE = 'true';
}

if (!argv.file) {
  throw Error(`No File provided as argument! Please run script with --file flag!`);
}

log.info(chalk`\n💎💎💎  Start Validating Sketch File:  💎💎💎\n`);

unzip(argv.file, /pages\/.*?\.json/).then(async (result) => {
  try {
    log.debug(chalk`\n⏱  Parsing and Validating ${result.length.toString()} Pages: \n\n`);
    await result.forEach((file) => {
      const content = file.buffer.toString();
      try {
        const page = JSON.parse(content);

        validator.addFile(page);
      } catch (error) {
        throw Error(error);
      }
    });
  } catch (error) {
    log.error(chalk`{bgRed Error Parsing Files:\n}`);
    log.error(error);
  }

  validator.validate();
  handler.emit();
}).catch((error) => {
  process.exit(1);
  throw error;
});
