import { UUID } from "../helpers/UUID";
import { IBase, IExportOptions, IBounding, IFrame } from "../interfaces/Base";
import { IRulerData } from "../interfaces/Page";
import { IStyle } from "../interfaces/Style";

export class Base {

  private _objectID = UUID.generate();
  private _class = null;
  private _layers = [];
  private _style = null;
  private _bounding: IBounding;
  private _breakMaskChain = false;
  private _name = '';

  get objectID(): string { return this._objectID; }
  get layers() { return this._layers; }
  set layers(layers: any[]) { this._layers = layers; }
  set name(name: string) { this._name = name; }
  set class(name: string) { this._class = name; }  
  set breakMaskChain(br: boolean) { this._breakMaskChain = br; }
  set style(style: IStyle) { this._style = style; }
  set bounding(bounding: IBounding) { this._bounding = bounding }

  protected addFrame(name: string): IFrame {
    const obj: IFrame = {
      _class: name,
      constrainProportions: false,
      ...this._bounding
    };
    return this.addObjectID(obj);
  }

  protected addStyle(
    start: number = 0, 
    mitter: number = 10,
    end: number = 0): IStyle {
    const obj: IStyle = {
      _class: 'style',
      endDecorationType: end,
      miterLimit: mitter,
      startDecorationType: start
    }
    return this.addObjectID(obj);
  }


  protected addRuler(base: number = 0): IRulerData {
    return {
      _class: 'rulerData',
      base: base,
      guides: []
    }
  }

  private addExportOptions(): IExportOptions {
    const obj: IExportOptions = {
      _class: 'exportOptions',
      exportFormats: [],
      includedLayerIds: [],
      layerOptions: 0,
      shouldTrim: false
    }
    return this.addObjectID(obj);
  }

  private addObjectID(obj) {
    if (this._class !== 'symbolMaster' && 
        this._class !== 'page' ) {
      obj.do_objectID = UUID.generate();
    }
    return obj;
  }

  addLayer(layer) {
    if (layer instanceof Array) {
      this._layers.push(...layer);
      return;
    }
    this._layers.push(layer);
  }
  
  generateObject(): IBase {
    if (!this._class) {
      throw new Error('Class not set!');
    }

    return {
      _class: this._class,
      do_objectID: this._objectID,
      exportOptions: this.addExportOptions(),
      isFlippedHorizontal: false,
      isFlippedVertical: false,
      isLocked: false,
      isVisible: true,
      layerListExpandedType: 0,
      name: this._name || this._class,
      nameIsFixed: false,
      resizingConstraint: 63,
      resizingType: 0,
      rotation: 0,
      shouldBreakMaskChain: this._breakMaskChain,
      style: this._style ? this._style: undefined,
      layers: (this._layers.length > 0) ? this._layers: undefined
    };
  }
}
