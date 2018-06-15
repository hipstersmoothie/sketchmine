import { IRulerData } from './page.interface';
import { IBase } from './base.interface';

export interface ISymbolMaster extends IBase {
  backgroundColor: IBackgroundColor;
  hasBackgroundColor: boolean;
  horizontalRulerData: IRulerData;
  includeBackgroundColorInExport: boolean;
  includeInCloudUpload: boolean;
  isFlowHome: boolean;
  resizesContent: boolean;
  verticalRulerData: IRulerData;
  includeBackgroundColorInInstance: boolean;
  symbolID: string;
  changeIdentifier: number;
}

export interface IBackgroundColor {
  _class: string;
  alpha: number;
  blue: number;
  green: number;
  red: number;
}
