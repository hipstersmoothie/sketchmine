/**
 * transforms the Sketch Document to the fileFormat
 * @param {MSDocument} document 
 * @param {boolean} meta if we only need the meta infromation about the pages and the path
 * @returns {string}
 */
export function getFileFormat(document, meta = false) {
  const result = {
    path: document.path,
    pages: [],
  };

  const imm = document.sketchObject.documentData().immutableModelObject();
  const json = MSJSONDataArchiver.archiveStringWithRootObject_error_(imm, null);
  const parsedJSON = JSON.parse(json);
  const docPages = [];


  if (meta) {
    result.pages = parsedJSON.pages.map(page => {
      return {
        name: page.name,
        do_objectID: page.do_objectID,
      };
    });
    return result;
  }

  
  // provide the whole document
  result.document = parsedJSON;

  parsedJSON.pages.forEach(page => {
    // object destruct theses three props of the pages array
    docPages.push((({ _ref, _ref_class, _class }) => ({ _ref, _ref_class, _class }))(page))
    delete page._ref;
    delete page._ref_class;
    page._class = 'page';
    result.pages.push(page)
  });

  result.document.pages = [];
  result.document.pages = docPages;

  return result;
}
