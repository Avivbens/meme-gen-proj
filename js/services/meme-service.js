'use strict';

var gKeywords;
var gImgs;

var gMeme;

function initMeme() {
    gImgs = loadFromStorage('all_imgs');

    if (!gImgs) {
        gImgs = [
            { id: '1', src: 'img/2.jpg', keywords: ['happy'] },
            { id: '2', src: 'img/003.jpg', keywords: ['trump', 'angry'] },
            { id: '3', src: 'img/004.jpg', keywords: ['love', 'dogs', 'dog'] },
            { id: '4', src: 'img/5.jpg', keywords: ['strong', 'baby'] },
            {
                id: '5',
                src: 'img/005.jpg',
                keywords: ['sleep', 'baby', 'resting'],
            },
            { id: '6', src: 'img/006.jpg', keywords: ['cat', 'sleep'] },
            { id: '7', src: 'img/8.jpg', keywords: ['crepy', 'clown'] },
            { id: '8', src: 'img/9.jpg', keywords: ['baby', 'evil'] },
            { id: '9', src: 'img/12.jpg', keywords: ['truth'] },
            { id: '10', src: 'img/19.jpg', keywords: ['angry'] },
            {
                id: '11',
                src: 'img/Ancient-Aliens.jpg',
                keywords: ['aliens', 'history'],
            },
            { id: '12', src: 'img/drevil.jpg', keywords: ['drevil'] },
            {
                id: '13',
                src: 'img/img2.jpg',
                keywords: ['happy', 'dance', 'joy', 'funny'],
            },
            {
                id: '14',
                src: 'img/img4.jpg',
                keywords: ['trump', 'angry', 'fuckoff'],
            },
            { id: '15', src: 'img/img5.jpg', keywords: ['baby', 'spooky'] },
            {
                id: '16',
                src: 'img/img6.jpg',
                keywords: ['dog', 'rest', 'chill'],
            },
            { id: '17', src: 'img/img11.jpg', keywords: ['obama', 'laughing'] },
            { id: '18', src: 'img/img12.jpg', keywords: ['kiss', 'nba'] },
            { id: '19', src: 'img/leo.jpg', keywords: ['decaprio', 'salute'] },
            { id: '20', src: 'img/meme1.jpg', keywords: ['spy'] },
            {
                id: '21',
                src: 'img/One-Does-Not-Simply.jpg',
                keywords: ['explain', 'difficult'],
            },
            {
                id: '22',
                src: 'img/Oprah-You-Get-A.jpg',
                keywords: ['opera', 'happy'],
            },
            {
                id: '23',
                src: 'img/patrick.jpg',
                keywords: ['ohh no', 'patrick'],
            },
            {
                id: '24',
                src: 'img/putin.jpg',
                keywords: ['putin', 'peace out'],
            },
            { id: '25', src: 'img/X-Everywhere.jpg', keywords: ['spooky'] },
        ];

        saveToLocal(gImgs, 'all_imgs');
    }

    gMeme = {
        selectedImgId: '1',
        selectedLineIdx: 0,
        lines: [
            // {
            //     txt: 'Put your text here',
            //     size: 40,
            //     font: 'Impact',
            //     align: 'middle',
            //     color: 'white',
            //     strokeColor: 'black',
            //     isUnderline: false,
            //     isBold: false,
            //     isSticker: false,
            // },
        ],
    };

    gKeywords = { happy: 12, 'funny puk': 1 };
}

function generateKeyWords() {
    let keysMap = gImgs.reduce((acc, img) => {
        img.keywords.forEach((keyword) => {
            acc[keyword] = acc[keyword] ? acc[keyword] + 1 : 1;
        });
        return acc;
    }, {});

    return keysMap;
}

/**
 * @returns All imgs
 */
function getImgs() {
    return gImgs;
}

/**
 * @returns Current selected img in Img object
 */
function getCurrentImg() {
    let imgById = gImgs.find((img) => {
        return img.id === gMeme.selectedImgId;
    });

    let img = new Image();
    img.src = imgById.src;

    return img;
}

function getImgById(id) {
    let imgById = gImgs.find((img) => {
        return img.id === id;
    });

    return imgById;
}

function getCurrentMeme() {
    return gMeme;
}

/**
 * Load img from pc
 * @param {Event} ev
 */
function loadImgFromInput(ev) {
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            // Add the img to the all imgs
            let currentId = makeId();
            gImgs.unshift({
                id: currentId,
                src: img.src,
                keywords: ['my imgs'],
            });

            saveToLocal(gImgs, 'all_imgs');

            setCurrentMemeImgId(currentId);
            resizeCanvasByImgSize(img);
            onAddNewLine();

            repaint();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(ev.target.files[0]);
}

function setCurrentMemeImgId(imgId) {
    gMeme.selectedImgId = imgId;
}

function setCurrentSelectedLine(idx) {
    gMeme.selectedLineIdx = +idx;
}

function loadMemeFromStorage(projIdx) {
    var allSavedProjs = loadFromStorage();

    var currentProj = allSavedProjs[projIdx];

    gMeme = currentProj;
}

function getCurrentLine() {
    if (gMeme.selectedLineIdx < 0) return null;
    return gMeme.lines[gMeme.selectedLineIdx];
}

