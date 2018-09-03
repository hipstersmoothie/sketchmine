/**
 * @jest-environment jsdom
 */
import { readFileSync } from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';
import { DomTraverser, NodeType } from './dom-traverser';
import { DomVisitor, StyleDeclaration } from './dom-visitor';
import { ITraversedElement } from './traversed-dom';

const TEST_FILE = path.join(process.cwd(), 'tests', 'fixtures', 'test-page.html');
const ROOT_ELEMENT = 'app-root';

describe('DOM Traverser', () => {
  let tree;
  beforeAll(() => {
    const html = readFileSync(TEST_FILE).toString();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const hostElement = document.querySelector(ROOT_ELEMENT) as HTMLElement;
    const visitor = new DomVisitor(hostElement);
    const traverser = new DomTraverser();
    /**
     * mock the getStyle function in case of getComputedStyle(),
     * in case that it is not available in jsdom.
     * For that we would need an e2e test.
     */
    visitor.getStyle = jest.fn().mockImplementation(() => { return new StyleDeclaration(); });
    /**
     * Mock the implementation of the checkNodeType
     * Jest does not know that the provided node is instance of Element,
     * because Element does only exists in jests window location.
     * */
    traverser.checkNodeType = jest.fn().mockImplementation((node: Node) => {
      if (node instanceof dom.window.Element) {
        return NodeType.Element;
      }
      if (node instanceof dom.window.Text) {
        return NodeType.Text;
      }
      if (node instanceof dom.window.Comment) {
        return NodeType.Comment;
      }
    });

    tree = traverser.traverse(hostElement, visitor);
  });

  test('traversed DOM starts with the root element', () => {
    expect(tree).toHaveProperty('tagName');
    expect(tree.tagName).toBe(ROOT_ELEMENT.toUpperCase());
  });

  test('traversed dom Element has children', () => {
    expect(tree).toHaveProperty('children');
    expect(tree.children).toBeInstanceOf(Array);
    expect(tree.children.length).toBeGreaterThan(0);
  });

  test('traversed children tags', () => {
    expect(tree.children).toHaveLength(1);
    expect(tree.children[0].tagName).toMatch('APP-BUTTON-PRIMARY');
    const childs = tree.children[0].children;
    expect(childs).toBeInstanceOf(Array);
    expect(childs).toHaveLength(3);
    expect(childs[0].tagName).toMatch('BUTTON');
    expect(childs[1].tagName).toMatch('IMG');
    expect(childs[2].tagName).toMatch('SVG');

    expect(childs[0]).toHaveProperty('children');
    const buttonChilds = childs[0].children;
    expect(buttonChilds).toHaveLength(1);
    expect(buttonChilds[0].tagName).toMatch('SPAN');
    expect(buttonChilds[0].children[0].text).toMatch('Primary Button');
  });
});
