export interface ISvgPoint {
  code: string;
  command: string;
  relative?: boolean;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x0?: number;
  y0?: number;
}

// was used with svg-path library
// export interface ISvgPath {
//   content: ISvgPoint[];
// }
