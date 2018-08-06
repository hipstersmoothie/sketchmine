import { acmp } from '../typings/angular-component';
import { access } from 'fs';
import { TypeInformation } from './type-information';

const enum Accessors {
  SetAccessor = 'SetAccessor',
}

export class AngularComponent {

  protected _fileInfo: acmp.FileInformation;
  private _variants: acmp.Accessor[] = [];
  private _types = new TypeInformation().types;
  name: string;
  meta: acmp.Meta;

  get filename() { return this._fileInfo.fullpath; }

  constructor(fileInfo: acmp.FileInformation) {
    this._fileInfo = fileInfo;
  }

  addMeta(meta: acmp.Meta) {
    this.meta = meta;
  }

  addVariant(variant: any) {
    this._variants.push(variant);
  }

  generate(): acmp.Component {
    return {
      ...this.meta,
      name: this.name,
      variants: this.generateVariants(),
    };
  }

  private generateVariants(): any {
    const variants: acmp.Variant[] = [];
    this._variants.forEach((accessor) => {

      if (accessor.type === Accessors.SetAccessor) {
        accessor.params.forEach((param) => {
          const type = this._types.find(ti => ti.name === param.type);
          type.value.forEach((varient) => {
            variants.push({
              name: `${this.meta.exportAs}-${accessor.name}-${varient}`,
              changes: [{
                type: 'property',
                name: accessor.name,
                value: varient,
              }],
            });
          });

        });
      }
    });
    return variants;
  }
}
