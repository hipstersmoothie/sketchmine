import * as path from 'path';
import * as fs from 'fs';
import { delDir } from '../utils/del-folder';
import { createDir } from '../utils/create-dir';
import chalk from 'chalk';
import { exec } from 'child_process';
import { ls } from '../utils/list-dir';

import { zipToBuffer as unzip } from '../utils/zip-to-buffer';
import { rules } from './config';
import { Validator } from './Validator';

const allComponents = path.resolve('tests/fixtures/01_all_components_library.sketch');
const url = path.resolve('tests/fixtures/name-validation-test.sketch');

const validator = new Validator(rules);

unzip(url, /pages\/.*?\.json/).then(async (result) => {
  await result.forEach((file) => {
    const page = JSON.parse(file.toString());
    validator.addFile(page);
  });

  validator.validate();
});
