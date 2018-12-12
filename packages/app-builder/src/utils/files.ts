import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { join } from 'path';

export function addFile(tree: Tree, filename: string, content: Buffer | string) {
  tree.create(filename, content);
}

export function addDynatraceNpmRc(tree: Tree, path: string) {
  const url = 'http://artifactory.lab.dynatrace.org/artifactory/api/npm/';
  let content = `registry=${url}registry-npmjs-org/\n`;
  content += `@dynatrace:registry=${url}npm-dynatrace-release-local/`;

  addFile(tree, join(path, '.npmrc'), content);
}

export function addDynatraceStyles(tree: Tree) {
  const styleImport = `@import '~@dynatrace/angular-components/style/index';`
  const path = '/__directory__/src/styles.scss';

  const buffer = tree.read(path);
  if (buffer === null) {
    throw new SchematicsException(`Cound not read file: ${path}`);
  }
  const content = buffer.toString();
  const lines = content.split('\n');
  const updatedIndex = [
    styleImport,
    ...lines,
  ];
  tree.overwrite(path, updatedIndex.join('\n'));
  return tree;
}
