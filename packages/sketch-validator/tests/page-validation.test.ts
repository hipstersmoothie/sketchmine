import { Logger } from '@sketchmine/node-helpers';
import { rules } from '../src/config';
import { ErrorHandler } from '../src/error/error-handler';
import { NoArtboardFoundError, PageNamingError } from '../src/error/validation-error';
import { Validator } from '../src/validator';
import {
  generateNotAllRequiredPages,
  generatePagesWithArtboards,
  generatePagesWithWrongNames,
  generateValidSketchPages,
} from './fixtures/page-fixtures';

describe('[sketch-validator] › Page validation › Tests if the page validation succeeds and fails as expected.', () => {
  const log = new Logger();
  let validator: Validator;
  const handler = new ErrorHandler(log);

  beforeEach(() => {
    const pageRule = rules.find(rule => rule.name === 'page-validation');
    validator = new Validator([pageRule], handler, 'product');
    handler.rulesStack = {};
  });

  test('should check if validation passes if all is fine', () => {
    validator.files = generateValidSketchPages(true);
    validator.validate();
    const result = handler.rulesStack['page-validation'];
    expect(result.succeeding).toBe(4);
    expect(result.failing).toHaveLength(0);
  });

  test('should check if validation fails for pages without any artboard', () => {
    validator.files = generatePagesWithArtboards(); // no artboards passed
    validator.validate();

    const result = handler.rulesStack['page-validation'];
    expect(result.failing).toHaveLength(3); // Three pages without artboards
    expect(result.failing[0]).toBeInstanceOf(NoArtboardFoundError);
  });

  test('should check if validation fails if pages are missing', () => {
    validator.files = generateNotAllRequiredPages();
    validator.validate();

    const result = handler.rulesStack['page-validation'];
    expect(result.failing).toHaveLength(2);
    expect(result.failing[0]).toBeInstanceOf(PageNamingError);
  });

  test('should check if validation fails if pages have wrong names', () => {
    validator.files = generatePagesWithWrongNames();
    validator.validate();

    const result = handler.rulesStack['page-validation'];
    expect(result.failing).toHaveLength(4);
    expect(result.failing[0]).toBeInstanceOf(PageNamingError);
  });
});
