import { SketchBase, IBounding, SketchObjectTypes, SketchShapeGroup } from '../interfaces';
import { Base } from './base';
import { Logger } from '../../../utils';

const log = new Logger();

export class ShapeGroup extends Base {

  clippingMask = false;
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
      hasClippingMask: this.clippingMask,
      windingRule: 1,
    };
  }
}
