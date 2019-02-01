import { dirname, relative, basename, join, extname } from 'path';
import { readFileSync }  from 'fs';
import { lookup } from 'mime-types';
import { AWSFile } from '../interfaces';
import { isFile } from '@sketchmine/node-helpers';

export function fileTransformer(file: string): AWSFile | undefined {

  if (!isFile(file)) {
    return;
  }

  return {
    name: join(relative('dist', dirname(file)), basename(file)),
    mimeType: lookup(extname(file)) || '',
    buffer: readFileSync(file),
  };
}
