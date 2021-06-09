'use strict';

function init() {
    renderImages();
}

function renderImages() {
    var allImages = getImages();

    var elImagesContainer = document.querySelector('.main-images-container');

    var strHTMLs = allImages.map((img) => {
        return `
        <div class="meme-img-box">
            <img class="meme-img" src="${img.url}" alt="">
        </div>
        `;
    });

    elImagesContainer.innerHTML = strHTMLs.join('');
}
