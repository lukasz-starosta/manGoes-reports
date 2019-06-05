// Get the inputs with corresponding labels
const fileHandlers = [].slice.call(document.querySelectorAll('input[type="file"]')).map(input => ({
    input,
    label: document.querySelector(`label[for="${input.id}"]`),
    hasChosenFile: false
}));

let file1;
let file2;

// Change the page
const uploadButton = document.getElementById('btn-upload');
uploadButton.onclick = () => {
    if (window.location.href.includes('github')) {
        window.location.href += '/processing';
    } else {
        window.location.href = '/processing';
    }
};

// Change labels and watch whether two files have been chosen
fileHandlers.forEach(handler => {
    handler.input.addEventListener('change', () => {
        handler.label.textContent = handler.input.files[0].name;
        handler.hasChosenFile = true;

        handleFileSaving(handler.input.files[0], handler.input.id);

        if (fileHandlers.every(handler => handler.hasChosenFile)) {
            uploadButton.classList.remove('disabled');
        }
    });
});

function handleFileSaving(file, name) {
    const filereader = new FileReader();
    const saveData = e => sessionStorage.setItem(name, e.target.result);
    filereader.onload = saveData;

    filereader.readAsText(file);
}

// Clear session storage
if (sessionStorage.has('inputFileTopCamera')) {
    sessionStorage.removeItem('inputFileTopCamera');
}
if (sessionStorage.has('inputFileFrontCamera')) {
    sessionStorage.removeItem('inputFileFrontCamera');
}
