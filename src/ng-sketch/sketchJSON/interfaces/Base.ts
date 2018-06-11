import { IStyle } from './Style';

export interface IBase {
  _class: string;
  do_objectID: string;
  exportOptions: IExportOptions;
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  isLocked: boolean;
  isVisible: boolean;
  frame?: IFrame;
  layerListExpandedType: number;
  name: string;
  nameIsFixed: boolean;
  originalObjectID?: string;
  resizingConstraint: number;
  resizingType: number;
  rotation: number;
  shouldBreakMaskChain: boolean;
  style: IStyle;
  hasClickThrough?: boolean;
  layers: any[];
}

export interface IFrame extends IBounding {
  _class: string;
  do_objectID?: string; // used in Group
  constrainProportions: boolean;
}

export interface IBounding {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface IExportOptions {
  _class: string;
  exportFormats: any[];
  includedLayerIds: any[];
  layerOptions: number;
  shouldTrim: boolean;
}
