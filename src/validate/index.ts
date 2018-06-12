import * as path from 'path';
import { Validator } from './Validator';
import { rules } from './config';

const file = path.resolve('tests/fixtures/name-validation.json');

const validator = new Validator(rules);
validator.validate(file);
