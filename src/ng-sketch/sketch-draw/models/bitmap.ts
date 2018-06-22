import { Base } from './base';
import { IBase, IBounding } from '../interfaces/base.interface';
import { IBitmap, IImage } from '../interfaces/bitmap.interface';
import { Style } from './style';

export class Bitmap extends Base {

  private static _class = 'bitmap';
  private static DPI = 72;
  private _imageSrc: string;
  private _id: string;

  constructor(bounding: IBounding) {
    super();
    this.class = Bitmap._class;
    this.bounding = bounding;
  }

  set src(src: string) { this._imageSrc = src; }

  private image(): IImage {
    return {
      _class: 'MSJSONFileReference',
      _ref_class: 'MSImageData',
      _ref: this._imageSrc,
    };
  }

  generateObject(): IBitmap {
    const base: IBase = super.generateObject();
    return {
      ...base,
      frame: super.addFrame('rect'),
      style: new Style().generateObject(),
      clippingMask: '{{0, 0}, {1, 1}}',
      fillReplacesImage: false,
      image: this.image(),
      intendedDPI: Bitmap.DPI,
    };
  }
}
