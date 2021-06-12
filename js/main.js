'use strict';

const FONT_SIZE_CHANGE_STEPS = 2;
var gShownKeyWordsCount;

var gDoc = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
    if (gDoc.requestFullscreen) {
        gDoc.requestFullscreen();
    } else if (gDoc.webkitRequestFullscreen) {
        /* Safari */
        gDoc.webkitRequestFullscreen();
    } else if (gDoc.msRequestFullscreen) {
        /* IE11 */
        gDoc.msRequestFullscreen();
    }
}

function init() {
    initMeme();

    renderAllImgs();
    renderSavedProj();

    initCanvasService();

    gShownKeyWordsCount = 5;
    renderSortWords(gShownKeyWordsCount);
    updateSearchWordsSize();

    window.addEventListener('click', openFullscreen);
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
            <img data-id="${img.id}" class="meme-img" onclick="onChooseImage(this)" src="${img.src}" alt="">
        </div>
        `;
    });

    elImagesContainer.innerHTML = strHTMLs.join('');
}

function renderSavedProj() {
    var allSavedProjs = loadFormStorage();

    var elSavedProjContainer = document.querySelector('.saved-proj-container');
    elSavedProjContainer.classList.remove('vis-hidden');

    var msgTitle = document.querySelector('.saved-proj-user-message');
    msgTitle.classList.add('vis-hidden');

    // Clean saved proj area and display user message
    if (!allSavedProjs || !allSavedProjs.length) {
        elSavedProjContainer.innerHTML = '';
        elSavedProjContainer.classList.add('vis-hidden');

        msgTitle.classList.remove('vis-hidden');

        return;
    }

    var strHTMLs = allSavedProjs.map((proj, idx) => {
        let currentImg = getImageById(proj.selectedImgId);
        let txtToDisplay = proj.lines[0] ? proj.lines[0].txt : 'No Description';

        return `
        <div onclick="
        onChooseSavedProj('${idx}');" 
        class="saved-proj-box hover-pointer">
            <img src="${currentImg.src}" alt="">
            <span class="saved-proj-desc" style="text-align: center">${txtToDisplay}</span>
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

    onAddNewLine();

    gotoEditor();
    repaint();
}

/**
 * On choose img from pc
 * @param {Event} ev
 */
function onChooseImgFromPc(ev) {
    loadImageFromInput(ev);

    gotoEditor();
}

function gotoTopPage() {
    document.querySelector('.main-container').scrollTop = 0;
}

// ******** Listeners

function addListeners() {
    var elCanvas = document.querySelector('canvas');

    // Prevent mobile scale the page
    document.addEventListener(
        'touchmove',
        function (event) {
            if (event.scale !== 1) {
                event.preventDefault();
            }
        },
        { passive: false },
    );

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

        console.log('tap');
    });
}

// **** page nav

function gotoEditor() {
    document.querySelector('.main-container').classList.add('hidden');
    document.querySelector('.saved-proj-area').classList.add('hidden');
    document.querySelector('.editor-container').classList.remove('vis-hidden');

    // Display save meme button
    document.querySelector('.save-meme-btn').classList.remove('hidden');
    document.querySelector('.saved-memes').classList.add('hidden');
}

function gotoMainPage() {
    initMeme();
    document.querySelector('.editor-container').classList.add('vis-hidden');
    document.querySelector('.saved-proj-area').classList.add('hidden');
    document.querySelector('.main-container').classList.remove('hidden');

    // Remove share button
    document.querySelector('.share-container').innerHTML = '';

    // Remove save meme button
    document.querySelector('.save-meme-btn').classList.add('hidden');
    document.querySelector('.saved-memes').classList.remove('hidden');

    renderImgs(getImages());
    renderSortWords(gShownKeyWordsCount);
}

function gotoSavedProjPage() {
    document.querySelector('.editor-container').classList.add('vis-hidden');
    document.querySelector('.main-container').classList.add('hidden');
    document.querySelector('.saved-proj-area').classList.remove('hidden');

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
    if (!clicksMap) return;

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
            return keyword.toUpperCase().includes(txt.toUpperCase());
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
 * Clear the input and the editing box
 * @param {Element} el - text input of meme line
 */
function clearInput(el) {
    el.value = '';
    setCurrentSelectedLine(-1);
    repaint();
}

function clearMemeEditorInput() {
    var el = document.querySelector('.text-editor-input');
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

    addNewLine(getCanvas().height / 8);
    setCurrentSelectedLine(getCurrentMeme().lines.length - 1);
    setFontSelect('Impact');
    setInputTxt('');

    repaint();
}

function onAddSticker(img) {
    addSticker(img, getCanvas().height / 5);
    setCurrentSelectedLine(getCurrentMeme().lines.length - 1);
    setInputTxt('');

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
    if (!currentLine) {
        setInputTxt('');
        return;
    }
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

    // arrangePositionByAlign();
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

function onChangeStrokeColor(el) {
    changeStrokeColor(el.value);
    repaint();
}

function onColorFont(el) {
    let color = el.value;

    changeFontColor(color);
    repaint();
}

// *********** Canvas integral

function onMoveCurrLineCanvas(position) {
    let currentLine = getCurrentLine();
    if (!currentLine) return;

    // if (currentLine.isSticker) {
    //     // Calculating point of drag position
    //     let dotPosition = {
    //         x: currentLine.x,
    //         y: currentLine.y,
    //     };
    //     let radius = 50;

    //     if (
    //         position.x * calcImageRatio() <=
    //             dotPosition.x * calcImageRatio() + radius &&
    //         position.x * calcImageRatio() >=
    //             dotPosition.x * calcImageRatio() - radius &&
    //         position.y * calcImageRatio() <=
    //             dotPosition.y * calcImageRatio() + radius &&
    //         position.y * calcImageRatio() >=
    //             dotPosition.y * calcImageRatio() - radius
    //     ) {
    //         // TODO scale img
    //         console.log('in');
    //         //
    //         let dis = Math.sqrt(
    //             (Math.pow(currentLine.x - position.x), 2) +
    //                 (Math.pow(currentLine.y - position.y), 2),
    //         );
    //         // dis = gLastDis - dis;
    //         // gLastDis = dis;

    //         currentLine.size = dis + currentLine.size;
    //         if (currentLine.size < 0) currentLine.size * -1;

    //         repaint();
    //         return;
    //     }
    // }

    setNewYPosition(position.y * 1.2);
    setNewXPosition(position.x);
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

    currentSavedMemes.push(getCurrentMeme());

    saveToLocal(currentSavedMemes);

    setInputTxt('');
    renderSavedProj();
    gotoMainPage();
}

/**
 * Load the selected saved proj
 * @param {Number} projIdx - project idx number from local storage
 */
function onChooseSavedProj(projIdx) {
    var allSavedProjs = loadFormStorage();

    var currentProj = allSavedProjs[projIdx];

    setAllMemeProp(currentProj);

    var img = new Image();
    img.src = getImageById(currentProj.selectedImgId).src;

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
