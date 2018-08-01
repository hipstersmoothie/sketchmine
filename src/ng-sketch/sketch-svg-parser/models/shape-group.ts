import { Base } from '@sketch-draw/models/base';
import { IShapeGroup } from '@sketch-svg-parser/interfaces';
import { IBounding, IBase } from '@sketch-draw/interfaces';

export class ShapeGroup extends Base {

  constructor(bounding: IBounding) {
    super();
    super.className = 'shapeGroup';
    super.bounding = bounding;
    super.style = super.addStyle();
  }

  generateObject(): IShapeGroup {
    const base: IBase = super.generateObject();

    return {
      ...base,
      frame: super.addFrame('rect'),
      hasClickThrough: false,
      clippingMaskMode: 0,
      hasClippingMask: false,
      windingRule: 1,
    };
  }
}
