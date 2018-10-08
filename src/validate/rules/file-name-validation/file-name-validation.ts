import { ErrorHandler } from '../../error/error-handler';
import { FileNameError } from '../../error/validation-error';
import { dirname, basename } from 'path';
import { FILE_NAME_FOLDER_ERROR_MESSAGE, FILE_NAME_ERROR_MESSAGE } from '../../error/error-messages';

const handler = new ErrorHandler();

export const RULE_NAME = 'file-name-validation';

/**
 * Takes a file path and corrects it like a teacher 👩🏼‍🏫
 * check if the filename matches following rules:
 *  - contains the projectfolder
 *  - contains only valid chars
 * @param file path of file to validate
 */
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
    name: RULE_NAME,
    env: ['product'],
    description: 'Validate if the filename matches this pattern [folder]-[feature].sketch',
  };

  if (foldername !== projectName) {
    const error = new FileNameError({
      objectId: filename,
      name: foldername,
      message: FILE_NAME_FOLDER_ERROR_MESSAGE(filename),
    });
    handler.addError(
      rule,
      error,
    );
  } else if (!filename.match('^[a-zA-Z\d-]*.sketch')) {
    const error = new FileNameError({
      objectId: filename,
      name: projectName,
      message: FILE_NAME_ERROR_MESSAGE(filename),
    });
    handler.addError(
      rule,
      error,
    );
  } else {
    handler.addSuccess(rule);
  }
}
