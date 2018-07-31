import { Base } from '@sketch-draw/models/base';
import { IBase, IBounding, IGroup } from '@sketch-draw/interfaces';
import { UUID } from '@sketch-draw/helpers/uuid';

export class Group extends Base {

  private static _class = 'group';

  constructor(bounding: IBounding) {
    super();
    super.className = Group._class;
    super.bounding = bounding;
    super.style = super.addStyle();
  }

  generateObject(): IGroup {
    const base: IBase = super.generateObject();

    return {
      ...base,
      frame: super.addFrame('rect'),
      nameIsFixed: true,
      hasClickThrough: false,
      originalObjectID: UUID.generate(),
    };
  }
}
