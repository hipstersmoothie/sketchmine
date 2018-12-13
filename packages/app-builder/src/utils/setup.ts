import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { Schema } from '../angular-app-shell/schema';

export function setupOptions(host: Tree, options: Schema): Tree {
  if (!options.name) {
    throw new SchematicsException('Invalid options, "name" is required');
  }
  if (!options.directory) {
    throw new SchematicsException('Invalid options, "directory" is required');
  }

  return host;
}
