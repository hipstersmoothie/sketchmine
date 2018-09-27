import { UUID } from '@sketch-draw/helpers/uuid';
import { IBase, IExportOptions, IBounding, IFrame, IRulerData, IStyle } from '@sketch-draw/interfaces';
import { resolveTransform } from '@sketch-draw/helpers/resolve-transform';

export class Base {

  readonly objectID = UUID.generate();
  name = '';
  layers = [];
  breakMaskChain = false;
  style;
  bounding: IBounding;
  className: string;
  rotation = 0;

  addFrame(name: string): IFrame {
    return {
      _class: name,
      constrainProportions: false,
      ...this.bounding,
    };
  }

  addRotation(transformStyle: string) {
    this.rotation = -resolveTransform(transformStyle).angle;
  }

  addStyle(start: number = 0, mitter: number = 10, end: number = 0): IStyle {
    return {
      _class: 'style',
      endDecorationType: end,
      miterLimit: mitter,
      startDecorationType: start,
    };
  }

  addRuler(base: number = 0): IRulerData {
    return {
      _class: 'rulerData',
      base,
      guides: [],
    };
  }

  private addExportOptions(): IExportOptions {
    return {
      _class: 'exportOptions',
      exportFormats: [],
      includedLayerIds: [],
      layerOptions: 0,
      shouldTrim: false,
    };
  }

  addLayer(layer) {
    if (layer instanceof Array) {
      this.layers.push(...layer);
      return;
    }
    this.layers.push(layer);
  }

  generateObject(): IBase {
    if (!this.className) {
      throw new Error('Class not set!');
    }

    return {
      _class: this.className,
      do_objectID: this.objectID,
      exportOptions: this.addExportOptions(),
      isFlippedHorizontal: false,
      isFlippedVertical: false,
      isLocked: false,
      isVisible: true,
      layerListExpandedType: 0,
      name: this.name || this.className,
      nameIsFixed: false,
      resizingConstraint: 63,
      resizingType: 0,
      rotation: this.rotation,
      shouldBreakMaskChain: this.breakMaskChain,
      style: this.style ? this.style : undefined,
      layers: (this.layers.length > 0) ? this.layers : undefined,
    };
  }
}
