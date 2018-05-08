export interface Page {
  _class: string;
  do_objectID: string;
  exportOptions: PageExportOptions;
  frame: PageFrame;
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  name: string;
  nameIsFixed: boolean;
  resizingConstraint: number;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  style: PageStyle;
  hasClickThrough: boolean;
  layers: any[];
  horizontalRulerData: PageRulerData;
  includeInCloudUpload: boolean;
  verticalRulerData: PageRulerData;
}

export interface PageRulerData {
  _class: string;
  base: number;
  guides: any[];
}

export interface PageStyle {
  _class: string;
  endDecorationType: number;
  miterLimit: number;
  startDecorationType: number;
}

export interface PageFrame {
  _class: string;
  constrainProportions: boolean;
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface PageExportOptions {
  _class: string;
  exportFormats: any[];
  includedLayerIds: any[];
  layerOptions: number;
  shouldTrim: boolean;
}
