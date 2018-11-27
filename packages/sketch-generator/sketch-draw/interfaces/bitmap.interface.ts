import { SketchBase } from './base.interface';

export interface SketchBitmap extends SketchBase {
  clippingMask: string;
  fillReplacesImage: boolean;
  image: SketchJSONFileReference;
  intendedDPI: number;
}

export interface SketchJSONFileReference {
  _class: 'MSJSONFileReference';
  _ref_class: 'MSImageData';
  _ref: string;
}
