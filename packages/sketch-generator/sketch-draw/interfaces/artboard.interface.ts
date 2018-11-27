import { SketchBase } from './base.interface';
import { BooleanOperation } from '../helpers/sketch-constants';
import { SketchColor } from './color.interface';
import { SketchRulerData } from './ruler-data.interface';

export interface SketchArtboard extends SketchBase {
  backgroundColor: SketchColor;
  booleanOperation: BooleanOperation;
  hasBackgroundColor: boolean;
  horizontalRulerData: SketchRulerData;
  includeBackgroundColorInExport: boolean;
  includeInCloudUpload: boolean;
  isFixedToViewport: boolean;
  isFlowHome: boolean;
  resizesContent: boolean;
  verticalRulerData: SketchRulerData;
}
