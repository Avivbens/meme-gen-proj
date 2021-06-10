'use strict';

const FONT_SIZE_CHANGE_STEPS = 2;
var gShownKeyWordsCount;

function init() {
    initMeme();

    renderAllImgs();
    renderSavedProj();

    initCanvasService();

    gShownKeyWordsCount = 5;
    renderSortWords(gShownKeyWordsCount);
    updateSearchWordsSize();

    // window.addEventListener('resize', resizeCanvas);
}

function renderAllImgs() {
    var allImages = getImages();
    renderImgs(allImages);
}

function renderImgs(imgs) {
    var elImagesContainer = document.querySelector('.main-images-container');

    var strHTMLs = imgs.map((img) => {
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

// ******** Listeners

function addListeners() {
    var elCanvas = document.querySelector('canvas');

    // if (gTouchEvs.includes(ev.type)) {
    //     ev.preventDefault();
    // }

    // Pan on
    var hammerTime = new Hammer(elCanvas);
    hammerTime.on('panstart', function (ev) {
        let x = ev.changedPointers[0].offsetX;
        let y = ev.changedPointers[0].offsetY;
        // TODO
        console.log('pan on');
    });

    // Pan move
    hammerTime.on('panmove', function (ev) {
        let x = ev.changedPointers[0].offsetX;
        let y = ev.changedPointers[0].offsetY;

        onMoveCurrLineCanvas({ x, y });
    });

    // Pan off
    hammerTime.on('panend', function (ev) {
        let x = ev.changedPointers[0].offsetX;
        let y = ev.changedPointers[0].offsetY;
        // TODO
        console.log('pan off');
    });

    // Single tap
    hammerTime.on('tap', function (ev) {
        let x = ev.changedPointers[0].offsetX;
        let y = ev.changedPointers[0].offsetY;
        // TODO

        checkSelection({ x, y });
        // drawText('test', { x, y });

        console.log('tap');
        console.log('{ x, y } :>> ', { x, y });
    });
}

// **** page nav

function gotoEditor() {
    document.querySelector('.main-container').classList.add('hidden');
    document.querySelector('.saved-proj-container').classList.add('hidden');
    document.querySelector('.editor-container').classList.remove('vis-hidden');

    // Display save meme button
    document.querySelector('.save-meme-btn').classList.remove('hidden');
    document.querySelector('.saved-memes').classList.add('hidden');
}

function gotoMainPage() {
    initMeme();
    document.querySelector('.editor-container').classList.add('vis-hidden');
    document.querySelector('.saved-proj-container').classList.add('hidden');

    // Remove share button
    document.querySelector('.share-container').innerHTML = '';

    document.querySelector('.main-container').classList.remove('hidden');

    // Remove save meme button
    document.querySelector('.save-meme-btn').classList.add('hidden');
    document.querySelector('.saved-memes').classList.remove('hidden');

    renderImgs(getImages());
}

function gotoSavedProjPage() {
    document.querySelector('.editor-container').classList.add('vis-hidden');
    document.querySelector('.main-container').classList.add('hidden');
    document.querySelector('.saved-proj-container').classList.remove('hidden');

    // Remove save meme button
    document.querySelector('.save-meme-btn').classList.add('hidden');
    document.querySelector('.saved-memes').classList.add('hidden');
}

function toggleMenu() {
    var menuBar = document.querySelector('.menu-options');
    menuBar.classList.toggle('closed');
}

// ********* Filter bar

function onSearch(elInput) {
    let allImgs = getImages();
    let val = elInput.value;

    let imgsForDis = filerImagesByString(allImgs, val);

    renderImgs(imgsForDis);
}

function onClickSearchWord(word) {
    let allImgs = getImages();

    let imgsForDis = filerImagesByString(allImgs, word);

    renderImgs(imgsForDis);

    updateWordsCounter(word);
    updateSearchWordsSize();
}

function updateSearchWordsSize() {
    let clicksMap = loadFormStorage('words_popularity');

    let sumClicks = 0;
    for (const word in clicksMap) {
        if (Object.hasOwnProperty.call(clicksMap, word)) {
            const times = clicksMap[word];
            sumClicks += times;
        }
    }

    let elWords = document.querySelectorAll('.filter-options-container > a');
    elWords.forEach((elWord) => {
        let wordKey = elWord.dataset.word;
        let size = clicksMap[wordKey];

        let ratio = size / sumClicks;
        let diff = 4.687 * ratio + 1;

        elWord.style.fontSize = diff + 'rem';
    });
}

function filerImagesByString(imgs, txt) {
    let imgsForDis = imgs.filter((img) => {
        return img.keywords.some((keyword) => {
            return keyword.includes(txt);
        });
    });

    return imgsForDis;
}

function clearCurrentFilter() {
    document.querySelector('.search-input').value = '';
    renderImgs(getImages());
}

/**
 * Render all key words into sort area
 */
function renderSortWords(length) {
    let allKeyWords = generateKeyWords();

    var elContainer = document.querySelector('.filter-options-container');

    let strHTMLs = '';
    let wordsArr = [];
    for (const word in allKeyWords) {
        if (Object.hasOwnProperty.call(allKeyWords, word)) {
            const times = allKeyWords[word];

            wordsArr.push(`
            <a href="#" data-word="${word}" 
            class="filter-option filter-word" style="font-size: 
            ${(times * 250) / getImages().length}px"
            onclick="onClickSearchWord('${word}')">
            ${word}</a>
            `);
        }
    }

    for (let i = 0; i < length && i < wordsArr.length; i++) {
        strHTMLs += wordsArr[i];
    }

    elContainer.innerHTML = strHTMLs;
}

/**
 * Open more key words
 */
function toggleMoreKeyWords() {
    gShownKeyWordsCount = gShownKeyWordsCount === 5 ? 15 : 5;
    var elContainer = document.querySelector('.filter-options-container');
    elContainer.classList.toggle('keywords-open');

    // var elMoreBtn = document.querySelector('.more-key-words-btn');
    // elMoreBtn.classList.toggle('keywords-open');

    renderSortWords(gShownKeyWordsCount);
    updateSearchWordsSize();
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
 * Set text value inside the input
 * @param {String} txt
 */
function setInputTxt(txt) {
    var elInput = document.querySelector('.text-editor-input');

    elInput.value = txt;
}

/**
 * Set font value inside select font box
 * @param {String} val
 */
function setFontSelect(val) {
    var elSelect = document.querySelector('.select-font-decoration');

    elSelect.value = val;
}

// ** Editor button add / remove / toggle

/**
 * Moving across the meme lines
 */
function onToggleLines() {
    toggleLineIdx();
    let currentLine = getCurrentLine();

    setInputTxt(currentLine.txt);
    setFontSelect(currentLine.font);

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

// *********** Canvas integral

function onMoveCurrLineCanvas(position) {
    //
    let currentLine = getCurrentLine();
    if (!currentLine) return;

    setNewYPosition(position.y * 1.2);
    repaint();
}

function onDownloadCanvas(el) {
    // Clear selected line
    setCurrentSelectedLine(-1);
    repaint();

    downloadCanvas(el);
}
// ***********

/**
 * Save Memes to edit to local storage
 */
function onSaveMeme() {
    var currentSavedMemes = loadFormStorage();
    if (!currentSavedMemes) currentSavedMemes = [];

    // Not saving empty memes
    // if (!checkIfNotEmpty) return;

    currentSavedMemes.push(getCurrentMeme());

    saveToLocal(currentSavedMemes);
    renderSavedProj();
    gotoMainPage();
}

// ! Unused
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
    // resizeCanvas();

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

// ! Unused
function _calcClickPos(position) {
    //
    let can = getCanvas();
    let diffX = can.width - position.x;
    let diffY = can.height - position.y;
    console.log('diffX, diffY :>> ', diffX, diffY);

    return { x: diffX, y: diffY };
    // return { x: position.x - diffX, y: position.y - diffY };
}

// ! unused
function onSelectLine(idx) {
    idx = idx || 0;
    setCurrentSelectedLine(idx);
}
