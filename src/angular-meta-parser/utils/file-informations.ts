import path from 'path';
import { acmp } from '../typings/angular-component';

export function fileInformations(filename: string): acmp.FileInformation {
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);
  const dir = path.dirname(filename);

  return {
    path: dir,
    basename,
    extension: ext,
    fullpath: filename,
  };
}
