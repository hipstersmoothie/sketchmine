import { IBase } from '@sketch-draw/interfaces';

export interface IPage extends IBase{
  horizontalRulerData: IRulerData;
  includeInCloudUpload: boolean;
  verticalRulerData: IRulerData;
}

export interface IRulerData {
  _class: string;
  base: number;
  guides: any[];
}
