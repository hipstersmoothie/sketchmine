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
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { resolve, join } from 'path';
import { Schema } from './schema';
import { addPkgJsonDependency, NodeDependency } from '../utils/dependencies';
import { setupOptions } from '../utils/setup';
import { addDynatraceNpmRc, addDynatraceStyles } from '../utils/files';

const OPTIONS = require(resolve('./config.json')) as Schema;

export default function (options: Schema): Rule {
  // merge schematics options with options from a config file.
  Object.assign(options, OPTIONS);

  return (host: Tree, context: SchematicContext) => {
    setupOptions(host, options);
    // const workspace = getWorkspace(host);
    // const project = workspace.projects[options.project];
    // const rootPath = project.root as Path;
    // const sourcePath = join(project.root as Path, 'src');
    // const appPath = join(sourcePath as Path, 'app');

    addTasks(options, context);

    console.log(options);

    const templateSource = apply(url('./files'), [
      addDependencies(OPTIONS.dependencies),
      template({
        ...strings,
        ...OPTIONS,
        ...(options as Object),
      }),
    ]);

    // const examples = apply(url(resolve(OPTIONS.examples.dir)), [
    //   registerExamples(),
    //   move(join(OPTIONS.directory, 'src', 'app', 'examples')),
    // ]);

    return chain([
      mergeWith(templateSource),
      // mergeWith(examples),
    ])(
      host,
      context,
    );
  };
}

function addTasks(options: any, context: SchematicContext) {
  if (!options.skipInstall) {
    // TODO: @lukasholzer
    // context.addTask(
    //  new NodePageInstallTask(options.directory)
    // );
  }
}

function registerExamples() {
  return (host: Tree) => {
    // console.log(host);
  };
}

/**
 * Adds Node
 * @param options from schema.d.ts
 */
function addDependencies(dependencies: NodeDependency[]) {
  return (host: Tree) => {
    // if no dependencies are provided early exit
    if (!dependencies) {
      return host;
    }

    if (dependencies.find(dep => dep.name.includes('@dynatrace'))) {
      addDynatraceNpmRc(host, '/__directory__');
    }
    if (dependencies.find(dep => dep.name.includes('@dynatrace/angular-components'))) {
      addDynatraceStyles(host);
    }

    // loop over all dependencies and add them to the json.
    OPTIONS.dependencies.forEach((dependency: NodeDependency) => {

      addPkgJsonDependency(
        host,
        dependency,
        join('/', '__directory__', 'package.json'),
      );
    });

    return host;
  };
}
