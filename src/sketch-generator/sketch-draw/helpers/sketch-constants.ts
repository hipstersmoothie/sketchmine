export enum FillType {
  Solid = 0,
  Gradient = 1,
  Pattern = 4,
  Noise = 5,
}

export enum GradientType {
  Linear = 0,
  Radial = 1,
  Circular = 2,
}

export enum PatternFillType {
  Tile = 0,
  Fill = 1,
  Stretch = 2,
  Fit = 3,
}

export enum NoiseFillType {
  Original = 0,
  Black = 1,
  White = 2,
  Color = 3,
}

export enum BorderLineCapsStyle {
  Butt = 0,
  Round = 1,
  Square = 2,
}

export enum BorderLineJoinStyle {
  Miter = 0,
  Round = 1,
  Bevel = 2,
}

export enum LineDecorationType {
  None = 0,
  OpenedArrow = 1,
  ClosedArrow = 2,
  Bar = 3,
}

export enum BlurType {
  GaussianBlur = 0,
  MotionBlur = 1,
  ZoomBlur = 2,
  BackgroundBlur = 3,
}

export enum BorderPosition {
  Center = 0,
  Inside = 1,
  Outside = 2,
}

export enum MaskMode {
  Outline = 0,
  Alpha = 1,
}

export enum BooleanOperation {
  None = -1,
  Union = 0,
  Subtract = 1,
  Intersect = 2,
  Difference = 3,
}

export enum ExportOptionsFormat {
  PNG = 'png',
  JPG = 'jpg',
  TIFF = 'tiff',
  PDF = 'pdf',
  EPS = 'eps',
  SVG = 'svg',
}

export enum BlendingMode {
  Normal = 0,
  Darken = 1,
  Multiply = 2,
  ColorBurn = 3,
  Lighten = 4,
  Screen = 5,
  ColorDodge = 6,
  Overlay = 7,
  SoftLight = 8,
  HardLight = 9,
  Difference = 10,
  Exclusion = 11,
  Hue = 12,
  Saturation = 13,
  Color = 14,
  Luminosity = 15,
}

export enum TextAlignment {
  Left = 0,
  Right = 1,
  Center = 2,
  Justified = 3,
}

export enum TextBehaviour {
  Auto = 0,
  Fixed = 1,
}

export enum CurvePointMode {
  Straight = 1,
  Mirrored = 2,
  Disconnected = 4,
  Asymmetric = 3,
}

export enum UnderlineStyle {
  None = 0,
  Underline = 1,
  Double = 9,
}

export enum StrikethroughStyle {
  None = 0,
  LineThrough = 1,
}
export enum TextTransform {
  Uppercase = 1,
  Lowercase = 2,
  None = 0,
}
