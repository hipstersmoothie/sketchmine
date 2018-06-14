import { cssToRGBA } from '../helpers/util';
import { IBorder, IFill, IColor, IStyle } from '../interfaces/style.interface';
import { UUID } from '../helpers/uuid';

export class Style {
  private _borders: IBorder[] = [];
  private _fills: IFill[] = [];
  private _opacity: string;

  set opacity(input: number | string) { this._opacity = `${input}`; }

  addColorFill(color: string | any, alpha: number = 1) {
    this._fills.push(this.colorFill(color, alpha));
  }

  addBorder(color: string | any, thickness: number) {
    this._borders.push({
      _class: 'border',
      isEnabled: true,
      color: this.convertColor(color),
      fillType: 0,
      position: 1,
      thickness,
    });
  }

  convertColor(color: string | any, alpha: number = 1): IColor {
    const { r, g, b, a } = cssToRGBA(color);

    return {
      _class: 'color',
      red: r / 255,
      green: g / 255,
      blue: b / 255,
      alpha: a * alpha,
    };
  }

  private colorFill(color: string | any, alpha: number = 1): IFill {
    return {
      _class: 'fill',
      isEnabled: true,
      color: this.convertColor(color, alpha),
      fillType: 0,
      noiseIndex: 0,
      noiseIntensity: 0,
      patternFillType: 1,
      patternTileScale: 1,
    };
  }

  generateObject(): IStyle {

    const style = {
      _class: 'style',
      endDecorationType: 0,
      miterLimit: 10,
      startDecorationType: 0,
    } as IStyle;

    if (this._fills.length > 0) { style.fills = this._fills; }
    if (this._borders.length > 0) { style.borders = this._borders; }
    if (this._opacity) {
      style.contextSettings = {
        _class: 'graphicsContextSettings',
        blendMode: 0,
        opacity: this._opacity,
      };
    }

    return style;
  }
}
