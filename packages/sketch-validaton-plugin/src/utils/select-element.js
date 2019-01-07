import { playSound } from './play-sound';

/**
 * Selects an Element by it's ID or add it to a selection
 * @param {MSDictionary<SketchContext>} document the current Document
 * @param {string} id the unique ID of the element
 * @param {MSSelection} selection
 * @param {boolean} multi if it should add the element to the current selection default disabled
 * @returns {void}
 */
export function selectElement(document, id, multi = false) {
  // select the layer
  const layer = document.getLayerWithID(id);
  if (!layer) {
    playSound('Basso'); //Error sound
    return;
  }

  if (!multi) {
    const selection = document.selectedLayers;
    selection.clear()
  }

  const parentPage = layer.sketchObject.parentPage();
  document.sketchObject.setCurrentPage(parentPage);
  layer.selected = true;
  playSound('Pop');
}
