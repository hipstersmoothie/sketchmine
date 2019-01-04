import { filenameValidation, RULE_NAME } from '../src/rules/file-name-validation';
import { FileNameError } from '../src/error/validation-error';
import { ErrorHandler } from '../src/error/error-handler';
import { Logger } from '@sketchmine/node-helpers';

const log = new Logger();

describe('Filename Validation', () => {

  const handler = new ErrorHandler(log);

  beforeEach(() => {
    handler.rulesStack = {};
  });

  test('should check if validation passes if filename is invalid', () => {
    const path = '/myprojects/projectname/projectname-feature-detail.sketch';
    filenameValidation(path, handler);
    const val = handler.rulesStack[RULE_NAME];
    expect(val.succeeding).toBeTruthy();
  });

  test('should check if ci360 (numbers) are valid in folder and file name', () => {
    const path = '/ci360/ci360-account.sketch';
    filenameValidation(path, handler);
    const val = handler.rulesStack[RULE_NAME];
    expect(val.succeeding).toBeTruthy();
  });

  test('should check if validation fails if filename does not contain foldername', () => {
    const path = '/myprojects/projectname-feature-detail.sketch';
    filenameValidation(path, handler);
    const val = handler.rulesStack[RULE_NAME];
    expect(val.succeeding).toBeFalsy();
    expect(val.failing[0]).toBeInstanceOf(FileNameError);

    expect(val.failing).toBeInstanceOf(Array);
    expect(val.failing).toHaveLength(1);
    expect(val.failing[0]).toBeInstanceOf(FileNameError);
  });

  test('should check if validation fails if filename contains invalid chars', () => {
    const path = '/myprojects/projectname_feature_detail2.sketch';
    filenameValidation(path, handler);
    const val = handler.rulesStack[RULE_NAME];
    expect(val.succeeding).toBeFalsy();
    expect(val.failing[0]).toBeInstanceOf(FileNameError);

    expect(val.failing).toBeInstanceOf(Array);
    expect(val.failing).toHaveLength(1);
    expect(val.failing[0]).toBeInstanceOf(FileNameError);
  });
});
