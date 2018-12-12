import { Path } from '@angular-devkit/core';
import { NodeDependency }from '../utils/dependencies';

export interface BaseSchema {
  project: string;
  path: Path;
  name: string;
  flat?: boolean;
  spec?: boolean;
}


export interface Schema extends BaseSchema {
  directory: string;
  examples: Examples;
  dependencies: NodeDependency[];
  styles: string[]; // Framework specific styles (use for import of framework styles)
}

export interface Examples {
  dir: string;
}
