import { ITextStyle } from './text.interface';
import { FillType, PatternFillType } from '../helpers/sketch-constants';

export interface IStyle {
  _class: string;
  do_objectID?: string;
  fills?: IFill[];
  borders?: IBorder[];
  endDecorationType: number;
  miterLimit: number;
  startDecorationType: number;
  contextSettings?: IStyleContextSettings;
  textStyle?: ITextStyle;
}

export interface IStyleContextSettings {
  _class: string;
  blendMode: number;
  opacity: string;
}

export interface IBorder {
  _class: string;
  isEnabled: boolean;
  color: IColor;
  fillType: number;
  position: number;
  thickness;
}

export interface IColor {
  _class: string;
  alpha: number;
  blue: number;
  green: number;
  red: number;
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
