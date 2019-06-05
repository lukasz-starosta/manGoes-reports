import getData from './processJSON.js';
import Box from './Box.js';

/**
 * gazePerSection is a map
 * sectionId => {glances, events[{in, out}]}
 *
 * grabTimestamps is an array of timestamps
 */
let gazePerSection, grabTimestamps;
({ gazePerSection, grabTimestamps } = getData());
const grabsPerSection = getGrabsPerSection();

function getGrabsPerSection() {
    const grabsPerSection = new Map();
    const isBetweenDates = (timestamp, dateIn, dateOut) => {
        const time = new Date(timestamp).getTime();
        return time >= new Date(dateIn).getTime() && time <= new Date(dateOut).getTime();
    };
    grabTimestamps.forEach(timestamp => {
        let grabbedSection;
        gazePerSection.forEach((props, sectionId) => {
            if (props.events.some(event => isBetweenDates(timestamp, event.in, event.out))) {
                grabbedSection = sectionId;
            }
        });
        if (grabbedSection) {
            if (grabsPerSection.has(grabbedSection)) {
                grabsPerSection.set(grabbedSection, grabsPerSection.get(grabbedSection) + 1);
            } else {
                grabsPerSection.set(grabbedSection, 1);
            }
        } else {
            if (grabsPerSection.has('Unidentified')) {
                grabsPerSection.set('Unidentified', grabsPerSection.get('Unidentified') + 1);
            } else {
                grabsPerSection.set('Unidentified', 1);
            }
        }
    });

    return grabsPerSection;
}

const gazePerSectionBox = new Box('gaze-per-section-box', ['gazeTime', 'glances', 'section']);
gazePerSection.forEach((props, sectionId) => {
    const gazeTime = props.events.reduce(
        (prev, curr) => prev + getTimeDifferenceInSeconds(curr.in, curr.out),
        0
    );

    gazePerSectionBox.addResult(gazePerSectionBox.gazeTime, `${gazeTime}s`);
    gazePerSectionBox.addResult(gazePerSectionBox.glances, props.glances);
    gazePerSectionBox.addResult(gazePerSectionBox.section, sectionId, 'result__section');
});

const grabsPerSectionBox = new Box('grabs-per-section-box', ['grabs', 'section']);
grabsPerSection.forEach((grabs, sectionId) => {
    grabsPerSectionBox.addResult(grabsPerSectionBox.grabs, grabs);
    grabsPerSectionBox.addResult(grabsPerSectionBox.section, sectionId, 'result__section');
});

// * Utils
// Subtract dateIn from dateOut
function getTimeDifferenceInSeconds(dateIn, dateOut) {
    return (new Date(dateOut).getTime() - new Date(dateIn).getTime()) / 1000;
}
