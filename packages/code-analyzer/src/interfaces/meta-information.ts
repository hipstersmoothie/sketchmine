
/**
 * The outFile structure follows this interface
 */

export interface ComponentsList {
  version: string;
  components: { [key: string]: Component };
}

export interface Component {
  className: string;
  component: string;
  location: string;
  clickable: boolean;
  hoverable: boolean;
  selector: string[];
  properties: string[];
  variants: Variant[];
  combinedVariants: boolean; // defines if the variants are combined or not
}

export interface Variant {
  name: string;
  changes: (VariantMethod | VariantProperty)[];
}

export interface Property {
  type: 'property';
  key: string;
  value: string[];
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
