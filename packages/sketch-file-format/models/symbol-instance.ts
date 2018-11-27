import { SketchBase, IBounding, SketchObjectTypes, SketchSymbolInstance } from '../interfaces';
import { Base } from './base';

export class SymbolInstance extends Base {

  clippingMask = false;
  scale = 1;
  verticalSpacing = 0;
  constructor(bounding: IBounding, public symbolID) {
    super(bounding);
    super.className = SketchObjectTypes.SymbolInstance;
  }

  generateObject(): SketchSymbolInstance {
    const base: SketchBase = super.generateObject();
    return {
      ...base,
      frame: super.addFrame(),
      hasClickThrough: false,
      clippingMaskMode: 0,
      hasClippingMask: this.clippingMask,
      overrideValues: [],
      scale: this.scale,
      symbolID: this.symbolID,
      verticalSpacing: this.verticalSpacing,
    };
  }
}
