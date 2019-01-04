import { PageNamingError, NoArtboardFoundError } from '../src/error/validation-error';
import { Validator } from '../src/validator';
import { rules } from '../src/config';
import { Page, Rectangle, Artboard, IBounding } from '@sketchmine/sketch-file-format';
import { ErrorHandler } from '../src/error/error-handler';
import { Logger } from '@sketchmine/node-helpers';

const log = new Logger();

const SAMPLE_BOUNDING: IBounding = { x: 0, y: 0, width: 100, height: 100 };
const SAMPLE_360_BOUNDING: IBounding = { x: 0, y: 0, width: 360, height: 100 };
const SAMPLE_1280_BOUNDING: IBounding = { x: 0, y: 0, width: 1280, height: 100 };
const SAMPLE_1920_BOUNDING: IBounding = { x: 0, y: 0, width: 1920, height: 100 };

describe('Page validation', () => {

  let validator: Validator;
  const handler = new ErrorHandler(log);

  beforeEach(() => {
    const pageRule = rules.find(rule => rule.name === 'page-validation');
    validator = new Validator([pageRule], handler, 'product');
    handler.rulesStack = {};
  });

  test('should check if validation passes if all is fine', () => {
    const page1 = new Page(SAMPLE_BOUNDING);
    const page2 = new Page(SAMPLE_BOUNDING);
    const page3 = new Page(SAMPLE_BOUNDING);
    const page4 = new Page(SAMPLE_BOUNDING);
    page1.name = '360';
    page2.name = '1280';
    page3.name = '1920';
    page4.name = 'SymbolMaster';

    const ab1 = new Artboard(SAMPLE_360_BOUNDING);
    const ab2 = new Artboard(SAMPLE_1280_BOUNDING);
    const ab3 = new Artboard(SAMPLE_1920_BOUNDING);
    const ab4 = new Artboard(SAMPLE_BOUNDING);

    ab1.name = '360-test-ab';
    ab2.name = '1280-test-ab';
    ab3.name = '1920-test-ab';
    ab4.name = 'SampleAB';

    const rect = new Rectangle(SAMPLE_BOUNDING, 0);

    ab1.addLayer(rect.generateObject());
    ab2.addLayer(rect.generateObject());
    ab3.addLayer(rect.generateObject());
    ab4.addLayer(rect.generateObject());

    page1.addLayer(ab1.generateObject());
    page2.addLayer(ab2.generateObject());
    page3.addLayer(ab3.generateObject());
    page4.addLayer(ab4.generateObject());

    validator.files = [
      page1.generateObject(),
      page2.generateObject(),
      page3.generateObject(),
      page4.generateObject(),
    ];

    validator.validate();

    const result = handler.rulesStack['page-validation'];
    expect(result.succeeding).toBe(4);
    expect(result.failing).toHaveLength(0);
  });

  test('should check if validation fails for pages without any artboard', () => {

    const page1 = new Page(SAMPLE_BOUNDING);
    const page2 = new Page(SAMPLE_BOUNDING);
    const page3 = new Page(SAMPLE_BOUNDING);
    const page4 = new Page(SAMPLE_BOUNDING);
    page1.name = '360';
    page2.name = '1280';
    page3.name = '1920';
    page4.name = 'SymbolMaster';

    validator.files = [
      page1.generateObject(),
      page2.generateObject(),
      page3.generateObject(),
      page4.generateObject(),
    ];

    validator.validate();

    const result = handler.rulesStack['page-validation'];
    expect(result.failing).toHaveLength(4);
    expect(result.failing[0]).toBeInstanceOf(NoArtboardFoundError);
  });

  test('should check if validation fails if pages are missing', () => {

    const page1 = new Page(SAMPLE_BOUNDING);
    const page2 = new Page(SAMPLE_BOUNDING);
    page1.name = '360';
    page2.name = '1280';

    const ab1 = new Artboard(SAMPLE_360_BOUNDING);
    const ab2 = new Artboard(SAMPLE_1280_BOUNDING);

    ab1.name = '360-test-ab';
    ab2.name = '1280-test-ab';

    page1.addLayer(ab1.generateObject());
    page2.addLayer(ab2.generateObject());

    validator.files = [
      page1.generateObject(),
      page2.generateObject(),
    ];

    validator.validate();

    const result = handler.rulesStack['page-validation'];

    expect(result.failing).toHaveLength(2);
    expect(result.failing[0]).toBeInstanceOf(PageNamingError);
  });

  test('should check if validation fails if pages have wrong names', () => {

    const page1 = new Page(SAMPLE_BOUNDING);
    const page2 = new Page(SAMPLE_BOUNDING);
    const page3 = new Page(SAMPLE_BOUNDING);
    const page4 = new Page(SAMPLE_BOUNDING);
    page1.name = '360';
    page2.name = '1280 - Blubber';
    page3.name = '1920';
    page4.name = 'SymbolMaster';

    const ab1 = new Artboard(SAMPLE_360_BOUNDING);
    const ab2 = new Artboard(SAMPLE_1280_BOUNDING);
    const ab3 = new Artboard(SAMPLE_1920_BOUNDING);
    const ab4 = new Artboard(SAMPLE_BOUNDING);

    const rect = new Rectangle(SAMPLE_BOUNDING, 0);

    ab1.addLayer(rect.generateObject());
    ab2.addLayer(rect.generateObject());
    ab3.addLayer(rect.generateObject());
    ab4.addLayer(rect.generateObject());

    page1.addLayer(ab1.generateObject());
    page2.addLayer(ab2.generateObject());
    page3.addLayer(ab3.generateObject());
    page4.addLayer(ab4.generateObject());

    validator.files = [
      page1.generateObject(),
      page2.generateObject(),
      page3.generateObject(),
      page4.generateObject(),
    ];

    validator.validate();

    const result = handler.rulesStack['page-validation'];

    expect(result.failing).toHaveLength(4);
    expect(result.failing[0]).toBeInstanceOf(PageNamingError);
  });
});
