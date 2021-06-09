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

    drawImg2(el.src);
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

function onEnterNewLine(el) {
    let val = el.value;
}

function onAddNewLine() {
    addNewLine();
    repaint();
}

function onSelectLine(idx) {
    idx = idx || 0;
    setCurrentSelectedLine(idx);
}

function onEditCurrentLine(txt) {
    let currentLine = getCurrentLine();

    currentLine.txt = txt;
    repaint();
}

function onInputTxt(el) {
    let txt = el.value;
    onEditCurrentLine(txt);
}

function clearInput(el) {
    el.value = '';
}
