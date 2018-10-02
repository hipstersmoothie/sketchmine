import { SketchObjectTypes } from './base.interface';
import { BlurType } from '../helpers';

export interface SketchBlur {
  _class: SketchObjectTypes.Blur;
  isEnabled: boolean;
  center: string;
  motionAngle: number;
  radius: number;
  type: BlurType;
}
