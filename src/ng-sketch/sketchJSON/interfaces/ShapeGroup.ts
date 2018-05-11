import { IBase } from "./Base";

export interface IShapeGroup extends IBase {
  hasClickThrough: boolean; 
  clippingMaskMode: number;
  hasClippingMask: boolean; 
  windingRule: number;
  originalObjectID: string;
}
