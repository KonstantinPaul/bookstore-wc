export default class DOMChanger {

  /**
   * This methods takes a HTMLCollection and reorders it according to updateIds
   *
   * @param: elements (HTMLCollection): A collection of elements live and contained in DOM
   * @param: updateIds [<string>]: An array of ids, according to it all elements are reorderd, or deleted in DOM 
   */
  static arrangeElementsInOrder(elements, updateIds) {
    /* TODO: What TODO if,
     * (1) Elements not connected to IDs
     *     -> Keep track of those and remove them
     *
     * (2) IDs are not found on elements
     *     -> Warn caller about them!
     *
     *     -> Workaround 1 (for caller): Prevent this by adding those "new" elements before
     *     -> Workaround 2: Instead of "updateIds" use "updateElements", which contains all elements in correct order for merging.
     */

  }

  /** TODO: Remove console.debug logging
   ** Extract computed styles like custom CSS properties
  */
  static extractComputedStyles(element = document.body) {
    const computedStyles = getComputedStyle(element);
    let customPropsCounter = 0;
    let normalPropsCounter = 0;
    const customProps = new Map();

    for (const style of computedStyles) {
      if (style.includes("--")) {
        customProps.set(style, computedStyles.getPropertyValue(style));
        customPropsCounter++; 
      } else {
        normalPropsCounter++;
      }
    }

    console.debug("customPropsCounter", customPropsCounter, "normalPropsCounter", normalPropsCounter);
    for (const [key, value] of customProps.entries()) {
      console.debug(key, value);
    }

    return customProps;
  }

}
