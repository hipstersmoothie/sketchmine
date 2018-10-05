import { SketchBase } from './base.interface';
import { SketchColor } from './color.interface';
import { SketchRulerData } from './ruler-data.interface';

export interface SketchSymbolMaster extends SketchBase {
  backgroundColor: SketchColor;
  hasBackgroundColor: boolean;
  horizontalRulerData: SketchRulerData;
  includeBackgroundColorInExport: boolean;
  includeInCloudUpload: boolean;
  isFlowHome: boolean;
  resizesContent: boolean;
  verticalRulerData: SketchRulerData;
  includeBackgroundColorInInstance: boolean;
  symbolID: string;
  changeIdentifier: number;
}
