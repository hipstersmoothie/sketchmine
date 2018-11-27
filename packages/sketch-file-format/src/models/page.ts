import { Base } from '@sketch-draw/models/base';
import { IBounding, SketchBase, SketchPage, SketchObjectTypes } from '@sketch-draw/interfaces';
import { Style } from './style';

export class Page extends Base {

  constructor(bounding: IBounding) {
    super(bounding);
    super.className = SketchObjectTypes.Page;
    super.style = new Style().generateObject();
  }

  generateObject(): SketchPage {
    const base: SketchBase = super.generateObject();

    return {
      ...base,
      hasClickThrough: false,
      horizontalRulerData: super.addRuler(),
      includeInCloudUpload: true,
      verticalRulerData: super.addRuler(),
    } as SketchPage;
  }
}
