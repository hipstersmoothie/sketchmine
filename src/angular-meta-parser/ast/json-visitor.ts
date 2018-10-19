import { arrayFlatten, camelCaseToKebabCase } from '@utils';
import { AMP } from '../meta-information';
import { NullVisitor, AstVisitor } from './ast-visitor';
import { NodeTags, ParseDefinition } from './parse-definition';
import { ParseValueType } from './parse-value-type';
import { ParsePrimitiveType } from './parse-primitive-type';
import { ParseUnionType } from './parse-union-type';
import { ParseProperty } from './parse-property';
import { ParseComponent } from './parse-component';
import { ParseResult } from './parse-result';
import { ParseNode } from './parse-node';
import { ParseInterface } from './parse-interface';
import { mergeClassMembers, variantCombinationGenerator, generateVariants } from '../utils';

const EXIT_TAGS: NodeTags[] = ['internal', 'unrelated', 'private', 'hasUnderscore'];

export interface Property {
  type: 'property';
  key: string;
  value: string[];
}

/**
 * Generates the final JSON that is written to a file from the
 * generated AST.
 */
export class JSONVisitor extends NullVisitor implements AstVisitor {
  /**
   * Need to visit Interfaces, because components can implement interfaces
   * @param node ParseInterface
   */
  visitInterface(node: ParseInterface): any {
    const members = this.visitAll(node.members);
    return {
      name: node.name,
      members,
    };
  }
  visitValueType(node: ParseValueType): string { return node.value; }
  visitPrimitiveType(node: ParsePrimitiveType): any { return node.type; }

  visitUnionType(node: ParseUnionType): any[] {
    return arrayFlatten(this.visitAll(node.types));
  }
  visitProperty(node: ParseProperty): Property {
    return {
      type: 'property',
      key: node.name,
      value: node.values,
    };
  }
  visitComponent(node: ParseComponent): AMP.Component {
    const extending = this.visitAll(node.extending)
      .map(ext => ext.variants);
    const implementing = this.visitAll(node.implementing)
      .filter(impl => impl.members.length)
      .map(impl => impl.members);

    let componentMembers = mergeClassMembers(this.visitAll(node.members), arrayFlatten(implementing));
    /** merge the extends from the heritageClause */
    componentMembers = mergeClassMembers(componentMembers, arrayFlatten(extending));

    return {
      className: node.name,
      /** @example https://regex101.com/r/YduQlF/1 */
      component: /.+?\/([^\/]+?).ts$/.exec(node.location.path)[1],
      location: node.location.path,
      selector: node.selector,
      clickable: node.clickable,
      hoverable: node.hoverable,
      properties: componentMembers.map(prop => prop.key),
      variants: componentMembers,
      combinedVariants: node.combinedVariants,
    };
  }

  visitResult(node: ParseResult): AMP.Component[] {
    const nodes = this.visitAll(node.nodes)
      .filter(node => node.className);

    /** modify variants and split every value as own variety */
    nodes.forEach((node) => {
      if (node.combinedVariants) {
        node.variants = variantCombinationGenerator(node.component, ...node.variants);
      } else {
        node.variants = generateVariants(node.component, node.variants);
      }
    });
    return nodes;
  }

  visitAll(nodes: ParseNode[], debug = false): any[] {
    const result = [];
    nodes.forEach((node: any) => {
      if (node && node.visit && !hasExitCondition(node)) {
        const n = node.visit(this);
        if (n) result.push(n);
      }
    });
    return result;
  }
}

/**
 * check if node has exit condition if it has one return true
 * @param node Node
 */
function hasExitCondition(node: ParseNode): boolean {
  if (node instanceof ParseDefinition) {
    return !!EXIT_TAGS.find(tag => node.tags.includes(tag));
  }
  return false;
}
