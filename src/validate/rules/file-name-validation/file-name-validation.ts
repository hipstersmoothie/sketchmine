import { ErrorHandler } from '../../error/error-handler';
import { FileNameError } from '../../error/validation-error';
import { dirname, basename } from 'path';

const handler = new ErrorHandler();

export function filenameValidation(
  file: string,
) {

  const filepath = dirname(file).split('/');
  const foldername = filepath[filepath.length - 1];
  const filename = basename(file);
  const projectName = filename.split('-')[0];

  const rule = {
    selector: undefined,
    validation: undefined,
    name: 'file-name-validation',
    description: `Validate if the filename matches this pattern [folder]-[feature].sketch` +
    ``,
  };

  if (foldername !== projectName) {
    handler.addError(
      rule,
      new FileNameError({
        objectId: filename,
        name: foldername,
        message: `File name ${filename} is invalid, it needs to contain the folder name.`,
      }),
    );
  } else if (!filename.match('^[a-zA-Z\d-]*.sketch')) {
    handler.addError(
      rule,
      new FileNameError({
        objectId: filename,
        name: projectName,
        message: `File name ${filename} is invalid, it should only contain [a-z, A-Z, 0-9, -].`,
      }),
    );

  } else {
    handler.addSuccess(rule);
  }
}
