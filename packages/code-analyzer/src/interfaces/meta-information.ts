
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
  changes: (Method | Property)[];
}

export interface Property {
  type: 'property';
  key: string;
  value: string[];
}

export interface Method {
  type: 'method';
  key: string;
  parameters: Property[];
  returnType: any;
}
