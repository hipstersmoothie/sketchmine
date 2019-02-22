import { rgbToHex } from '@sketchmine/helpers';
import { Logger, readFile } from '@sketchmine/node-helpers';
import { round, SketchColor, SketchFill, SketchObjectTypes, colorToSketchColor } from '@sketchmine/sketch-file-format';
import chalk from 'chalk';
import { resolve } from 'path';
import { DYNATRACE_LOGO_COLORS, rules } from '../src/config';
import { ColorNotInPaletteError, ErrorHandler } from '../src/error';
import { colorInPalette, generateMasterColors } from '../src/rules/color-validation';
import { Validator } from '../src/validator';
import {
  generateArtboardWithDisabledBackgroundColor,
  generateArtboardWithEnabledBackgroundColor,
} from './fixtures/artboard-fixtures';
import { generateMinimumTaskFixture } from './fixtures/minimum-task-fixture';
import { generateValidSketchPages } from './fixtures/page-fixtures';
import { generateRectangle } from './fixtures/rectangle-fixtures';

const COLORS_FILE = resolve('./tests/fixtures/_colors.scss');

const WRONG_COLOR = colorToSketchColor('#E0FA6A');
const VALID_COLOR = colorToSketchColor('#B4DC00');
const THREE_DIGIT_COLOR = colorToSketchColor('#CCC');
const SIX_DIGIT_COLOR = colorToSketchColor('#5EAD35');

const WRONG_FILL: SketchFill = {
  _class: SketchObjectTypes.Fill,
  isEnabled: true,
  color: WRONG_COLOR,
  fillType: 0,
  noiseIndex: 0,
  noiseIntensity: 0,
  patternFillType: 1,
  patternTileScale: 1,
};

const VALID_FILL: SketchFill = {
  _class: SketchObjectTypes.Fill,
  isEnabled: true,
  color: VALID_COLOR,
  fillType: 0,
  noiseIndex: 0,
  noiseIntensity: 0,
  patternFillType: 1,
  patternTileScale: 1,
};

function setUpColorValidator(env: string = 'product') {
  const log = new Logger();
  const handler = new ErrorHandler(log);
  const colorRule = rules.find(rule => rule.name === 'color-palette-validation');
  const validator = new Validator([colorRule], handler, env);
  handler.rulesStack = {};
  return {
    validator,
    handler,
  };
}

