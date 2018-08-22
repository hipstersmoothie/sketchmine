import {
  ParseNode,
  ParseDependency,
  ParseValueType,
  ParseDefinition,
  ParsePrimitiveType,
  ParseReferenceType,
  ParseFunctionType,
  ParseSimpleType,
  ParseUnionType,
  ParseProperty,
  ParseInterface,
  ParseResult,
  ParseTypeAliasDeclaration,
  ParseArrayType,
  ParseComponent,
  AstVisitor,
} from './index';
import { arrayFlatten, camelCaseToKebabCase } from '@utils';

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
    // property exists in original Members
    if (index > -1) {
      // value is null and can be replaced with new results
      if (result[index].value === null) {
        result[index].value = member.value;
      } else { // value exists so make an array and merege them
        const value = Array.isArray(member.value) ? 
          [result[index].value, ...member.value] :  [result[index].value, member.value];
        // make set to delete duplicates
        result[index].value = Array.from(new Set(value));
      }
    } else { // if the property does not exist in the original object just add it.
      result.push(member);
    }
  });
  return result;
}

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

export function generateVariants(variants: any, className: string): Varient[] {
  const result: Varient[] = [];
  const baseName = camelCaseToKebabCase(className);

  variants.forEach((varient) => {
    if (!Array.isArray(varient.value)) {
      const val = `${varient.value}`;
      result.push({
        name: `${baseName}-${varient.key}-${val.replace(/\"/g, '')}`,
        changes: [varient],
      });
    } else {
      varient.value.forEach((val: string) => {
        result.push({
          name: `${baseName}-${varient.key}-${val.replace(/\"/g, '')}`,
          changes: [{
            type: varient.type,
            key: varient.key,
            value: val,
          }],
        });
      });
    }
  });

  return result;
}

/**
 * Generates the final JSON that is written to a file from the
 * generated AST.
 */
export class JSONVisitor implements AstVisitor {
  // We don't care about dependencies, interfaces and type declarations
  // in case we resolved them earlier with our transformer
  visitNode(node: ParseNode): null { return null; }
  visitDependency(node: ParseDependency): null { return null; }
  visitDefinition(node: ParseDefinition): null { return null; }
  visitSimpleType(node: ParseSimpleType): null { return null; }

  visitValueType(node: ParseValueType): string {
    switch (typeof node.value) {
      case 'string':
      case 'number':
        return `\"${node.value}\"`;
    }
    return node.value;
  }
  visitPrimitiveType(node: ParsePrimitiveType): any { return node.type; }
  visitReferenceType(node: ParseReferenceType): string { return `ParseReference< ${node.name}>`; }
  visitArrayType(node: ParseArrayType): string { return node.name; }
  visitFunctionType(node: ParseFunctionType): any {
    const args = this.visitAll(node.args);
    const returnType = node.returnType ? node.returnType.visit(this) : null;
    return {
      type: 'method',
      name: '',
      arguments: args,
      returnType,
    };
  }
  visitUnionType(node: ParseUnionType): any[] {
    return arrayFlatten(this.visitAll(node.types));
  }
  visitProperty(node: ParseProperty): any {
    const value = node.type ? node.type.visit(this) : null;
    if (value && value.type === 'method') {
      value.name = node.name;
      return value;
    }
    return {
      type: 'property',
      key: node.name,
      value,
    };
  }
  visitTypeAliasDeclaration(node: ParseTypeAliasDeclaration): any {
    return node.type ? node.type.visit(this) : null;
  }
  visitInterface(node: ParseInterface): any {
    const members = this.visitAll(node.members);
    return {
      name: node.name,
      members,
    };
  }
  visitComponent(node: ParseComponent): any {
    const extending = this.visitAll(node.extending)
      .map(ext => ext.variants);
    const implementing = this.visitAll(node.implementing)
      .filter(impl => impl.members.length)
      .map(impl => impl.members);

    let componentMembers = mergeClassMembers(this.visitAll(node.members), arrayFlatten(implementing));
    // merge the extends from the heritageClause
    componentMembers = mergeClassMembers(componentMembers, arrayFlatten(extending));

    return {
      className: node.name,
      selector: node.selector,
      variants: componentMembers,
    };
  }
  visitResult(node: ParseResult): any {
    const nodes = this.visitAll(node.nodes)
      .filter(node => node.className);

    // modify varients and split every value as own variety
    // nodes.forEach(node => node.variants = generateVariants(node.variants, node.className));
    return nodes;
  }

  visitAll(nodes: ParseNode[]): any[] {
    const result = [];
    nodes.forEach((node: ParseNode) => {
      if (node) {
        const n = node.visit(this);
        if (n) { result.push(n); }
      }
    });
    return result;
  }
}
