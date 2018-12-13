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
  forEach,
  noop,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { strings } from '@angular-devkit/core';
import { resolve, join } from 'path';
import { Schema } from './schema';
import { addPkgJsonDependency, NodeDependency } from '../utils/dependencies';
import { setupOptions } from '../utils/setup';
import { modifyModule } from '../utils/module';
import { addDynatraceNpmRc } from '../utils/files';
import { addStyles } from '../utils/add-styles';
import { addExamplesList } from '../utils/add-examples-list';

const OPTIONS = require(resolve('./config.json')) as Schema;
const TREE_ROOT = join('/', '__directory__');
const STYLES_FILE = join(TREE_ROOT, 'src', 'styles.scss');
const DEFAULT_PKG_MANAGER = 'yarn';

export default function (options: Schema): Rule {
  // merge schematics options with options from a config file.
  Object.assign(options, OPTIONS);

  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);
    // define all paths 🚏
    const sourcePath = join(options.directory, 'src');
    const appPath = join(sourcePath, 'app');
    const examplesPath = join(appPath, 'examples');
    const assetsPath = join(sourcePath, 'assets');

    addTasks(options, context);

    const templateSource = apply(url('./files'), [
      options.dependencies ? addDependencies(options.dependencies) : noop(),
      options.styles ? addStylesToTree(options.styles) : noop(),
      template({
        ...strings,
        ...(options as Object),
      }),
    ]);

    // move the examples from @angular/material or @dynatrace/angular-components
    // to the provided destination in the angular application
    const examples = apply(url(resolve(options.examples.dir)), [
      registerExamples(options),
      move(examplesPath), // move the examples to the examples folder
    ]);

    // copy the meta information from the @sketchmine/code-analyzer that was
    // built previously to the assets folder
    const meta = apply(url(options.meta), [move(assetsPath)]);

    return chain([
      mergeWith(templateSource),
      mergeWith(examples),
      mergeWith(meta),
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
function addTasks(options: Schema, context: SchematicContext) {
  if (!options.skipInstall) {
    context.addTask(
      new NodePackageInstallTask({
        workingDirectory: options.directory,
        packageManager: DEFAULT_PKG_MANAGER,
      }),
    );
  }
}

function registerExamples(options: Schema) {
  return (host: Tree) => {

    modifyModule(host, options);

    addExamplesList(host, options);

    // console.log(host.root.visit((p => console.log(p))))

    // console.log(host.visit(f => console.log('file: ', f)))

    // host.visit((filePath: string) => {
    //   if (filePath.endsWith('.ts'))
    // });
    // filter examples by regular expression

    // host.read(join(options.examples.dir, options.examples.entry));
  };
}

/**
 * Add library specific styling to the application
 * @param styles string array of the styles
 */
function addStylesToTree(styles: string[]) {
  return (host: Tree) => {
    // if no styles are provided return.
    if (!styles.length) {
      return host;
    }
    addStyles(host, styles, STYLES_FILE);
  };
}

/**
 * Adds Dependencies to the package.json
 * Used to add library specific dependencies.
 * @param options from schema.d.ts
 */
function addDependencies(dependencies: NodeDependency[]) {
  return (host: Tree) => {
    // if no dependencies are provided early exit
    if (!dependencies.length) {
      return host;
    }

    // if there are dependencies from the Dynatrace npm registry add our own .npmrc file
    // in case they are only available in the Dynatrace network.
    if (dependencies.find(dep => dep.name.includes('@dynatrace'))) {
      addDynatraceNpmRc(host, TREE_ROOT);
    }

    // loop over all dependencies and add them to the json.
    dependencies.forEach((dependency: NodeDependency) => {
      // add dependency to the package.json
      addPkgJsonDependency(
        host,
        dependency,
        join(TREE_ROOT, 'package.json'),
      );
    });
    return host;
  };
}
