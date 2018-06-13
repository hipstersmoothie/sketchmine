import * as fs from 'fs';
import { ValidationError, ColorNotInPaletteError } from '../error/ValidationError';
import { IValdiationContext } from '../interfaces/IValidationRule';
import chalk from 'chalk';
import { round } from '../../ng-sketch/sketchJSON/helpers/util';
import { IDynatraceColorPalette, IDynatraceColor } from '../interfaces/IDynatraceColor';
import { rgbToHex } from '../../utils/rgb-to-hex';
import { ErrorHandler } from '../error/ErrorHandler';

const colorJSON = fs.readFileSync('tests/fixtures/colors.json').toString();
const colors: string[] = removeUnusedColors(JSON.parse(colorJSON));

export function colorValidation(
  homeworks: IValdiationContext[],
  currentTask: number,
  ): ValidationError | boolean {

  const task = homeworks[currentTask];
  if (!task) {
    console.error(
      chalk`{bgRed [color-validation.ts]} -> colorValdiation needs a valid task` +
      chalk`{cyan IValdiationContext[]} parameter with index!\n`,
    );
    return false;
  }

  const object = {
    objectId: task.do_objectID,
    name: task.name,
  };

  if (task.style) {
    if (task.style.fills) {
      task.style.fills.forEach((fill) => {
        const hex = rgbToHex(
          round(fill.color.red * 255, 0),
          round(fill.color.green * 255, 0),
          round(fill.color.blue * 255, 0),
        ).toUpperCase();

        if (!colors.includes(hex)) {
          const error = new ColorNotInPaletteError(
            hex,
            {
              message: chalk`The Color {cyan ${hex}} is not in the Dynatrace Color Palette!\n` +
              chalk`Take a look at {grey https://styles.lab.dynatrace.org/resources/colors}`,
              ...object,
            },
          );
          ErrorHandler.addError(error);
        }
      });
    }
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
