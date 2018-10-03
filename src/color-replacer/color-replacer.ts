import { ColorDefinition } from '@color-replacer/interfaces/color-definition.interface';
import { rgbToHex } from '@utils';
import { round, cssToRGBA } from '@sketch-draw/helpers/util';
import { SketchColor, SketchBase } from '../sketch-generator/sketch-draw/interfaces';

export class ColorReplacer {
  private _oldColors: string[];

  constructor(private _colors: ColorDefinition) {
    this._oldColors = Object.keys(this._colors);
  }

  replace(file: SketchBase) {
    this.findColorObject(file);
    return file;
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

  private updateColor(color: SketchColor) {
    const hex = this.toHex(color);
    if (this._oldColors.includes(hex)) {
      console.log(this._colors[hex]);
      const { r, g, b } = cssToRGBA(this._colors[hex]);

      color.red = r / 255;
      color.green = g / 255;
      color.blue = b / 255;
    }
  }

  private toHex(color: SketchColor) {
    return rgbToHex(
      round(color.red * 255, 0),
      round(color.green * 255, 0),
      round(color.blue * 255, 0),
    ).toUpperCase();
  }
}
