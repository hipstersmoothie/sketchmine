import { ITextStyle } from "./Text";

export interface IStyle {
  _class: string,
  do_objectID?: string,
  fills?: IFill[],
  borders?: IBorder[],
  endDecorationType: number,
  miterLimit: number,
  startDecorationType: number,
  contextSettings?: IStyleContextSettings;
  textStyle?: ITextStyle;
}

export interface IStyleContextSettings {
  _class: string,
  blendMode: number,
  opacity: string
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
  fillType: 0;
  noiseIndex: 0;
  noiseIntensity: 0;
  patternFillType: 1;
  patternTileScale: 1;
}
