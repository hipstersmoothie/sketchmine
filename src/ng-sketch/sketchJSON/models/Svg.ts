import { Base } from './Base';
import * as parseSVG from 'svg-path';
import { CurvePointMode } from '../helpers/sketchConstants';

export class Svg extends Base{

  private _width = 57;
  private _height = 86;

  generateObject(): any {
    const pathData = `M0,25 C25,25 30,35 50,75 C63.3333333,101.666667 55,76.6666667 25,0 L0,25 Z`;
    const path = parseSVG(pathData) as any;
    const resized = this.resizeCoordinates(path.content);

    console.log(JSON.stringify(resized, null, 2), '\n\n')

    const points: any[] = [];
    for (let i = 0, max = resized.length; i < max; i++) {
      const p: IPathDefinitionType = resized[i];
      const lastP: IPathDefinitionType = resized[i-1];

      if(p.type == 'M') {
        continue;
      }

      const base = {
        _class: 'curvePoint',
        cornerRadius: 0,
        curveMode: CurvePointMode.Disconnected,
      }
      
      if (lastP && lastP.type == 'M') {
        if (p.type == 'C') {
         points.push({
            ...base,
            curveFrom: `{${p.x1}, ${p.y1}}`,
            curveTo: `{${lastP.x}, ${lastP.y}}`, // curve to start
            hasCurveTo: false,
            hasCurveFrom: true,
            point: `{${lastP.x}, ${lastP.y}}`,
          });
        }
      }

      if (lastP && lastP.type == 'C' && p.type == 'C') {
        points.push({
          ...base,
          curveFrom: `{${p.x1}, ${p.y1}}`,
          curveTo: `{${lastP.x2}, ${lastP.y2}}`,
          hasCurveTo: true,
          hasCurveFrom: true,
          point: `{${lastP.x}, ${lastP.y}}`,
        });
      }

      if(lastP && lastP.type == 'C' && p.type == 'L') {
        points.push({
          ...base,
          curveTo: `{${lastP.x2}, ${lastP.y2}}`,
          hasCurveFrom: false,
          hasCurveTo: true,
          point: `{${lastP.x}, ${lastP.y}}`,
        });
      }

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

  resizeCoordinates(pathDefinition: IPathDefinitionType[]): IPathDefinitionType[] {
    pathDefinition.forEach(point => {
      point.x = point.x/this._width;
      point.y = point.y/this._height;
      if (point.x1) { point.x1 = point.x1/this._width; }
      if (point.x2) { point.x2 = point.x2/this._width; }
      if (point.y1) { point.y1 = point.y1/this._height; }
      if (point.y2) { point.y2 = point.y2/this._height; }
    });
    return pathDefinition;
  }
  
}

export interface IPathDefinitionType {
  type: string;
  relative?: boolean;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}
