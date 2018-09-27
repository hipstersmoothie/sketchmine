import { ErrorHandler } from '../../error/error-handler';
import { FileNameError, ValidationError } from '../../error/validation-error';
import { dirname, basename } from 'path';

const handler = new ErrorHandler();

export const RULE_NAME = 'file-name-validation';

export function filenameValidation(
  file: string,
) {

  const errors: (ValidationError | boolean)[] = [];
  const filepath = dirname(file).split('/');
  const foldername = filepath[filepath.length - 1];
  const filename = basename(file);
  const projectName = filename.split('-')[0];

  const rule = {
    selector: undefined,
    validation: undefined,
    name: RULE_NAME,
    description: `Validate if the filename matches this pattern [folder]-[feature].sketch` +
    ``,
  };

  if (foldername !== projectName) {
    const error = new FileNameError({
      objectId: filename,
      name: foldername,
      message: `File name ${filename} is invalid, it needs to contain the folder name.`,
    });
    handler.addError(
      rule,
      error,
    );
    errors.push(error);
  } else if (!filename.match('^[a-zA-Z\d-]*.sketch')) {
    const error = new FileNameError({
      objectId: filename,
      name: projectName,
      message: `File name ${filename} is invalid, it should only contain [a-z, A-Z, 0-9, -].`,
    });
    handler.addError(
      rule,
      error,
    );
    errors.push(error);
  } else {
    handler.addSuccess(rule);
    errors.push(true);
  }
}
