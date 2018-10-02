import { Base } from './base';
import { IBounding, SketchJSONFileReference, SketchBitmap, SketchBase, SketchObjectTypes } from '../interfaces';
import { Style } from './style';

export class Bitmap extends Base {

  static DPI = 72;
  src: string;

  constructor(bounding: IBounding) {
    super(bounding);
    super.className = SketchObjectTypes.Bitmap;
  }

  private image(): SketchJSONFileReference {
    return {
      _class: 'MSJSONFileReference',
      _ref_class: 'MSImageData',
      _ref: this.src,
    };
  }

  generateObject(): SketchBitmap {
    const base: SketchBase = super.generateObject();
    return {
      ...base,
      frame: super.addFrame(),
      style: new Style().generateObject(),
      clippingMask: '{{0, 0}, {1, 1}}',
      fillReplacesImage: false,
      image: this.image(),
      intendedDPI: Bitmap.DPI,
    } as SketchBitmap;
  }
}
