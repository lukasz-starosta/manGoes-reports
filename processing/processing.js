const cameraData = {
    top: JSON.parse(sessionStorage.getItem('inputFileTopCamera')),
    front: JSON.parse(sessionStorage.getItem('inputFileFrontCamera'))
};

document.getElementById('col1').innerText += sessionStorage.getItem('inputFileTopCamera');
document.getElementById('col2').innerText += sessionStorage.getItem('inputFileFrontCamera');
