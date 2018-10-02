import {
  SketchBorder,
  SketchShadow,
  SketchFill,
  SketchObjectTypes,
  SketchColor,
  SketchGraphicsContext,
  SketchStyle,
} from '../interfaces';
import {
  cssToRGBA,
  BlendingMode,
  BorderPosition,
  NoiseFillType,
  FillType,
  PatternFillType,
} from '../helpers';
import { colorToSketchColor } from '../helpers/color-to-sketch-color';

export interface Shadow {
  color: string | any;
  offsetX: number;
  offsetY: number;
  spread: number;
  blurRadius: number;
}

export class Style {
  shadows: SketchShadow[] = [];
  borders: SketchBorder[] = [];
  fills: SketchFill[] = [];
  opacity: number;

  addStyle(startMarkerType: number = 0, miterLimit: number = 10, endMarkerType: number = 0): SketchStyle {
    return {
      _class: SketchObjectTypes.Style,
      endMarkerType,
      miterLimit,
      startMarkerType,
      windingRule: 1,
    };
  }

  addFill(color: string | any, alpha: number = 1) {
    this.fills.push(this.getFill(color, alpha));
  }

  addShadow(config: Shadow) {
    this.shadows.push({
      _class: SketchObjectTypes.Shadow,
      isEnabled: true,
      color: colorToSketchColor(config.color),
      contextSettings: this.getGraphicsContext(BlendingMode.Normal, 1),
      blurRadius: config.blurRadius || 0,
      offsetX: config.offsetX || 0,
      offsetY: config.offsetY || 0,
      spread: config.spread || 0,
    });
  }

  addBorder(color: string | any, thickness: number, fillType = FillType.Solid) {
    this.borders.push({
      _class: SketchObjectTypes.Border,
      color: colorToSketchColor(color),
      fillType,
      isEnabled: true,
      position: BorderPosition.Outside,
      thickness,
    });
  }

  getGraphicsContext(blendMode: BlendingMode, opacity: number): SketchGraphicsContext {
    return {
      _class: SketchObjectTypes.GraphicsContext,
      blendMode,
      opacity,
    };
  }

  getFill(color: string | any, alpha: number = 1): SketchFill {
    return {
      _class: SketchObjectTypes.Fill,
      isEnabled: true,
      color: colorToSketchColor(color, alpha),
      fillType: FillType.Solid,
      noiseIndex: NoiseFillType.Original,
      noiseIntensity: 0,
      patternFillType: PatternFillType.Fill,
      patternTileScale: 1,
    };
  }

  generateObject(): SketchStyle {

    const style = this.addStyle();

    if (this.fills.length) { style.fills = this.fills; }
    if (this.borders.length) { style.borders = this.borders; }
    if (this.shadows.length) { style.shadows = this.shadows; }
    if (this.opacity) {
      style.contextSettings = this.getGraphicsContext(BlendingMode.Normal, this.opacity);
    }

    return style;
  }
}
