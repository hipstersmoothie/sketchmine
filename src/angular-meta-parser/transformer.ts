import * as ts from 'typescript';

export class Transformer {

  private _sourceFile: ts.SourceFile;
  output = [];

  constructor() {
    console.log('transformer was created');
  }

  // transformSourceFile(node: ts.SourceFile) {
  //   // store original sourceFile
  //   this._sourceFile = node;
  //   const visited = ts.visitEachChild(node, this.visitor as (node: ts.Node) => ts.VisitResult<ts.Node>, context);
  // }

  visitor(node: ts.Node): ts.VisitResult<ts.Node> | undefined {
    if (node === undefined) {
      return;
    }
    // For demo purposes lets print out the type of node we are currently visiting
    console.log(ts.SyntaxKind[node.kind]);

    // Find out what type of node we are currently visiting
    // and call the visit function for specific nodes if available
    switch (node.kind) {
      

      // MethodDeclaration in a class
      // case ts.SyntaxKind.MethodDeclaration:
      //   return visitMethodDeclaration(node as ts.MethodDeclaration);

    }
    return ts.forEachChild(node, this.visitor);
  }

  // visitNode(node: ts.Node) {
  //   console.log(node.kind);
  //   console.log(ts.SyntaxKind.ModuleDeclaration);
  //   // Only consider exported nodes
  //   if (!node) {
  //     return;
  //   }

  //   switch (node.kind) {
  //     case ts.SyntaxKind.ClassDeclaration:
  //       // console.log(ts.isClassDeclaration)
  //       this.output.push((<ts.ClassDeclaration>node));
  //       break;

  //     case ts.SyntaxKind.ModuleDeclaration:
  //       // This is a namespace, visit its children
  //       break;
  //   }

  //   ts.forEachChild(node, this.visitNode);
  // }

  // private isNodeExported(node: ts.Node): boolean {
  //   return (node.flags & ts.NodeFlags.Export) !== 0 ||
  //     (node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
  // }
}
/*
export function transform(sourceFile: ts.SourceFile) {
  transformNode(sourceFile);

  function transformNode(node: ts.Node) {

    console.log(node.kind)

    // switch (node.kind) {
    //   case ts.SyntaxKind.ForStatement:
    //   case ts.SyntaxKind.ForInStatement:
    //   case ts.SyntaxKind.WhileStatement:
    //   case ts.SyntaxKind.DoStatement:
    //     if ((<ts.IterationStatement>node).statement.kind !== ts.SyntaxKind.Block) {
    //       report(
    //         node,
    //         'A looping statement\'s contents should be wrapped in a block body.',
    //       );
    //     }
    //     break;

    //   case ts.SyntaxKind.IfStatement:
    //     const ifStatement = <ts.IfStatement>node;
    //     if (ifStatement.thenStatement.kind !== ts.SyntaxKind.Block) {
    //       report(
    //         ifStatement.thenStatement,
    //         'An if statement\'s contents should be wrapped in a block body.',
    //       );
    //     }
    //     if (
    //       ifStatement.elseStatement &&
    //       ifStatement.elseStatement.kind !== ts.SyntaxKind.Block &&
    //       ifStatement.elseStatement.kind !== ts.SyntaxKind.IfStatement
    //     ) {
    //       report(
    //         ifStatement.elseStatement,
    //         'An else statement\'s contents should be wrapped in a block body.',
    //       );
    //     }
    //     break;

    //   case ts.SyntaxKind.BinaryExpression:
    //     const op = (<ts.BinaryExpression>node).operatorToken.kind;
    //     if (
    //       op === ts.SyntaxKind.EqualsEqualsToken ||
    //       op === ts.SyntaxKind.ExclamationEqualsToken
    //     ) {
    //       report(node, 'Use \'===\' and \'!==\'.');
    //     }
    //     break;
    // }

    ts.forEachChild(node, transformNode);
  }

  function report(node: ts.Node, message: string) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(),
    );
    console.log(
      `${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`,
    );
  }
}
*/
