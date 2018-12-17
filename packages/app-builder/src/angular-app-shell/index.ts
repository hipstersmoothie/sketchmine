import {
  Tree,
  SchematicContext,
  mergeWith,
  apply,
  url,
  template,
  chain,
  move,
  Rule,
  noop,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { strings } from '@angular-devkit/core';
import { resolve, join } from 'path';
import { Schema, Config } from './schema';
import { setupOptions } from '../utils/setup';
import { addExamplesListToModule, addDependencies, addStylesToTree } from './rules';

const TREE_ROOT = join('/', '__directory__');
const STYLES_FILE = join(TREE_ROOT, 'src', 'styles.scss');
const DEFAULT_PKG_MANAGER = 'yarn';

export default function (configOptions: Config): Rule {
  // merge schematics options with options from a config file.
  // --config has to be provided with the schema
  const options = require(resolve(configOptions.config)) as Schema;

  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);
    // define all paths 🚏
    const sourcePath = join(options.directory, 'src');
    const appPath = join(sourcePath, 'app');
    const examplesPath = join(appPath, 'examples');
    const appBuilderModule = join(appPath, 'app-builder.module.ts');

    addTasks(options, context);

    const templateSource = apply(url('./files'), [
      options.dependencies ? addDependencies(options.dependencies, TREE_ROOT) : noop(),
      options.styles ? addStylesToTree(options.styles, STYLES_FILE) : noop(),
      template({
        ...strings,
        ...(options as Object),
      }),
    ]);

    // move the examples from @angular/material or @dynatrace/angular-components
    // to the provided destination in the angular application
    const examples = apply(url(resolve(options.examples.dir)), [
      move(examplesPath), // move the examples to the examples folder
    ]);

    return chain([
      mergeWith(templateSource),
      mergeWith(examples),
      addExamplesListToModule(options, examplesPath, appBuilderModule),
    ])(
      host,
      context,
    );
  };
}

/**
 * Appends and execute tasks to the schematics.
 * @param options the schema options
 * @param context the schematics context
 */
function addTasks(options: Schema, context: SchematicContext): void {
  if (!options.skipInstall) {
    context.addTask(
      new NodePackageInstallTask({
        workingDirectory: options.directory,
        packageManager: DEFAULT_PKG_MANAGER,
      }),
    );
  }
}
