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

    gotoEditor();
    repaint();
}

// **** page nav

function gotoEditor() {
    document.querySelector('.main-container').classList.add('hidden');
    document.querySelector('.editor-container').classList.remove('hidden');
}

function gotoMainPage() {
    initMeme();
    document.querySelector('.editor-container').classList.add('hidden');
    document.querySelector('.main-container').classList.remove('hidden');
}

// ** Editor button add / remove / toggle

/**
 * Moving across the meme lines
 */
function onToggleLines() {
    toggleLineIdx();
    let currentLine = getCurrentLine();

    setInputTxt(currentLine.txt);

    repaint();
}

/**
 * Adding new text line to the meme
 */
function onAddNewLine() {
    // Prevent Adding more lines if plus button pressed in a row
    let lastLine = getCurrentMeme().lines[getCurrentMeme().lines.length - 1];
    if (lastLine && lastLine.txt === 'Put your text here') {
        focusLastLine();
        return;
    }

    addNewLine();
    setCurrentSelectedLine(getCurrentMeme().lines.length - 1);
    repaint();
}

/**
 * Delete the current boxed line
 */
function onDeleteLine() {
    deleteLine();
    repaint();

    // Move input to next line
    let currentLine = getCurrentLine();
    if (!currentLine) return;
    setInputTxt(currentLine.txt);
}

/**
 * Focus input on last line
 */
function focusLastLine() {
    document.querySelector('.text-editor-input').focus();
    setCurrentSelectedLine(getCurrentMeme().lines.length - 1);

    repaint();
}

// ** Editor Font style

/**
 * Increase / decrease the font size
 * @param {Number} diff -1 / 1
 */
function onChangeFontSize(diff) {
    changeFontSize(diff);
    arrangePositionByAlign();
    repaint();
}

/**
 * Change line align
 * @param {String} newPos middle / left / right
 */
function onFontPos(newPos) {
    changeFontPos(newPos);
    repaint();
}

function onChangeFont(font) {
    //
}

function onUnderlineFont() {
    //
}

function onColorFont() {
    //
}

//

// ! unused
function onSelectLine(idx) {
    idx = idx || 0;
    setCurrentSelectedLine(idx);
}

/**
 * Change and repaint every input change
 * @param {Element} el - text input of meme line
 */
function onInputTxt(el) {
    let txt = el.value;
    updateLineTxt(txt);
    repaint();
}

/**
 * !Unused
 * Adding new line when there is a click on empty input
 * @param {Element} el - text input of meme line
 */
function onCheckToAdd(el) {
    let txt = el.value;

    if (!txt) {
        onAddNewLine();
        getCurrentLine().txt = '.';
        setInputTxt('.');
    }
}

/**
 * Clear the input and the editing box
 * @param {Element} el - text input of meme line
 */
function clearInput(el) {
    el.value = '';
    setCurrentSelectedLine(-1);
    repaint();
}

/**
 * Set th current text value inside the input
 * @param {String} txt
 */
function setInputTxt(txt) {
    var elInput = document.querySelector('.text-editor-input');

    elInput.value = txt;
}
