import { Base } from "./Base";
import { IBounding, IBase } from "../interfaces/Base";
import { Style } from "./Style";
import { UUID } from "../helpers/UUID";
import { IShapeGroup } from "../interfaces/ShapeGroup";

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
      originalObjectID: UUID.generate(),
    }
  }
}



