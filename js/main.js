'use strict';

const FONT_SIZE_CHANGE_STEPS = 2;

function init() {
    initMeme();

    renderImages();
    renderSavedProj();

    initCanvasService();
}

function renderImages() {
    var allImages = getImages();

    var elImagesContainer = document.querySelector('.main-images-container');

    var strHTMLs = allImages.map((img) => {
        return `
        <div class="meme-img-box hover-pointer">
            <img data-id="${img.id}" class="meme-img" onclick="onChooseImage(this)" src="${img.url}" alt="">
        </div>
        `;
    });

    elImagesContainer.innerHTML = strHTMLs.join('');
}

function renderSavedProj() {
    var elSavedProjContainer = document.querySelector('.saved-proj-container');
    var allSavedProjs = loadFormStorage();
    if (!allSavedProjs) return;

    var strHTMLs = allSavedProjs.map((proj, idx) => {
        let currentImg = getImageById(proj.selectedImgId);

        return `
        <div onclick="
        onChooseSavedProg('${idx}');" 
        class="saved-proj-box hover-pointer">
            <img src="${currentImg.url}" alt="">
            <span class="saved-proj-desc">${proj.lines[0].txt}</span>
            <button onclick="removeSavedProj(event, '${idx}')" class="remove-saved-proj-btn hover-pointer">✖</button>
        </div>
        `;
    });

    elSavedProjContainer.innerHTML = strHTMLs.join('');
}

function onChooseImage(el) {
    if (el) {
        setCurrentMemeImgByEl(el);
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
    document.querySelector('.saved-proj-container').classList.add('hidden');
    document.querySelector('.editor-container').classList.remove('hidden');

    // Display save meme button
    document.querySelector('.save-meme-btn').classList.remove('hidden');
    document.querySelector('.saved-memes').classList.add('hidden');
}

function gotoMainPage() {
    initMeme();
    document.querySelector('.editor-container').classList.add('hidden');
    document.querySelector('.saved-proj-container').classList.add('hidden');
    document.querySelector('.main-container').classList.remove('hidden');

    // Remove save meme button
    document.querySelector('.save-meme-btn').classList.add('hidden');
    document.querySelector('.saved-memes').classList.remove('hidden');
}

function gotoSavedProjPage() {
    document.querySelector('.editor-container').classList.add('hidden');
    document.querySelector('.main-container').classList.add('hidden');
    document.querySelector('.saved-proj-container').classList.remove('hidden');

    // Remove save meme button
    document.querySelector('.save-meme-btn').classList.add('hidden');
    document.querySelector('.saved-memes').classList.add('hidden');
}

// ******* Editor

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
    changeFontSize(diff * FONT_SIZE_CHANGE_STEPS);
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

/**
 * Change font family for that line
 * @param {String} font Font-Family
 */
function onChangeFont(font) {
    console.log(font);
    changeFontStyle(font);
    repaint();
}

function onBoldFont() {
    toggleBold();
    repaint();
}

function onUnderlineFont() {
    toggleUnderline();
    repaint();
}

function onColorFont(el) {
    let color = el.value;

    changeFontColor(color);
    repaint();
}

// ***********

/**
 * Save Memes to edit to local storage
 */
function onSaveMeme() {
    var currentSavedMemes = loadFormStorage();
    if (!currentSavedMemes) currentSavedMemes = [];

    // Not saving empty memes
    if (!checkIfNotEmpty) return;

    currentSavedMemes.push(getCurrentMeme());

    saveToLocal(currentSavedMemes);
    renderSavedProj();
    gotoMainPage();
}

function checkIfNotEmpty() {
    let currentMeme = getCurrentMeme();
    if (!currentMeme) return false;

    let currentTxt = currentMeme.lines[0].txt;
    if (!currentTxt || currentTxt === 'Put your text here') return false;

    return true;
}

/**
 * Load the selected saved proj
 * @param {Number} projIdx - project idx number from local storage
 */
function onChooseSavedProg(projIdx) {
    var allSavedProjs = loadFormStorage();

    var currentProj = allSavedProjs[projIdx];
    setAllMemeProp(currentProj);

    var img = new Image();
    img.src = getImageById(currentProj.selectedImgId).url;

    resizeCanvasByImageSize(img);
    gotoEditor();
    repaint();
}

function removeSavedProj(ev, idx) {
    ev.stopPropagation();

    var allSavedProjs = loadFormStorage();

    allSavedProjs.splice(idx, 1);
    saveToLocal(allSavedProjs);

    renderSavedProj();
}

// ! unused
function onSelectLine(idx) {
    idx = idx || 0;
    setCurrentSelectedLine(idx);
}
