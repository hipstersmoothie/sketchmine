import * as ts from 'typescript';

/** Returns weather a node is marked as private with a modifier */
export function isPrivate(node: ts.Declaration): boolean {
  return !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Private);
}

export function isProtected(node: ts.Declaration): boolean {
  return !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Protected);
}

export function isPublic(node: ts.Declaration): boolean {
  return !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Public);
}

export function isStatic(node: ts.Declaration): boolean {
  return !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Static);
}

/** Returns weather a node is exported with the export modifier */
export function isExported(node: ts.Node): boolean {
  // typescript 2.1.4 introduces a new edge case for when
  // top level variables are exported from a source file
  if (
    node.kind === ts.SyntaxKind.VariableDeclaration &&
    node.parent.kind === ts.SyntaxKind.VariableDeclarationList &&
    node.parent.parent.kind === ts.SyntaxKind.VariableStatement
  ) {
    if (
      node.parent.parent.modifiers !== undefined &&
      hasModifierOfKind(
        node.parent.parent.modifiers,
        ts.SyntaxKind.ExportKeyword,
      )
    ) {
      return true;
    }
  }
  // tslint:disable-next-line:no-bitwise
  return !!(getCombinedNodeFlags(node) & ts.NodeFlags.ExportContext);
}

/**
 * Checks if the provided Modifier number *(ts.SyntaxKind)*
 * is inside the provided modifiers array
 */
function hasModifierOfKind(
  modifiers: ts.ModifiersArray,
  modifierKind: number,
): boolean {
  if (modifiers === undefined) {
    return false;
  }
  let result: boolean = false;
  modifiers.forEach(
    (modifier: ts.Node): void => {
      if (modifier.kind === modifierKind) {
        result = true;
      }
    },
  );
  return result;
}

function getCombinedNodeFlags(visitedNode: ts.Node): ts.NodeFlags {
  let node = walkUpBindingElementsAndPatterns(visitedNode);

  let flags = node.flags;
  if (node.kind === ts.SyntaxKind.VariableDeclaration) {
    node = node.parent;
  }

  if (node && node.kind === ts.SyntaxKind.VariableDeclarationList) {
    flags |= node.flags;
    node = node.parent;
  }

  if (node && node.kind === ts.SyntaxKind.VariableStatement) {
    flags |= node.flags;
  }

  return flags;
}

/**
 * Binding patterns are object and array destruction patterns.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
 */
function isBindingPattern(node: ts.Node): node is ts.BindingPattern {
  return (
    node !== undefined &&
    (node.kind === ts.SyntaxKind.ArrayBindingPattern ||
      node.kind === ts.SyntaxKind.ObjectBindingPattern)
  );
}

/**
 * Walk through object and array destruction patterns.
 */
function walkUpBindingElementsAndPatterns(visitedNode: ts.Node): ts.Node {
  let node = visitedNode;

  while (
    node &&
    (node.kind === ts.SyntaxKind.BindingElement || isBindingPattern(node))
  ) {
    node = node.parent;
  }

  return node;
}
