import { cssToRGBA } from '@sketch-draw/helpers/util';
import { IBorder, IFill, IColor, IStyle, SketchGraphicsContext, IShadow } from '@sketch-draw/interfaces';
import {
  BorderPosition,
  FillType,
  PatternFillType,
  NoiseFillType,
  BlendingMode,
} from '@sketch-draw/helpers/sketch-constants';

export interface Shadow {
  color: string | any;
  offsetX: number;
  offsetY: number;
  spread: number;
  blurRadius: number;
}

export class Style {
  shadows: IShadow[] = [];
  borders: IBorder[] = [];
  fills: IFill[] = [];
  opacity: number;

  addColorFill(color: string | any, alpha: number = 1) {
    this.fills.push(this.getFill(color, alpha));
  }

  addShadow(config: Shadow) {
    this.shadows.push({
      _class: 'shadow',
      isEnabled: true,
      color: this.getColor(config.color),
      contextSettings: this.getGraphicsContext(BlendingMode.Normal, 1),
      blurRadius: config.blurRadius || 0,
      offsetX: config.offsetX || 0,
      offsetY: config.offsetY || 0,
      spread: config.spread || 0,
    });
  }

  addBorder(color: string | any, thickness: number, fillType = FillType.Solid) {
    this.borders.push({
      _class: 'border',
      color: this.getColor(color),
      fillType,
      isEnabled: true,
      position: BorderPosition.Outside,
      thickness,
    });
  }

  getGraphicsContext(blendMode: BlendingMode, opacity: number): SketchGraphicsContext {
    return {
      _class: 'graphicsContextSettings',
      blendMode,
      opacity,
    };
  }

  getColor(color: string | any, alpha: number = 1): IColor {
    const { r, g, b, a } = cssToRGBA(color);

    return {
      _class: 'color',
      red: r / 255,
      green: g / 255,
      blue: b / 255,
      alpha: a * alpha,
    };
  }

  getFill(color: string | any, alpha: number = 1): IFill {
    return {
      _class: 'fill',
      isEnabled: true,
      color: this.getColor(color, alpha),
      fillType: FillType.Solid,
      noiseIndex: NoiseFillType.Original,
      noiseIntensity: 0,
      patternFillType: PatternFillType.Fill,
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

    if (this.fills.length) { style.fills = this.fills; }
    if (this.borders.length) { style.borders = this.borders; }
    if (this.shadows.length) { style.shadows = this.shadows; }
    if (this.opacity) {
      style.contextSettings = this.getGraphicsContext(BlendingMode.Normal, this.opacity);
    }

    return style;
  }
}
