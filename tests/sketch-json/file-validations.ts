export function fileValidations() {

  context('Pages are correctly registerd', () => {
    // "pages": [{
    //   "_class": "MSJSONFileReference",
    //   "_ref_class": "MSImmutablePage",
    //   "_ref": "pages\/605E2E12-53B8-4125-84F3-E2D218213A1B"
    // }]
    // }
    it('document.json has pages array', () => {
    });

    it('pages array matches the size of jsons', () => {
    });

    it('pages id matches the file name', () => {
    });
  });

  context('Artbords and symbols are registerd in meta.json', () => {
    // "pagesAndArtboards": {
    //   "605E2E12-53B8-4125-84F3-E2D218213A1B": {
    //     "name": "Symbols",
    //     "artboards": {
    //       "CEEE8C1D-9483-4E3C-8E0C-80C1A6D8C539": {
    //         "name": "icon\/icon--agent"
    //       },
    //       "47A46D21-066E-4D12-9486-BFD53014F558": {
    //         "name": "icon\/icon--richface"
    //       },
    //       "AB9A68DA-3328-45CE-A798-1F053C468E12": {
    //         "name": "button\/button--icon"
    //       },
    //       "C0D524A1-6B15-4A86-A8FD-52DE231EEE36": {
    //         "name": "button\/button--primary"
    //       },
    //       "DD393E0F-02BF-496F-8AC3-3CC1B2862C75": {
    //         "name": "button\/button--secondary"
    //       },
    //       "7DB3A0F6-A06B-4621-B227-50FB1FA487EE": {
    //         "name": "tile\/tile--default"
    //       }
    //     }
    //   }
    // },
    it('Symbols artboard is registerd', () => {

    });

    it('Artboards are registered for each symbol', () => {

    });
  });

  context('Check if fonts are registerd in meta.json', () => {
    // "fonts": ["BerninaSans-Regular"],
    it('Bernina Sans is registered', () => {

    });
  });
}
