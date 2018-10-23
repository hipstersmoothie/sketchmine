import { IOptions, IRuleMetadata, RuleFailure, Rules, RuleWalker } from 'tslint';
import chalk from 'chalk';
import * as ts from 'typescript';

const NODE_NATIVES = ['path', 'fs', 'os', 'buffer', 'crypto', 'util', 'child_process', 'perf_hooks'];
const FAILURE_UTILS = chalk`
The {blue import ... from '@utils'} is a barrel file which exports node natives,
like fs. Specify the import to a file where no node natives are used!`;

const FAILURE_NODE_NATIVES = (m: string) => chalk`
The use of importing node natives like {blue ${m}} is forbidden in the validation except in the {grey run.ts} file,
in case it has to work cross plattform.
{yellow This rules are going to be used in a 💎 .sketch plugin as well!}
Provide all necessary data with the options in thre config and gather them in the run file first.`;

/** @see https://regex101.com/r/VvI102/1 */
const FILES_REGEX = new RegExp(/\/src\/validate\/(?!(?:index|interfaces|run)).+/gm);
// const FORBIDDEN =

class ValidationNoNodeNativesRuleWalker extends RuleWalker {

  constructor(sourceFile: ts.SourceFile, options: IOptions) {
    super(sourceFile, options);
  }

  visitImportDeclaration(node: ts.ImportDeclaration) {
    const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
    if (moduleSpecifier.match(/\@utils$/gm)) {
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
    if (sourceFile.fileName.match(FILES_REGEX)) {
      return this.applyWithWalker(new ValidationNoNodeNativesRuleWalker(sourceFile, this.getOptions()));
    }
    return [];
  }
}
