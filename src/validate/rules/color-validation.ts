import chalk from 'chalk';
import * as fs from 'fs';
import { ValidationError, ColorNotInPaletteError } from '../error/validation-error';
import { round } from '../../ng-sketch/sketch-draw/helpers/util';
import { rgbToHex } from '../../utils/rgb-to-hex';
import { IValidationContext } from '../interfaces/validation-rule.interface';
import { IDynatraceColorPalette, IDynatraceColor } from '../interfaces/dynatrace-color.interface';
import { IFill, IBorder } from '../../ng-sketch/sketch-draw/interfaces/style.interface';

const colorJSON = fs.readFileSync('tests/fixtures/colors.json').toString();
const colors: string[] = removeUnusedColors(JSON.parse(colorJSON));

export function colorValidation(
  homeworks: IValidationContext[],
  currentTask: number,
  ): (ValidationError | boolean)[] {

  const task = homeworks[currentTask];
  if (!task) {
    console.error(
      chalk`{bgRed [color-validation.ts]} -> colorValdiation needs a valid task` +
      chalk`{cyan IValdiationContext[]} parameter with index!\n`,
    );
    return;
  }

  const errors: (ValidationError | boolean)[] = [];

  if (task.style) {
    if (task.style.fills) {
      for (let i = 0, max = task.style.fills.length; i < max; i += 1) {
        const color = task.style.fills[i];
        errors.push(colorInPalette(task, color));
      }
    }
    if (task.style.borders) {
      for (let i = 0, max = task.style.borders.length; i < max; i += 1) {
        const color = task.style.borders[i];
        errors.push(colorInPalette(task, color));
      }
    }
  }
  return errors;
}

function colorInPalette(task: IValidationContext, fill: IFill | IBorder): ColorNotInPaletteError | boolean {
  const hex = rgbToHex(
    round(fill.color.red * 255, 0),
    round(fill.color.green * 255, 0),
    round(fill.color.blue * 255, 0),
  ).toUpperCase();

  if (!colors.includes(hex)) {
    return new ColorNotInPaletteError(
      hex,
      {
        objectId: task.do_objectID,
        name: task.name,
        message: chalk`The Color {bold {hex('${hex}') ███} ${hex}} is not in the Dynatrace Color Palette!\n` +
        chalk`Take a look at {grey https://styles.lab.dynatrace.org/resources/colors}`,
      },
    );
  }
  return true;
}

function removeUnusedColors(colors: IDynatraceColorPalette): string[] {

  const _colors: string[] = [];

  for (const key in colors) {
    if (colors.hasOwnProperty(key)) {
      const element: IDynatraceColor = colors[key];
      if (
        element.name.match(/★/) ||
        element.name.match(/Complexion/) ||
        element.name.match(/Steel gray/)
      ) {
        continue;
      }
      _colors.push(element.hex.toUpperCase());
    }
  }
  return _colors;
}
