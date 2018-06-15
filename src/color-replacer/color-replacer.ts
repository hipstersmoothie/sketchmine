import { colorDefinition } from './interfaces/color-definition.interface';
import { IBase } from '../ng-sketch/sketchJSON/interfaces/base.interface';
import { IColor } from '../ng-sketch/sketchJSON/interfaces/style.interface';
import { rgbToHex } from '../utils/rgb-to-hex';
import { round, cssToRGBA } from '../ng-sketch/sketchJSON/helpers/util';

export class ColorReplacer {
  private _oldColors: string[];

  constructor(private _colors: colorDefinition) {
    this._oldColors = Object.keys(this._colors);
  }

  replace(file: IBase) {
    // console.log(this._oldColors)
    this.findColorObject(file);
    return file;
    // console.log(JSON.stringify(file, null, 2));
  }

  private findColorObject(_object) {
    let result = null;
    if (_object instanceof Array) {
      for (let i = 0, max = _object.length; i < max; i += 1) {
        result = this.findColorObject(_object[i]);
        if (result) {
          break;
        }
      }
    } else {
      for (const key in _object) {
        if (key === '_class' && _object[key] === 'color') {
          this.updateColor(_object);
          break;
        }
        if (
          _object[key] instanceof Object ||
          _object[key] instanceof Array
        ) {
          result = this.findColorObject(_object[key]);
          if (result) {
            break;
          }
        }
      }
    }
    return result;
  }

  private updateColor(color: IColor) {
    const hex = this.toHex(color);
    if (this._oldColors.includes(hex)) {
      console.log(this._colors[hex]);
      const { r, g, b } = cssToRGBA(this._colors[hex]);

      color.red = r / 255;
      color.green = g / 255;
      color.blue = b / 255;
    }
  }

  private toHex(color: IColor) {
    return rgbToHex(
      round(color.red * 255, 0),
      round(color.green * 255, 0),
      round(color.blue * 255, 0),
    ).toUpperCase();
  }
}
