import { Base } from './base';
import { SketchObjectTypes, SketchGroup, SketchBase, IBounding } from '../interfaces';
import { BooleanOperation, UUID } from '../helpers';
import { Style } from './style';

export class Group extends Base {

  constructor(bounding: IBounding) {
    super(bounding);
    super.className = SketchObjectTypes.Group;
    super.style = new Style().generateObject();
  }

  generateObject(): SketchGroup {
    const base: SketchBase = super.generateObject();

    return {
      ...base,
      frame: super.addFrame(),
      booleanOperation: BooleanOperation.None,
      isFixedToViewport: true, // false,
      nameIsFixed: true,
      hasClickThrough: false,
      originalObjectID: UUID.generate(),
    } as SketchGroup;
  }
}
