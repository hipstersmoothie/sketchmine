import { Base } from './base';
import { IBase, IBounding } from '../interfaces/base.interface';
import { IGroup } from '../interfaces/group.interface';
import { UUID } from '../helpers/uuid';

export class Group extends Base {

  private static _class = 'group';

  constructor(bounding: IBounding) {
    super();
    super.class = Group._class;
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
