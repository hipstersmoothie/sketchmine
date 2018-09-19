import { Base } from '@sketch-draw/models/base';
import { IBase, IBounding, IBitmap, IImage } from '@sketch-draw/interfaces';
import { Style } from '@sketch-draw/models/style';

export class Bitmap extends Base {

  private static _class = 'bitmap';
  private static DPI = 72;
  private _imageSrc: string;

  constructor(bounding: IBounding) {
    super();
    this.className = Bitmap._class;
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
