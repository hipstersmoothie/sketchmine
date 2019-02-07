export class ParseLocation {
  /**
   * The Position in the typescript source file of a node.
   * Is used as unique identifier for the node.
   */
  constructor(public path: string, public position: number) {}
}
