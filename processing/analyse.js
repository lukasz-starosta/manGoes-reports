import getData from './processJSON.js';
import Box from './Box.js';

/**
 * gazePerSection is a map
 * sectionId => {glances, gazeTime}
 *
 * grabTimestamps is an array of timestamps
 */
let gazePerSection, grabTimestamps;
({ gazePerSection, grabTimestamps } = getData());

const gazePerSectionBox = new Box('gaze-per-section-box', ['gazeTime', 'glances', 'section']);
gazePerSection.forEach((props, sectionId) => {
    gazePerSectionBox.addResult(gazePerSectionBox.gazeTime, `${props.gazeTime}s`);
    gazePerSectionBox.addResult(gazePerSectionBox.glances, props.glances);
    gazePerSectionBox.addResult(gazePerSectionBox.section, sectionId, 'result__section');
});

const grabsPerSectionBox = new Box('grabs-per-section-box', ['grabs', 'section']);
grabTimestamps.forEach(() => {
    // TODO: implement analysis and sorting by section
    grabsPerSectionBox.addResult(grabsPerSectionBox.grabs, 4);
    grabsPerSectionBox.addResult(grabsPerSectionBox.section, 1, 'result__section');
});
