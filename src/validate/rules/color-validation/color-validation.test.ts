import { generateMasterColors } from './generate-master-colors';
import { ColorNotInPaletteError } from '../../error/validation-error';
import { colorInPalette } from './color-validation';
import { IFill } from '@sketch-draw/interfaces';
import { round } from '@sketch-draw/helpers/util';
import chalk from 'chalk';
import { rgbToHex } from '@utils';

/**
 * Sketch converts rgb colors from 0 to 1 so 255 equals 1
 * So convert ${rgb-color}/255 = sketch color
*/
const WRONG_COLOR = {
  _class: 'color',
  red: 0.8784313725,
  green: 0.9803921569,
  blue: 0.4156862745,
  alpha: 1,
};

const SHORT_COLOR = {
  _class: 'color',
  red: 204 / 255,
  green: 204 / 255,
  blue: 204 / 255,
  alpha: 1,
};

const TRUE_COLOR = {
  _class: 'color',
  red: 0.7058823529411764,
  green: 0.8627450980392157,
  blue: 0,
  alpha: 1,
};

const WRONG_FILL = {
  _class: 'fill',
  isEnabled: true,
  color: WRONG_COLOR,
};

const TRUE_FILL = {
  _class: 'fill',
  isEnabled: true,
  color: TRUE_COLOR,
  fillType: 0,
  noiseIndex: 0,
  noiseIntensity: 0,
  patternFillType: 1,
  patternTileScale: 1,
};

describe('Color Validation', () => {
  let colors: string[];
  const fakeTask = {
    do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33',
    name: 'Rectangle ',
  } as any;

  beforeAll(() => {
    colors = generateMasterColors();
  });

  it('should check if validation throws an error if the color does not match the color-palette', () => {
    const check = colorInPalette(fakeTask, WRONG_FILL as IFill);
    expect(check).toBeInstanceOf(ColorNotInPaletteError);
  });

  it('should check if color element gets ignored if disabled', () => {
    const fakeTask = { do_objectID: 'C8BAFBE8-F0F0-4727-B952-7303F9CA3F33', name: 'Rectangle ' } as any;
    WRONG_FILL.isEnabled = false;
    const check = colorInPalette(fakeTask, WRONG_FILL as IFill);
    expect(check).toBeTruthy();
  });
  it(chalk`should check if the validation passes for {hex('#B4DC00') ███} #B4DC00`, () => {
    const hex = rgbToHex(
      round(TRUE_FILL.color.red * 255, 0),
      round(TRUE_FILL.color.green * 255, 0),
      round(TRUE_FILL.color.blue * 255, 0),
    ).toUpperCase();
    expect(hex).toBe('#B4DC00');
    const check = colorInPalette(fakeTask, TRUE_FILL as IFill);
    expect(check).not.toBeInstanceOf(ColorNotInPaletteError);
    expect(check).toBeTruthy();
  });
  it(chalk`should check if the validation passes for 3 digit hex values {hex('#CCCCCC') ███} #CCC`, () => {
    TRUE_FILL.color = SHORT_COLOR;
    const check = colorInPalette(fakeTask, TRUE_FILL as IFill);
    expect(check).not.toBeInstanceOf(ColorNotInPaletteError);
    expect(check).toBeTruthy();
  });
  it(chalk`should not convert 6 digit hex values to 3 digit hex values {hex('#5ead35') ███} #5ead35`, () => {
    TRUE_FILL.color = { _class: 'color', red: 94 / 255, green: 173 / 255, blue: 53 / 255, alpha: 1 };
    const check = colorInPalette(fakeTask, TRUE_FILL as IFill);
    expect(check).not.toBeInstanceOf(ColorNotInPaletteError);
    expect(check).toBeTruthy();
  });
});
