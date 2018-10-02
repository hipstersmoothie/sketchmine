import { Base } from './base';
import { IBounding, SketchColor, SketchArtboard, SketchBase, SketchObjectTypes } from '../interfaces';
import { BooleanOperation } from '../helpers';
import { Style } from './style';

export class Artboard extends Base {

  constructor(bounding: IBounding) {
    super(bounding);
    super.className = SketchObjectTypes.Artboard;
    super.breakMaskChain = true;
    super.style = new Style().generateObject();
  }

  generateObject(): SketchArtboard {
    const base: SketchBase = super.generateObject();
    return {
      ...base,
      frame: super.addFrame(),
      hasClickThrough: false,
      backgroundColor: addBackgroundColor(),
      booleanOperation: BooleanOperation.None,
      hasBackgroundColor: false,
      horizontalRulerData: super.addRuler(),
      includeBackgroundColorInExport: true,
      includeInCloudUpload: true,
      isFlowHome: false,
      isFixedToViewport: false,
      resizesContent: false,
      verticalRulerData: super.addRuler(),
    };
  }
}

export function addBackgroundColor(): SketchColor {
  return {
    _class: SketchObjectTypes.Color,
    alpha: 1,
    blue: 1,
    green: 1,
    red: 1,
  };
}
