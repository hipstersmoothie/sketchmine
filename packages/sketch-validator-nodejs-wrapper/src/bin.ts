import { rules, IValidationRule } from '@sketchmine/sketch-validator';
import { main } from './main';
import { displayHelp } from './help';
import { resolve } from 'path';
import { existsSync } from 'fs';

const DEFAULT_LINT_FILE = resolve('sketchlint.json');
const DEFAULT_TEST_FILE = resolve('tests', 'fixtures', 'name-validation-test.sketch');

let environment = process.env.ENVIRONMENT || 'global';

function configureRules(config: string): IValidationRule[] {
  const rulesConfig = require(config);
  const matched: IValidationRule[] = [];

  for (const ruleName in rulesConfig.rules) {
    if (rulesConfig.rules.hasOwnProperty(ruleName)) {
      const rule = rulesConfig.rules[ruleName];
      const r = rules.find(_r => _r.name === ruleName);

      if (!rule || !r) { continue; }
      if (typeof rule === 'object') {
        r.warning = rule.hasOwnProperty('warning') && rule.warning;
      }
      matched.push(r);
    }
  }

  return matched;
}

export async function commandLineExecutor(): Promise<number> {
  const args = require('minimist')(process.argv.slice(2));

  if (args.help || args.h) {
    displayHelp();
    return 0;
  }

  if (args.environment || args.e) {
    environment = args.environment || args.e;
  }

  const configFile = args.config || args.c ? args.config || args.c : DEFAULT_LINT_FILE;
  const config = existsSync(configFile) ? configureRules(configFile) : rules;

  return await main(args.file || DEFAULT_TEST_FILE, config, environment);
}

commandLineExecutor().catch((err) => {
  console.error(err.message);
  process.exit(1);
})
.then((code: number) => {
  console.log('\n\n🦄\tThe validation passed successfully 🎉');
  process.exit(code);
});
