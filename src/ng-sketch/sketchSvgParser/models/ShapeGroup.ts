import { Base } from '../../sketchJSON/models/Base';
import { IShapeGroup } from '../interfaces/ShapeGroup';
import { IBounding, IBase } from '../../sketchJSON/interfaces/Base';

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
    }
  }
}



