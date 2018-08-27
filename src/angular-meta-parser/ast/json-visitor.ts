import { arrayFlatten, camelCaseToKebabCase } from '@utils';
import { MetaInformation } from '../meta-information';
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

/**
 * Merge members from implement or extend with the original members of a component
 * @param originalMembers Array of Object with {key: any, value: any}
 * @param toBeMerged
 * @returns
 */
export function mergeClassMembers(originalMembers: any[], toBeMerged: any[]): any[] {
  if (!toBeMerged.length) {
    return originalMembers;
  }
  const result = originalMembers;
  toBeMerged.forEach((member) => {
    const index = result.findIndex(m => m.key === member.key);
    /** property exists in original Members */
    if (index > -1) {
      /** value is null and can be replaced with new results */
      if (result[index].value === null || result[index].value.length === 0) {
        result[index].value = member.value;
      } else { /** value exists so make an array and merege them */
        const value = Array.isArray(member.value) ?
          [result[index].value, ...member.value] :  [result[index].value, member.value];
        /** make set to delete duplicates */
        result[index].value = Array.from(new Set(value));
      }
    } else { /** if the property does not exist in the original object just add it. */
      result.push(member);
    }
  });
  return result;
}

/**
 * generates the changes from the variants with unique names that represent
 * the value and the key of the change
 * @param variants Array of Variants
 * @param className needed for the variant name
 */
export function generateVariants(variants: any, className: string): MetaInformation.Variant[] {
  const result: MetaInformation.Variant[] = [];
  const baseName = camelCaseToKebabCase(className);

  variants.forEach((variant) => {
    variant.value.forEach((val: string) => {
      let nameValue = '';
      /** if the value is a boolean true then the key is enought and no value is needed */
      if (val !== 'true') {
        nameValue = `-${val.toString().replace(/\"/g, '')}`;
      }
      result.push({
        name: `${baseName}-${variant.key}${nameValue}`,
        changes: [{
          type: variant.type,
          key: variant.key,
          value: val,
        }],
      });
    });
  });

  return result;
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
  visitProperty(node: ParseProperty): any {
    return {
      type: 'property',
      key: node.name,
      value: node.values,
    };
  }
  visitComponent(node: ParseComponent): any {
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
      selector: node.selector,
      clickable: node.clickable,
      hoverable: node.hoverable,
      variants: componentMembers,
    };
  }

  visitResult(node: ParseResult): MetaInformation.Component[] {
    const nodes = this.visitAll(node.nodes)
      .filter(node => node.className);

    /** modify variants and split every value as own variety */
    nodes.forEach(node => node.variants = generateVariants(node.variants, node.className));
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
  const exitTags: NodeTags[] = ['internal', 'unrelated', 'private', 'hasUnderscore'];
  if (node instanceof ParseDefinition) {
    return !!exitTags.find(tag => node.tags.includes(tag));
  }
  return false;
}
