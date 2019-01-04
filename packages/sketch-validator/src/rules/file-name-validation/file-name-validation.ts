// this path import is trusted in case we bundle the dirname and basename function
// out of the node package. – In this case it is ok.
// tslint:disable-next-line:validation-no-node-natives
import { dirname, basename } from 'path';
import {
  ErrorHandler,
  FileNameError,
  FILE_NAME_FOLDER_ERROR_MESSAGE,
  FILE_NAME_ERROR_MESSAGE,
} from '../../error';
import { IValidationRule } from '../../interfaces/validation-rule.interface';

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
  handler: ErrorHandler,
) {

  const filepath = dirname(file).split('/');
  const foldername = filepath[filepath.length - 1];
  const filename = basename(file);
  const projectName = filename.split('-')[0];

  const rule = {
    name: RULE_NAME,
    env: ['product'],
    description: 'Validate if the filename matches this pattern [folder]-[feature].sketch',
  } as IValidationRule;

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
  } else if (!filename.match(/^[a-zA-Z\d-]+?\.sketch/gm)) {
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
