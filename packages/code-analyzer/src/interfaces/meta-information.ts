
/**
 * The outFile structure follows this interface
 */

export interface Library {
  version: string;
  components: Component[];
}

export interface ComponentDecorator {
  selector: string;
  exportAs?: string;
}

export interface Component {
  name: string;
  component: string;
  selector: string[];
  angularComponent: boolean;
  decorator: ComponentDecorator;
  members: (Method | Property)[];
  combinedVariants?: boolean; // defines if the variants are combined or not
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
