import { IBase } from '@sketch-draw/interfaces';

export interface IShapeGroup extends IBase {
  hasClickThrough: boolean;
  clippingMaskMode: number;
  hasClippingMask: boolean;
  windingRule: number;
}
