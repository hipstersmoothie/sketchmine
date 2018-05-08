import { Page } from "../interfaces/Page";
import { UUID } from "../helpers/UUID";


export class SketchPage {

  private static _objectID = UUID.generate();

  get objectID(): string { return SketchPage._objectID; }

  generateObject(): Page {
    return {
      _class: 'page',
      do_objectID: SketchPage._objectID,
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
        height: 300,
        width: 300,
        x: 0,
        y: 0
      },
      isFlippedHorizontal: false,
      isFlippedVertical: false,
      isLocked: false,
      isVisible: true,
      layerListExpandedType: 0,
      name: 'Symbols',
      nameIsFixed: false,
      resizingConstraint: 63,
      resizingType: 0,
      rotation: 0,
      shouldBreakMaskChain: false,
      style: {
        _class: 'style',
        endDecorationType: 0,
        miterLimit: 10,
        startDecorationType: 0
      },
      hasClickThrough: true,
      layers: [],
      horizontalRulerData: {
        _class: 'rulerData',
        base: -153,
        guides: []
      },
      includeInCloudUpload: true,
      verticalRulerData: {
        _class: 'rulerData',
        base: -290,
        guides: []
      }
    }
    
  }
}