describe('[sketch-validator] › Color validation › Tests if the color validation passes and fails as expected.', () => {
  // Array of all colors, i.e. the whole color palette and the Dynatrace logo colors
  let colors: string[];

  beforeAll(async () => {
    const allColors = await readFile(COLORS_FILE);
    colors = generateMasterColors(DYNATRACE_LOGO_COLORS, allColors);
  });

  test('should check if colors array has correct length', () => {
    const noOfColors = colors.length;
    expect(noOfColors).toBe(99);
  });

  test('should check if RGB to HEX conversion returns correct value', () => {
    const hex = rgbToHex(
      round(VALID_FILL.color.red * 255, 0),
      round(VALID_FILL.color.green * 255, 0),
      round(VALID_FILL.color.blue * 255, 0),
    ).toUpperCase();
    expect(hex).toBe('#B4DC00');
  });

  test('should check if validation throws an error if the fill color does not match the color-palette', () => {
    const check = colorInPalette(generateMinimumTaskFixture(), WRONG_FILL, colors);
    expect(check).toBeInstanceOf(ColorNotInPaletteError);
  });

  test('should check if fill color element gets ignored when disabled', () => {
    WRONG_FILL.isEnabled = false;
    const check = colorInPalette(generateMinimumTaskFixture(), WRONG_FILL, colors);
    expect(check).not.toBeInstanceOf(ColorNotInPaletteError);
    expect(check).toEqual(true);
  });

  test(chalk`should check if the validation passes for {hex('#B4DC00') ███} #B4DC00`, () => {
    const check = colorInPalette(generateMinimumTaskFixture(), VALID_FILL, colors);
    expect(check).not.toBeInstanceOf(ColorNotInPaletteError);
    expect(check).toEqual(true);
  });

  test(chalk`should check if the validation passes for 3 digit hex values {hex('#CCCCCC') ███} #CCC`, () => {
    VALID_FILL.color = THREE_DIGIT_COLOR;
    const check = colorInPalette(generateMinimumTaskFixture(), VALID_FILL, colors);
    expect(check).not.toBeInstanceOf(ColorNotInPaletteError);
    expect(check).toEqual(true);
  });

  test(chalk`should not convert 6 digit hex values to 3 digit hex values {hex('#5EAD35') ███} #5EAD35`, () => {
    VALID_FILL.color = SIX_DIGIT_COLOR;
    const check = colorInPalette(generateMinimumTaskFixture(), VALID_FILL, colors);
    expect(check).not.toBeInstanceOf(ColorNotInPaletteError);
    expect(check).toEqual(true);
  });

  test('should check if color validation passes for objects using valid colors', () => {
    const { validator, handler } = setUpColorValidator('product');
    const files = generateValidSketchPages(false);
    validator.files = files;
    validator.validate();
    const result = handler.rulesStack['color-palette-validation'];
    // 6 valid colors, 1 rectangle with 2 colors on each page
    expect(result.succeeding).toBe(6);
    expect(result.failing).toHaveLength(0);
  });

  test('should check if color validation fails for objects using wrong colors', () => {
    const { validator, handler } = setUpColorValidator('product');
    const files = generateValidSketchPages(false);
    // add rectangle with wrong border and fill colors
    const rectangle = generateRectangle('#000000', '#649CA0', 1);
    files[0].layers[0].layers.push(rectangle);

    validator.files = files;
    validator.validate();
    const result = handler.rulesStack['color-palette-validation'];
    expect(result.succeeding).toBe(6); // 6 valid colors from rectangles
    expect(result.failing).toHaveLength(2);
    expect(result.failing[0]).toBeInstanceOf(ColorNotInPaletteError);
    expect(result.failing[0].name).toBe('rectangle');
    expect(result.failing[1]).toBeInstanceOf(ColorNotInPaletteError);
    expect(result.failing[1].name).toBe('rectangle');
  });

  test('should check if color validation passes for objects using wrong, disabled colors', () => {
    const { validator, handler } = setUpColorValidator('product');
    const files = generateValidSketchPages(false);
    // add rectangle with wrong border and fill colors and disable them
    const rectangle = generateRectangle('#000000', '#649CA0', 1);
    rectangle.style.fills[0].isEnabled = false;
    rectangle.style.borders[0].isEnabled = false;
    files[0].layers[0].layers.push(rectangle);

    validator.files = files;
    validator.validate();
    const result = handler.rulesStack['color-palette-validation'];
    // 8 colors in total, 2 of them wrong, but disabled
    expect(result.succeeding).toBe(8);
    expect(result.failing).toHaveLength(0);
  });

  test('should check if color validation passes for artboards using a valid background color', () => {
    const { validator, handler } = setUpColorValidator('product');
    const files = generateValidSketchPages(false);
    // add artboard with valid background color
    const artboard = generateArtboardWithEnabledBackgroundColor(360, '#CCCCCC');
    files[0].layers[0] = artboard;

    validator.files = files;
    validator.validate();
    const result = handler.rulesStack['color-palette-validation'];
    expect(result.succeeding).toBe(7); // 1 valid background color, 6 colors from rectangles
    expect(result.failing).toHaveLength(0);
  });

  test('should check if color validation fails for artboards using a wrong background color', () => {
    const { validator, handler } = setUpColorValidator('product');
    const files = generateValidSketchPages(false);
    // add artboard with wrong background color
    const artboard = generateArtboardWithEnabledBackgroundColor(360, '#649CA0');
    files[0].layers[0] = artboard;

    validator.files = files;
    validator.validate();
    const result = handler.rulesStack['color-palette-validation'];
    expect(result.succeeding).toBe(6); // 6 valid colors from rectangles
    expect(result.failing).toHaveLength(1); // 1 wrong background color
    expect(result.failing[0]).toBeInstanceOf(ColorNotInPaletteError);
    expect(result.failing[0].name).toBe('360-test-ab');
  });

  // tslint:disable-next-line max-line-length
  test('should check if color validation passes for artboards using a wrong, not exported background color', () => {
    const { validator, handler } = setUpColorValidator('product');
    const files = generateValidSketchPages(false);
    // add artboard with wrong background color that is not exported
    const artboard = generateArtboardWithDisabledBackgroundColor(360, '#000000');
    files[0].layers[0] = artboard;

    validator.files = files;
    validator.validate();
    const result = handler.rulesStack['color-palette-validation'];
    expect(result.succeeding).toBe(6); // 6 valid colors from rectangles
    expect(result.failing).toHaveLength(0);
  });
});
