import { Base } from './Base';
import * as svgPath from 'svg-path';

export class Svg extends Base{

  private _width = 302;
  private _height = 76;

  generateObject(): any {
    const pathData = `M0,75 C0,-25 300,-25 300,75`;//'M0,25 C25,25 30,35 50,75 C63.3333333,101.666667 55,76.6666667 25,0 L0,25 Z';
    const path = svgPath(pathData) as IPathDefinition;
    this.resizeCoordinates(path.content);
    console.log(JSON.stringify(path, null, 2), '\n\n')


    const points: any[] = [];
    const resized = path.content;
    // delete resized[0];
    // delete resized[resized.length-1]
    for (let i = 0, max = resized.length; i < max; i++) {
      const p: IPathDefinitionType = resized[i];
      const nextP: IPathDefinitionType = resized[i+1];

      const point = {
        // type: p.type, 
        _class: 'curvePoint',
        curveMode: 4,
        cornerRadius: 0,
        curveFrom: `{${p.x}, ${p.y}}`,
        curveTo: `{${p.x}, ${p.y}}`,
        hasCurveTo: false,
        hasCurveFrom: false,
        point: `{${p.x}, ${p.y}}`,
      }

      // Starting Point of a Shape (Move to)
      if (p.type == 'M') {
        point.hasCurveFrom = true;
      }
      // Curve to
      if (nextP && nextP.type == 'C') {
        point.hasCurveTo = true;
        point.curveTo = `{${nextP.x1}, ${nextP.y1}}`;
      }
      // Curve point
      if (p.type == 'C') {
        const lastP = resized[i-1]; // curve has to start with M
        point.hasCurveFrom = true;
        point.curveFrom = `{${p.x2}, ${p.y2}}`;
      }

      points.push(point);
    }

    console.log(JSON.stringify(points, null, 2))


    return   {
      _class: 'shapePath',
      do_objectID: 'FA7B994C-8B5D-4C7C-A527-D581BBB1D96B',
      exportOptions: {
        _class: 'exportOptions',
        exportFormats: [],
        includedLayerIds: [],
        layerOptions: 0,
        shouldTrim: false
      },
      frame: {
        _class: 'rect',
        constrainProportions: false,
        height: this._height,
        width: this._width,
        x: 0,
        y: 0
      },
      isFlippedHorizontal: false,
      isFlippedVertical: false,
      isLocked: false,
      isVisible: true,
      layerListExpandedType: 0,
      name: 'Path',
      nameIsFixed: false,
      resizingConstraint: 63,
      resizingType: 0,
      rotation: 0,
      shouldBreakMaskChain: false,
      booleanOperation: -1,
      edited: true,
      isClosed: true,
      pointRadiusBehaviour: 1,
      points
    } 

    
  }


  generatePoint(p: IPathDefinitionType) {


    const curveMode = 1;

    const point = {
      _class: 'curvePoint',
      cornerRadius: 0,
      curveFrom: (p.x1 && p.y1)? `{${p.x1}, ${p.y1}}`:`{${p.x}, ${p.y}}`,
      curveMode: 4,
      curveTo: (p.x2 && p.y2)? `{${p.x2}, ${p.y2}}`:`{${p.x}, ${p.y}}`,
      hasCurveFrom: !!(p.x1 && p.y1),
      hasCurveTo: !!(p.x2 && p.y2),
      point: `{${p.x}, ${p.y}}`,
    }

    // if  {
    //   point.point = ;
    // }

    // poi
    // console.log(point);
    return point;
  }


  resizeCoordinates(pathDefinition: IPathDefinitionType[]): IPathDefinitionType[] {
    pathDefinition.forEach(point => {
      point.x = point.x/this._width;
      point.y = point.y/this._height;
      if (point.x1) {
        point.x1 = point.x1/this._width;
      }
      if (point.x2) {
        point.x2 = point.x2/this._width;
      }
      if (point.y1) {
        point.y1 = point.y1/this._height;
      }
      if (point.y2) {
        point.y2 = point.y2/this._height;
      }
    });

    return pathDefinition;
  }
  
}
// export const CurvePointMode = {
//   Straight: 1,
//   Mirrored: 2,
//   Disconnected: 4,
//   Asymmetric: 3
// };


export interface IPathDefinition {
  content: IPathDefinitionType[];
}

export interface IPathDefinitionType {
  type: string;
  relative?: boolean;
  x: number;
  y: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}
