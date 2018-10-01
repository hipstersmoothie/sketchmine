import { ITextStyle } from './text.interface';
import { FillType, PatternFillType } from '../helpers/sketch-constants';

export interface IStyle {
  _class: string;
  do_objectID?: string;
  fills?: IFill[];
  borders?: IBorder[];
  shadows?: IShadow[];
  endDecorationType: number;
  miterLimit: number;
  startDecorationType: number;
  contextSettings?: SketchGraphicsContext;
  textStyle?: ITextStyle;
}

export interface SketchGraphicsContext {
  _class: string;
  blendMode: number;
  opacity: number;
}

export interface IColor {
  _class: string;
  alpha: number;
  blue: number;
  green: number;
  red: number;
}

export interface IBorder {
  _class: string;
  isEnabled: boolean;
  color: IColor;
  fillType: number;
  position: number;
  thickness: number;
}

export interface IFill {
  _class: string;
  isEnabled: boolean;
  color: IColor;
  fillType: FillType;
  noiseIndex: 0;
  noiseIntensity: 0;
  patternFillType: PatternFillType;
  patternTileScale: 1;
}

export interface IShadow {
  _class: string;
  isEnabled: boolean;
  color: IColor;
  contextSettings: SketchGraphicsContext;
  blurRadius: number;
  offsetX: number;
  offsetY: number;
  spread: number;
}
