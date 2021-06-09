'use strict';

var gChoseImage = null;

function init() {
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
    gChoseImage = el;
    resizeCanvasByImageSize(el);
    gotoEditor();
}

function gotoEditor() {
    document.querySelector('.main-container').classList.add('hidden');
    document.querySelector('.editor-container').classList.remove('hidden');
}

function gotoMainPage() {
    document.querySelector('.editor-container').classList.add('hidden');
    document.querySelector('.main-container').classList.remove('hidden');
}
