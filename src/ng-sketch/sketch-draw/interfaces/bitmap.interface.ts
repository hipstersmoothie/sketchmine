import { IBase } from './base.interface';

export interface IBitmap extends IBase {
  clippingMask: string;
  fillReplacesImage: boolean;
  image: IImage;
  intendedDPI: number;
}

export interface IImage {
  _class: 'MSJSONFileReference';
  _ref_class: 'MSImageData';
  _ref: string;
}
