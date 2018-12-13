import { Path } from '@angular-devkit/core';
import { NodeDependency }from '../utils/dependencies';

export interface BaseSchema {
  name: string;
  path?: Path;
  project?: string;
}

export interface Schema extends BaseSchema {
  dependencies?: NodeDependency[];
  directory: string;
  examples: Examples;
  meta: string;
  skipInstall?: boolean; // skips the install in the application if provided
  styles?: string[]; // Framework specific styles (use for import of framework styles)
}

export interface Examples {
  dir: string;
  entry: string;
  list: { [key: string]: string } // Examples Mapping which example component is for which library component
}
