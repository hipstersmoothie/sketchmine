export namespace Meta {

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
  
  export interface Variant {
    name: string;
    changes: (VariantMethod | VariantProperty)[];
  }

  export interface Component {
    className: string;
    component: string;
    location: string;
    clickable: boolean;
    hoverable: boolean;
    selector: string[];
    variants: Variant[];
  }

  export interface Result {
    version: string;
    components: { [key: string]: Component };
  }
}
