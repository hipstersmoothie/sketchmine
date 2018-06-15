import { Base } from '../../sketchJSON/models/base';
import { IShapeGroup } from '../interfaces/shape-group.interface';
import { IBounding, IBase } from '../../sketchJSON/interfaces/base.interface';

export class ShapeGroup extends Base {

  constructor(bounding: IBounding) {
    super();
    super.class = 'shapeGroup';
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
