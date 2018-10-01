import { SketchArtboardStyle, IBase } from './base.interface';
import { IRulerData } from './page.interface';
import { BooleanOperation } from '../helpers/sketch-constants';
import { IColor } from './style.interface';

export interface SketchArtboard extends IBase {
  booleanOperation: BooleanOperation;
  isFixedToViewport: boolean;
  style: SketchArtboardStyle;
  backgroundColor: IColor;
  hasBackgroundColor: boolean;
  horizontalRulerData: IRulerData;
  includeBackgroundColorInExport: boolean;
  includeInCloudUpload: boolean;
  isFlowHome: boolean;
  resizesContent: boolean;
  verticalRulerData: IRulerData;
}
