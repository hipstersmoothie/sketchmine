/**
 * The outFile structure follows this interface
 */
export namespace MetaInformation {

  export interface Varient {
    name: string;
    changes: (VarientMethod | VarientProperty)[];
  }

  export interface VarientMethod {
    type: 'method';
    key: string;
    arguments: any[];
    returnType: any;
  }

  export interface VarientProperty {
    type: 'property';
    key: string;
    value: string[] | string;
  }

  export interface Component {
    className: string;
    selector: string[];
    variants: Varient[];
  }

}
