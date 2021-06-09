'use strict';

function init() {
    initMeme();

    renderImages();
    initCanvasService();
}

function renderImages() {
    var allImages = getImages();

    var elImagesContainer = document.querySelector('.main-images-container');

    var strHTMLs = allImages.map((img) => {
        return `
        <div class="meme-img-box">
            <img data-id="${img.id}" class="meme-img" onclick="onChoseImage(this)" src="${img.url}" alt="">
        </div>
        `;
    });

    elImagesContainer.innerHTML = strHTMLs.join('');
}

function onChoseImage(el) {
    if (el) {
        setCurrentMemeImg(el);
    }

    var img = new Image();
    img.src = el.src;

    resizeCanvasByImageSize(img);

    repaint();
    gotoEditor();
}

function gotoEditor() {
    document.querySelector('.main-container').classList.add('hidden');
    document.querySelector('.editor-container').classList.remove('hidden');
}

function gotoMainPage() {
    initMeme();
    document.querySelector('.editor-container').classList.add('hidden');
    document.querySelector('.main-container').classList.remove('hidden');
}

function onAddNewLine() {
    addNewLine();
    setCurrentSelectedLine(getCurrentMeme().lines.length - 1);
    repaint();
}

function onDeleteLine() {
    deleteLine();
    repaint();
}

function onToggleLines() {
    toggleLineIdx();
    let currentLine = getCurrentLine();

    setInputTxt(currentLine.txt);

    repaint();
}

// ! unused
function onSelectLine(idx) {
    idx = idx || 0;
    setCurrentSelectedLine(idx);
}

function onInputTxt(el) {
    let txt = el.value;
    let currentLine = getCurrentLine();

    currentLine.txt = txt;
    repaint();
}

function clearInput(el) {
    el.value = '';
    setCurrentSelectedLine(-1);
    repaint();
}

function setInputTxt(txt) {
    var elInput = document.querySelector('.text-editor-input');

    elInput.value = txt;
}
