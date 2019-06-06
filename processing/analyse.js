import getData from './processJSON.js';
import { TableBox, GraphBox } from './Box.js';

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

const gazePerSectionBox = new TableBox('gaze-per-section-box', ['gazeTime', 'glances', 'section']);
gazePerSection.forEach((props, sectionId) => {
    const gazeTime = props.events.reduce(
        (prev, curr) => prev + getTimeDifferenceInSeconds(curr.in, curr.out),
        0
    );

    gazePerSectionBox.addResult(gazePerSectionBox.gazeTime, `${gazeTime}s`);
    gazePerSectionBox.addResult(gazePerSectionBox.glances, props.glances);
    gazePerSectionBox.addResult(gazePerSectionBox.section, sectionId, 'result__section');
});

const grabsPerSectionBox = new TableBox('grabs-per-section-box', ['grabs', 'section']);
grabsPerSection.forEach((grabs, sectionId) => {
    grabsPerSectionBox.addResult(grabsPerSectionBox.grabs, grabs);
    grabsPerSectionBox.addResult(grabsPerSectionBox.section, sectionId, 'result__section');
});

// Most looked at box initialization
const mostLookedAtHeights = new Map();
gazePerSection.forEach((props, sectionId) => {
    mostLookedAtHeights.set(sectionId, props.glances);
});
const mostLookedAtBox = new GraphBox('most-looked-at-box', mostLookedAtHeights);

// Longest looked at box initialization
const longestLookedAtHeights = new Map();
gazePerSection.forEach((props, sectionId) => {
    longestLookedAtHeights.set(
        sectionId,
        props.events.reduce((prev, curr) => prev + getTimeDifferenceInSeconds(curr.in, curr.out), 0)
    );
});
const longestLookedAtBox = new GraphBox('longest-looked-at-box', longestLookedAtHeights);

// Hottest sections
const hottestSectionsBox = document.getElementById('hottest-sections-box');
assignHottestSections();
// grabs are the most important, then gaze time, then glances
function getSectionScore() {
    const scorePerSection = new Map([[1, 0], [2, 0], [3, 0], [4, 0]]);
    grabsPerSection.forEach((grabs, sectionId) => {
        scorePerSection.set(sectionId, scorePerSection.get(sectionId) + grabs * 10);
    });
    gazePerSection.forEach((props, sectionId) => {
        const gazeTime = props.events.reduce(
            (prev, curr) => prev + getTimeDifferenceInSeconds(curr.in, curr.out),
            0
        );
        scorePerSection.set(
            sectionId,
            scorePerSection.get(sectionId) + gazeTime * 2 + props.glances
        );
    });

    return scorePerSection;
}

function assignHottestSections() {
    const sortedScores = new Map(Array.from(getSectionScore()).sort((a, b) => b[1] - a[1]));
    const iterator = sortedScores.keys();
    for (let i = 1; i <= 3; i++) {
        const sectionId = iterator.next().value;
        const div = document.createElement('div');
        div.classList.add(
            'podium__result',
            `podium__result--${i}`,
            `stand__section__color--${sectionId}`,
            'shadow-sm'
        );
        div.innerText = sectionId;
        hottestSectionsBox.appendChild(div);
    }
}

// * Utils
// Subtract dateIn from dateOut
function getTimeDifferenceInSeconds(dateIn, dateOut) {
    return (new Date(dateOut).getTime() - new Date(dateIn).getTime()) / 1000;
}
