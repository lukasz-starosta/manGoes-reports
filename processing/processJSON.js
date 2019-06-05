export default function getData() {
    return { gazePerSection, grabTimestamps };
}

// Data obtained from the files
const cameraData = getCameraData();
const gazePerSection = getGazePerSection();
const grabTimestamps = getGrabTimestamps();

// Get data from top and front cameras
function getCameraData() {
    const top = JSON.parse(sessionStorage.getItem('inputFileTopCamera'));
    const front = JSON.parse(sessionStorage.getItem('inputFileFrontCamera'));

    // Clear session storage
    // sessionStorage.removeItem('inputFileTopCamera');
    // sessionStorage.removeItem('inputFileFrontCamera');

    return { top, front };
}

// Get glances and gaze time per section
function getGazePerSection() {
    const gazePerSection = new Map();

    cameraData.front.events.forEach(event => {
        if (gazePerSection.has(event.sectionId)) {
            const current = gazePerSection.get(event.sectionId);
            current.glances++;
            current.events.push({ in: event.in, out: event.out });
        } else {
            gazePerSection.set(event.sectionId, {
                glances: 1,
                events: [{ in: event.in, out: event.out }]
            });
        }
    });

    return gazePerSection;
}

function getGrabTimestamps() {
    return cameraData.top.events.map(event => {
        const properDate = `${cameraData.top.date} ${event}`;
        return new Date(properDate);
    });
}
