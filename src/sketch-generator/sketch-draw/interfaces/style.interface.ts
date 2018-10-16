import { SketchFill } from './fill.interface';
import { SketchGraphicsContext } from './graphics-context.interface';
import { SketchShadow } from './shadow.interface';
import { SketchBorder } from './border.interface';
import { SketchBlur } from './blur.interface';
import { SketchInnerShadow } from './inner-shadow.interface';
import { SketchTextStyle } from './text-style.interface';

export interface SketchStyle {
  _class: string;
  blur?: SketchBlur;
  borders?: SketchBorder[];
  contextSettings?: SketchGraphicsContext;
  endMarkerType: number; // 0
  fills?: SketchFill[];
  innerShadows?: SketchInnerShadow[];
  miterLimit: number;
  shadows?: SketchShadow[];
  sharedObjectID?: string;
  startMarkerType: number;
  textStyle?: SketchTextStyle;
  windingRule: number;
}

export interface SketchLocalSharedStyle {
  _class: 'sharedStyle';
  do_objectID: string;
  name: string;
  value: SketchStyle;
}
