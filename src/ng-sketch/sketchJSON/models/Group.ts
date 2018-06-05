import { Base } from './Base';
import { IBase, IFrame, IBounding } from '../interfaces/Base';
import { IGroup } from '../interfaces/Group';
import { UUID } from '../helpers/UUID';

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
