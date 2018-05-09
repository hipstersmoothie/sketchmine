import { Base } from './Base';
import { IBase, IFrame, IBounding } from '../interfaces/Base';
import { IGroup } from '../interfaces/Group';

export class Group extends Base {

  private static _class = 'group';

  constructor(bounding: IBounding, name?: string) {
    super();
    super.class = Group._class;
    super.bounding = bounding;
    if (name) {
      super.name = name;
    }
  }

  generateObject(): IGroup {
    const base: IBase = super.generateObject();

    return {
      ...base,
      frame: super.addFrame('rect'),
      hasClickThrough: false,
      clippingMaskMode: 0,
      hasClippingMask: false
    }
  }
}
