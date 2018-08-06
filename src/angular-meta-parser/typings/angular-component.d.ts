export namespace acmp {

  interface FileInformation {
    path: string;
    basename: string;
    extension: string;
    fullpath: string;
  }

  interface TypeInformation {
    name: string;
    value: string[];
  }

  type changesType = 'property' | 'method';

  interface Component {
    name: string;
    selector: string;
    exportAs: string;
    variants: Variant[];
    inputs?: string[];
  }

  interface Meta {
    selector: string;
    exportAs: string;
    inputs?: string[];
  }

  interface Variant {
    name: string;
    changes: Changes[];
  }

  interface Changes {
    type: changesType;
    name: string;
    value?: string | string[];
    arguments?: any[];
  }

  interface Parameters {
    name: string;
    type: string;
  }

  interface Accessor {
    type: 'SetAccessor';
    name: string;
    params: Parameters[];
  }
}
