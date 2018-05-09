export interface IStyle {
  _class: string,
  do_objectID?: string,
  fills?: IFill[],
  borders?: IBorder[],
  endDecorationType: number,
  miterLimit: number,
  startDecorationType: number,
  contextSettings?: IStyleContextSettings
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
  red: number;
  green: number;
  blue: number;
  alpha: number;
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
