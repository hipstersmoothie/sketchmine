import { SketchBase, IBounding, SketchObjectTypes, SketchShapeGroup } from '../interfaces';
import { Base } from './base';

export class ShapeGroup extends Base {

  constructor(bounding: IBounding) {
    super(bounding);
    super.className = SketchObjectTypes.ShapeGroup;
  }

  generateObject(): SketchShapeGroup {
    const base: SketchBase = super.generateObject();

    return {
      ...base,
      frame: super.addFrame(),
      hasClickThrough: false,
      clippingMaskMode: 0,
      hasClippingMask: false,
      windingRule: 1,
    };
  }
}
