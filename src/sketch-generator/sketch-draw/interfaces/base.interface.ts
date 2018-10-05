import { SketchStyle } from './style.interface';

export enum SketchObjectTypes {
  Artboard = 'artboard',
  AttributedString = 'attributedString',
  Bitmap = 'bitmap',
  Blur = 'blur',
  Border = 'border',
  Color = 'color',
  CurvePoint = 'curvePoint',
  ExportOptions = 'exportOptions',
  Fill = 'fill',
  FontDescriptor = 'fontDescriptor',
  Frame = 'rect',
  Gradient = 'gradient',
  GradientStop = 'gradientStop',
  GraphicsContext = 'graphicsContextSettings',
  Group = 'group',
  InnerShadow = 'innerShadow',
  Page = 'page',
  ParagraphStyle = 'paragraphStyle',
  Rectangle = 'rectangle',
  RulerData = 'rulerData',
  Shadow = 'shadow',
  ShapeGroup = 'shapeGroup',
  ShapePath = 'shapePath',
  StringAttribute = 'stringAttribute',
  Style = 'style',
  SymbolMaster = 'symbolMaster',
  Text = 'text',
  TextStyle = 'textStyle',
}

export interface SketchBase {
  _class: SketchObjectTypes;
  do_objectID: string;
  exportOptions: SketchExportOptions;
  frame?: SketchFrame;
  hasClickThrough?: boolean;
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  layers?: any[];
  name: string;
  nameIsFixed: boolean;
  originalObjectID?: string;
  resizingConstraint: number;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  style: SketchStyle;
}

export interface SketchFrame extends IBounding {
  _class: SketchObjectTypes.Frame;
  constrainProportions: boolean;
  do_objectID?: string; // used in Group
}

export interface SketchExportOptions {
  _class: SketchObjectTypes.ExportOptions;
  exportFormats: any[];
  includedLayerIds: any[];
  layerOptions: number;
  shouldTrim: boolean;
}

export interface IBounding {
  height: number;
  width: number;
  x: number;
  y: number;
}