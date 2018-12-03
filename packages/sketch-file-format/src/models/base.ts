import { UUID } from '@sketchmine/helpers';
import { resolveTransform } from '../helpers/resolve-transform';
import {
  IBounding,
  SketchFrame,
  SketchRulerData,
  SketchExportOptions,
  SketchObjectTypes,
  SketchStyle,
  SketchBase,
} from '../interfaces';

export class Base {
  objectID = UUID.generate();
  layers = [];
  breakMaskChain = false;
  name: string;
  style: SketchStyle;
  className: SketchObjectTypes;
  private rotation = 0;

  constructor(public bounding: IBounding) {}

  addFrame(): SketchFrame {
    return {
      _class: SketchObjectTypes.Frame,
      constrainProportions: false,
      ...this.bounding,
    };
  }

  addRotation(transformStyle: string) {
    if (transformStyle !== 'none') {
      this.rotation = -resolveTransform(transformStyle).angle;
    }
  }

  addRuler(base: number = 0): SketchRulerData {
    return {
      _class: SketchObjectTypes.RulerData,
      base,
      guides: [],
    };
  }

  private addExportOptions(): SketchExportOptions {
    return {
      _class: SketchObjectTypes.ExportOptions,
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

  generateObject(): SketchBase {
    if (!this.className) {
      throw new Error(`Property _class has not been set on ${this.name}`);
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
      layers: this.layers.length ? this.layers : undefined,
      name: this.name || this.className,
      nameIsFixed: false,
      resizingConstraint: 63,
      resizingType: 0,
      rotation: this.rotation,
      shouldBreakMaskChain: this.breakMaskChain,
      style: this.style ? this.style : undefined,
    };
  }
}
