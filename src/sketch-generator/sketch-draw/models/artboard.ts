import { Base } from '@sketch-draw/models/base';
import { IBounding, IBase, SketchArtboard, IColor } from '@sketch-draw/interfaces';
import { BooleanOperation } from '@sketch-draw/helpers/sketch-constants';

export class Artboard extends Base {

  constructor(bounding: IBounding) {
    super();
    super.className = 'artboard';
    super.breakMaskChain = true;
    super.style = super.addStyle();
    super.bounding = bounding;
  }

  private addBackgroundColor(): IColor {
    return {
      _class: 'color',
      alpha: 1,
      blue: 1,
      green: 1,
      red: 1,
    };
  }

  generateObject(): SketchArtboard {
    const base: IBase = super.generateObject();
    return {
      ...base,
      frame: super.addFrame('rect'),
      hasClickThrough: false,
      backgroundColor: this.addBackgroundColor(),
      booleanOperation: BooleanOperation.None,
      hasBackgroundColor: false,
      horizontalRulerData: super.addRuler(),
      includeBackgroundColorInExport: true,
      includeInCloudUpload: true,
      isFlowHome: false,
      isFixedToViewport: false,
      resizesContent: false,
      verticalRulerData: super.addRuler(),
      style: {
        _class: 'style',
        endMarkerType: 0,
        miterLimit: 10,
        startMarkerType: 0,
        windingRule: 1,
      },
    };
  }
}
