import { IBase } from '../../sketchJSON/interfaces/Base';

export interface IShapeGroup extends IBase {
  hasClickThrough: boolean; 
  clippingMaskMode: number;
  hasClippingMask: boolean; 
  windingRule: number;
}
