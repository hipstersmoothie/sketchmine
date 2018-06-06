import { ISymbolMaster, IBackgroundColor } from '../interfaces/SymbolMaster';
import { Base } from './Base';
import { IBounding, IBase } from '../interfaces/Base';

export class SymbolMaster extends Base {

  constructor(bounding: IBounding) {
    super();
    super.class = 'symbolMaster';
    super.breakMaskChain = true;
    super.style = super.addStyle();
    super.bounding = bounding;
  }

  private addBackgroundColor(): IBackgroundColor {
    return {
      _class: 'color',
      alpha: 1,
      blue: 1,
      green: 1,
      red: 1,
    };
  }

  generateObject(): any {
    const base: IBase = super.generateObject();
    return {
      ...base,
      frame: super.addFrame('rect'),
      hasClickThrough: false,
      backgroundColor: this.addBackgroundColor(),
      hasBackgroundColor: false,
      horizontalRulerData: super.addRuler(),
      includeBackgroundColorInExport: true,
      includeInCloudUpload: true,
      isFlowHome: false,
      resizesContent: false,
      verticalRulerData: super.addRuler(),
      includeBackgroundColorInInstance: false,
      symbolID: 'ADA677BF-506E-4E73-AB94-E4E132D5C34B',
      changeIdentifier: 3,
    };
  }
}
