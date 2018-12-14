import { Tree } from '@angular-devkit/schematics';
import { join } from 'path';

const NPMRC_FILE = '.npmrc';

export function addFile(tree: Tree, filePath: string, content: Buffer | string) {
  tree.create(filePath, content);
}

export function addDynatraceNpmRc(tree: Tree, path: string) {
  const url = 'http://artifactory.lab.dynatrace.org/artifactory/api/npm/';
  let content = `registry=${url}registry-npmjs-org/\n`;
  content += `@dynatrace:registry=${url}npm-dynatrace-release-local/`;

  addFile(tree, join(path, NPMRC_FILE), content);
}
