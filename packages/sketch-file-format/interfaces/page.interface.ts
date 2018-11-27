import { SketchBase } from './base.interface';
import { SketchRulerData } from './ruler-data.interface';

export interface SketchPage extends SketchBase {
  includeInCloudUpload: boolean;
  horizontalRulerData: SketchRulerData;
  verticalRulerData: SketchRulerData;
}
