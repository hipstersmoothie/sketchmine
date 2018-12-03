import { IOptions, IRuleMetadata, RuleFailure, Rules, RuleWalker } from 'tslint';
import * as ts from 'typescript';
import chalk from 'chalk'

const NODE_NATIVES = ['path', 'fs', 'os', 'buffer', 'crypto', 'util', 'child_process', 'perf_hooks'];
const FAILURE_UTILS = chalk`
The {blue import ... from '@sketchmine/node-helpers'} uses node natives, like fs.
Please use the @sketchmine/helpers which are platform independent!`;

const FAILURE_NODE_NATIVES = (m: string) => chalk`
The use of importing node natives like {blue ${m}} is forbidden in the validation,
in case it has to work cross platform.
{yellow This rules are going to be used in a 💎 .sketch plugin as well!}
Provide all necessary data with the options in the config and gather them in the run file first.`;

class ValidationNoNodeNativesRuleWalker extends RuleWalker {

  constructor(sourceFile: ts.SourceFile, options: IOptions) {
    super(sourceFile, options);
  }

  visitImportDeclaration(node: ts.ImportDeclaration) {
    const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
    if (
      moduleSpecifier.match(/\@sketchmine\/node-helpers$/gm) ||
      moduleSpecifier.match(/\@sketchmine\/sketch-file-builder$/gm)
    ) {
      this.addFailureAt(node.getStart(), node.getWidth(), `${FAILURE_UTILS}\n${node.getText()}`);
    }
    if (NODE_NATIVES.includes(moduleSpecifier)) {
      this.addFailureAt(
        node.getStart(),
        node.getWidth(),
        `${FAILURE_NODE_NATIVES(moduleSpecifier)}\n${node.getText()}`,
      );
    }
    super.visitImportDeclaration(node);
  }
}

/**
 * Implementation of the validation-no-node-native rule.
 */
export class Rule extends Rules.AbstractRule {

  static metadata: IRuleMetadata = {
    // tslint:disable-next-line:max-line-length
    description: 'The validation has to work cross plattform, so the only file that is allowed to use node natives like fs is the run file.',
    options: null,
    optionsDescription: '',
    ruleName: 'validation-no-node-natives',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: ts.SourceFile): RuleFailure[] {
    if (!sourceFile.fileName.endsWith('.test.ts')) {
      return this.applyWithWalker(new ValidationNoNodeNativesRuleWalker(sourceFile, this.getOptions()));
    }
    return [];
  }
}
