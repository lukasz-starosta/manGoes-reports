export default function getData() {
    // ! analyse the data here and return it
    return 'to implement';
}

// Data obtained from the files
const cameraData = getCameraData();
const gazePerSection = getGazePerSection();
const grabs = getGrabs();

// Get data from top and front cameras
function getCameraData() {
    const top = JSON.parse(sessionStorage.getItem('inputFileTopCamera'));
    const front = JSON.parse(sessionStorage.getItem('inputFileFrontCamera'));

    // Clear session storage
    // sessionStorage.removeItem('inputFileTopCamera');
    // sessionStorage.removeItem('inputFileFrontCamera');

    return { top, front };
}

// Subtract dateIn from dateOut
function getTimeDifferenceInSeconds(dateIn, dateOut) {
    return (new Date(dateOut).getTime() - new Date(dateIn).getTime()) / 1000;
}

// Get glances and gaze time per section
function getGazePerSection() {
    const gazePerSection = new Map();

    cameraData.front.events.forEach(event => {
        if (gazePerSection.has(event.sectionId)) {
            const currentGlances = gazePerSection.get(event.sectionId).glances;
            const currentGazeTime = gazePerSection.get(event.sectionId).gazeTime;

            gazePerSection.set(event.sectionId, {
                glances: currentGlances + 1,
                gazeTime: currentGazeTime + getTimeDifferenceInSeconds(event.in, event.out)
            });
        } else {
            gazePerSection.set(event.sectionId, {
                glances: 1,
                gazeTime: getTimeDifferenceInSeconds(event.in, event.out)
            });
        }
    });

    return gazePerSection;
}

// ! to implement
function getGrabs() {}