function getLastLine() {
    return gMeme.lines[gMeme.lines.length - 1];
}

function getLastLineIdx() {
    return gMeme.lines.length - 1;
}

/**
 * Count and save clicks on search words
 * @param {String} word
 * @returns the current clicks value of the word
 */
function updateWordsCounter(word) {
    let wordsCounter = loadFromStorage('words_popularity');
    if (!wordsCounter) wordsCounter = {};

    wordsCounter[word] = wordsCounter[word] ? wordsCounter[word] + 1 : 1;

    saveToLocal(wordsCounter, 'words_popularity');

    return wordsCounter[word];
}

// ****

/**
 * Update current line txt and align based of definition
 * @param {String} txt
 */
function updateLineTxt(txt) {
    let currentLine = getCurrentLine();

    if (!currentLine) return;

    currentLine.txt = txt;

    // Canceled so there will be no align while edit txt
    // arrangePositionByAlign();
}

// *************

/**
 * Adding new line and move to it
 */
function addNewLine(size = 40) {
    gMeme.lines.push({
        txt: 'Put your text here',
        size,
        font: 'Impact',
        align: 'middle',
        color: 'white',
        strokeColor: 'black',
        isUnderline: false,
        isBold: false,
        isSticker: false,
    });

    gMeme.selectedLineIdx++;
}

function addSticker(img, size = 100) {
    gMeme.lines.push({
        txt: '',
        size,
        x: 200,
        y: 200,
        isSticker: true,
        stickerImg: img.src,
    });

    gMeme.selectedLineIdx++;
}

/**
 * Delete edited line
 */
function deleteLine() {
    if (!gMeme.lines.length) return;

    let currentIdx = gMeme.selectedLineIdx;
    if (currentIdx < 0 || currentIdx >= gMeme.lines.length) return;

    gMeme.lines.splice(currentIdx, 1);

    gMeme.selectedLineIdx--;
    if (gMeme.selectedLineIdx < 0) gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

/**
 * Move across the lines array
 */
function toggleLineIdx() {
    gMeme.selectedLineIdx++;

    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0;
}

// ****

function changeFontStyle(font) {
    //
    var currentLine = getCurrentLine();

    if (!currentLine) return;

    currentLine.font = font;
}

/**
 * Changing the line align
 * @param {String} newPos
 */
function changeFontPos(newPos) {
    var currentLine = getCurrentLine();

    if (!currentLine) return;
    currentLine.align = newPos;
    arrangePositionByAlign();
}

/**
 * Changing font size of current line
 * @param {Number} diff -1 / 1
 */
function changeFontSize(diff) {
    var currentLine = getCurrentLine();

    if (!currentLine) return;

    currentLine.size += diff;
}

/**
 * Change current line color
 * @param {String} color
 */
function changeFontColor(color) {
    var currentLine = getCurrentLine();

    if (!currentLine) return;

    currentLine.color = color;
}

function changeStrokeColor(color) {
    var currentLine = getCurrentLine();

    if (!currentLine) return;

    currentLine.strokeColor = color;
}

function toggleBold() {
    var currentLine = getCurrentLine();

    if (!currentLine) return;

    currentLine.isBold = !currentLine.isBold;
}

/**
 * Calculate the estimated position X of the line based on align
 */
function arrangePositionByAlign() {
    let currentLine = getCurrentLine();
    if (!currentLine) return;

    switch (currentLine.align) {
        case 'middle':
            currentLine.x = getCanvasCenterWidth() - gCtx.measureText(currentLine.txt).width / 2;
            break;
        case 'right':
            currentLine.x = getCanvasCenterWidth() * 2 - gCtx.measureText(currentLine.txt).width - 20;
            break;
        case 'left':
            currentLine.x = 20;
            break;

        default:
            currentLine.x = 0;
            break;
    }
}

// !Unused
function toggleUnderline() {
    var currentLine = getCurrentLine();

    if (!currentLine) return;

    currentLine.isUnderline = !currentLine.isUnderline;
}

// ************ Interactive with canvas

function checkSelection(point) {
    var selectedLine = gMeme.lines.find((line) => {
        return point.y <= line.y + line.size * 3 && point.y >= line.y;
    });

    if (!selectedLine) return;
}

function changeXAndYPos(diff) {
    let currentLine = getCurrentLine();

    currentLine.x += diff.x;
    currentLine.y += diff.y;
}

// !Unused
function selectLineByCanvas(position) {
    if (getCurrentLine()) return;

    var newLine = gMeme.lines.findIndex((line) => {
        return line.x < position.x && line.x + line.size < position.x && line.y < position.y && line.y + line.size > position.y;
    });
    setCurrentSelectedLine(newLine);
}

// !Unused
function setNewYPosition(yPos) {
    let currentLine = getCurrentLine();

    currentLine.y = yPos * calcImgRatio();
}

// !Unused
function setNewXPosition(xPos) {
    let currentLine = getCurrentLine();

    currentLine.x = xPos * calcImgRatio();
}

// !Unused
function calcImgRatio() {
    let img = getCurrentImg();

    var res = Math.max(img.naturalHeight, img.naturalWidth) / Math.min(img.naturalHeight, img.naturalWidth);

    if (img.naturalHeight >= img.naturalWidth) res *= 2;

    return res;
}
