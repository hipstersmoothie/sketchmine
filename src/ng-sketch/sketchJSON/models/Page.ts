import { IPage } from "../interfaces/Page";
import { UUID } from "../helpers/UUID";
import { SymbolMaster } from "./SymbolMaster";
import { Base } from "./Base";
import { IBounding, IBase } from "../interfaces/Base";


export class Page extends Base {

  constructor(bounding: IBounding) {
    super()
    super.class = 'page';
    super.name = 'Symbols';
    super.style = super.addStyle();
    super.bounding = bounding;
  }

  generateObject(): IPage {
    const base: IBase = super.generateObject();

    return {
      ...base,
      frame: super.addFrame('rect'),
      hasClickThrough: true,
      horizontalRulerData: super.addRuler(-153),
      includeInCloudUpload: true,
      verticalRulerData: super.addRuler(-290)
    }
    
  }
}
