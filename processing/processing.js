const cameraData = {
    top: JSON.parse(sessionStorage.getItem('inputFileTopCamera')),
    front: JSON.parse(sessionStorage.getItem('inputFileFrontCamera'))
};

function clearSessionStorage() {
    sessionStorage.removeItem('inputFileTopCamera');
    sessionStorage.removeItem('inputFileFrontCamera');
}
