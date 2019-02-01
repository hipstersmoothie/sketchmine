// DOMRect properties top and right are not writeable make them writeable
type Writeable<T> = { -readonly [P in keyof T]-?: T[P] }

/**
 * returns a DOMRect from an element
 * @param element HTMLElement
 */
export function getRect(element: HTMLElement): Writeable<DOMRect> {
  const bcr = element.getBoundingClientRect() as DOMRect;
  /**
   * In case of we return the result with `.evaluate` properties of DOM object
   * are not enumerable and won't get serialized so we have to manual assign them.
   * @example https://github.com/segmentio/nightmare/issues/723#issuecomment-232666629
   * */
  return {
    x: bcr.x,
    y: bcr.y,
    width: bcr.width,
    height: bcr.height,
    top: bcr.top,
    right: bcr.right,
    bottom: bcr.bottom,
    left: bcr.left,
  } as DOMRect;
}

