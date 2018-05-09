import { Base } from "./Base";
import { IBounding, IBase } from "../interfaces/Base";
import { Style } from "./Style";

export class ShapeGroup extends Base {

  constructor(bounding: IBounding) {
    super();
    super.class = 'shapeGroup';
    super.bounding = bounding;
  }

  generateObject() {
    const base: IBase = super.generateObject();

    return {
      ...base,
      frame: super.addFrame('rect'),
      hasClickThrough: false,
      clippingMaskMode: 0,
      hasClippingMask: false,
      windingRule: 1
    }
  }
}



