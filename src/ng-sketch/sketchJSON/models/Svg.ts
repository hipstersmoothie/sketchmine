import { Base } from './Base';
import * as parseSVG from 'svg-path';
import { CurvePointMode } from '../helpers/sketchConstants';

export class Svg extends Base{

  private _width = 7;
  private _height = 23;

  // Returns the last curve-point (not the closing point)
  getLastCurvePoint(points: IPathDefinitionType[]): IPathDefinitionType {
    const last = points[points.length - 1];
    // if point is the closing point return previous
    if(last.type === 'Z' || last.type === 'z') {
      return points[points.length -2];
    }
    return last;
  }

  getNextCurvePoint(points: IPathDefinitionType[], index: number): IPathDefinitionType {
    const next = points[index+1];
    if (next && next.type !== 'Z') {
      return next;
    }
    return null;
  }

  generateObject(): any {
    // const pathData = `M0,25 C25,25 30,35 50,75 C63.3333333,101.666667 55,76.6666667 25,0 L0,25 Z`;
    const pathData = `M0,20.4696934 C0,20.4696934 1.59610849,8.17464623 2.71273585,2.43183962 C2.71273585,2.43183962 0.724646227,0.495518871 0.724646227,0 C1.93761793,0.626297171 3.36757076,0.671462261 3.36757076,0.671462261 C3.36757076,0.671462261 4.97370283,0.671462261 6.01049529,0 C6.01049529,0.459905661 4.01863208,2.43466981 4.01863208,2.43466981 C5.13867925,8.17464623 6.73455189,20.4696934 6.73455189,20.4696934 L3.36757076,22.8794812 L0,20.4696934 Z`;
    const path = parseSVG(pathData) as any;
    const resized = this.resizeCoordinates(path.content);

    console.log(JSON.stringify(resized, null, 2), '\n\n')

    const points: any[] = [];
    for (let i = 0, max = resized.length; i < max; i++) {
      const p: IPathDefinitionType = resized[i];
      const lastP: IPathDefinitionType = resized[i-1];
      const nextP: IPathDefinitionType = this.getNextCurvePoint(resized, i);


      if(p.type == 'M') {
        continue;
      }

      const base = {
        _class: 'curvePoint',
        cornerRadius: 0,
        curveMode: CurvePointMode.Disconnected,
      }
      const prevLastP = this.getLastCurvePoint(resized);
      const hasCurveTo = prevLastP.type == 'C';
      const hasCurveFrom = p.type == 'C';
      
      // First Point
      if (lastP && lastP.type == 'M') {
        // start with curve
        if (p.type == 'C') {
         points.push({
            ...base,
            curveFrom: `{${p.x1}, ${p.y1}}`,
            curveTo: `{${lastP.x}, ${lastP.y}}`, // curve to start
            hasCurveTo: hasCurveTo,
            hasCurveFrom: hasCurveFrom,
            point: `{${lastP.x}, ${lastP.y}}`,
          });
        }

        // start with straight line
        if (p.type == 'L') {
          points.push({
            ...base,
            curveFrom: `{${lastP.x}, ${lastP.y}}`,
            curveMode: CurvePointMode.Straight,
            curveTo: `{${lastP.x}, ${lastP.y}}`, // curve to start
            hasCurveTo: hasCurveTo,
            hasCurveFrom: hasCurveFrom,
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
          curveFrom: `{${lastP.x}, ${lastP.y}}`,
          curveMode: CurvePointMode.Straight,
          curveTo: `{${lastP.x}, ${lastP.y}}`, // curve to start
          hasCurveTo: hasCurveTo,
          hasCurveFrom: hasCurveFrom,
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

      if (lastP && lastP.type == 'L' && p.type == 'L') {
        points.push({
          ...base,
          curveFrom: `{${lastP.x}, ${lastP.y}}`,
          curveMode: CurvePointMode.Straight,
          curveTo: `{${lastP.x}, ${lastP.y}}`, // curve to start
          hasCurveTo: hasCurveTo,
          hasCurveFrom: hasCurveFrom,
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
