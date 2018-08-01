import { Base } from '@sketch-draw/models/base';
import { IBounding, IBase, IPage } from '@sketch-draw/interfaces';

export class Page extends Base {

  constructor(bounding: IBounding) {
    super();
    super.className = 'page';
    super.name = 'Symbols';
    super.style = super.addStyle();
    super.bounding = bounding;
  }

  generateObject(): IPage {
    const base: IBase = super.generateObject();

    return {
      ...base,
      frame: super.addFrame('rect'),
      hasClickThrough: false,
      horizontalRulerData: super.addRuler(-153),
      includeInCloudUpload: true,
      verticalRulerData: super.addRuler(-290),
    };
  }
}
