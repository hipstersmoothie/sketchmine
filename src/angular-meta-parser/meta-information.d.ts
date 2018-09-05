/**
 * The outFile structure follows this interface
 */
export namespace MetaInformation {

  export interface Variant {
    name: string;
    changes: (VariantMethod | VariantProperty)[];
  }

  export interface VariantMethod {
    type: 'method';
    key: string;
    arguments: any[];
    returnType: any;
  }

  export interface VariantProperty {
    type: 'property';
    key: string;
    value: string;
  }

  export interface Component {
    className: string;
    location: string;
    selector: string[];
    variants: Variant[];
  }

}
