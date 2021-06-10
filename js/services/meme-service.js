'use strict';

var gKeywords;
var gImgs;

var gMeme;

function initMeme() {
    gImgs = [
        { id: 1, url: 'img/2.jpg', keywords: ['happy'] },
        { id: 2, url: 'img/003.jpg', keywords: ['trump', 'angry'] },
        { id: 3, url: 'img/004.jpg', keywords: ['love', 'dogs', 'dog'] },
        { id: 4, url: 'img/5.jpg', keywords: ['strong', 'baby'] },
        { id: 5, url: 'img/005.jpg', keywords: ['sleep', 'baby', 'resting'] },
        { id: 6, url: 'img/006.jpg', keywords: ['cat', 'sleep'] },
        { id: 7, url: 'img/8.jpg', keywords: ['crepy', 'clown'] },
        { id: 8, url: 'img/9.jpg', keywords: ['baby', 'evil'] },
        { id: 9, url: 'img/12.jpg', keywords: ['truth'] },
        { id: 10, url: 'img/19.jpg', keywords: ['angry'] },
        {
            id: 11,
            url: 'img/Ancient-Aliens.jpg',
            keywords: ['aliens', 'history'],
        },
        { id: 12, url: 'img/drevil.jpg', keywords: ['drevil'] },
        {
            id: 13,
            url: 'img/img2.jpg',
            keywords: ['happy', 'dance', 'joy', 'funny'],
        },
        {
            id: 14,
            url: 'img/img4.jpg',
            keywords: ['trump', 'angry', 'fuckoff'],
        },
        { id: 15, url: 'img/img5.jpg', keywords: ['baby', 'spooky'] },
        { id: 16, url: 'img/img6.jpg', keywords: ['dog', 'rest', 'chill'] },
        { id: 17, url: 'img/img11.jpg', keywords: ['obama', 'laughing'] },
        { id: 18, url: 'img/img12.jpg', keywords: ['kiss', 'nba'] },
        { id: 19, url: 'img/leo.jpg', keywords: ['decaprio', 'salute'] },
        { id: 20, url: 'img/meme1.jpg', keywords: ['spy'] },
        {
            id: 21,
            url: 'img/One-Does-Not-Simply.jpg',
            keywords: ['explain', 'difficult'],
        },
        {
            id: 22,
            url: 'img/Oprah-You-Get-A.jpg',
            keywords: ['opera', 'happy'],
        },
        { id: 23, url: 'img/patrick.jpg', keywords: ['ohh no', 'patrick'] },
        { id: 24, url: 'img/putin.jpg', keywords: ['putin', 'peace out'] },
        { id: 25, url: 'img/X-Everywhere.jpg', keywords: ['spooky'] },
    ];

    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Put your text here',
                size: 40,
                font: 'Impact',
                align: 'middle',
                color: 'white',
                isUnderline: false,
                isBold: false,
                x: 250,
                y: 80,
            },
        ],
    };

    gKeywords = { happy: 12, 'funny puk': 1 };
}

function generateKeyWords() {
    let copyOfImgs = JSON.parse(JSON.stringify(gImgs));

    let keysMap = copyOfImgs.reduce((acc, img) => {
        img.keywords.forEach((keyword) => {
            acc[keyword] = acc[keyword] ? acc[keyword] + 1 : 1;
        });
        return acc;
    }, {});

    return keysMap;
}

/**
 * @returns All Images
 */
function getImages() {
    return gImgs;
}

/**
 * @returns Current selected img in Img object
 */
function getCurrentImg() {
    let imgById = gImgs.find((img) => {
        return img.id === +gMeme.selectedImgId;
    });

    let img = new Image();
    img.src = imgById.url;

    return img;
}

function getImageById(id) {
    let imgById = gImgs.find((img) => {
        return img.id === +id;
    });

    return imgById;
}

function getCurrentMeme() {
    return gMeme;
}

/**
 * Set current meme img by element from dom
 * @param {Element} img
 */
function setCurrentMemeImgByEl(img) {
    let imgId = img.dataset['id'];
    gMeme.selectedImgId = imgId;
}

function setCurrentMemeImgId(imgId) {
    gMeme.selectedImgId = +imgId;
}

function setCurrentSelectedLine(idx) {
    gMeme.selectedLineIdx = +idx;
}

function setAllMemeProp(meme) {
    gMeme = meme;
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
    let wordsCounter = loadFormStorage('words_popularity');
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
    arrangePositionByAlign();
}

// *************

/**
 * Adding new line and move to it
 */
function addNewLine() {
    gMeme.lines.push({
        txt: 'Put your text here',
        size: 40,
        font: 'Impact',
        align: 'middle',
        color: 'white',
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

function toggleBold() {
    var currentLine = getCurrentLine();

    if (!currentLine) return;

    currentLine.isBold = !currentLine.isBold;
}

function toggleUnderline() {
    var currentLine = getCurrentLine();

    if (!currentLine) return;

    currentLine.isUnderline = !currentLine.isUnderline;
}

/**
 * Calculate the estimated position X of the line based on align
 */
function arrangePositionByAlign() {
    let currentLine = getCurrentLine();
    if (!currentLine) return;

    switch (currentLine.align) {
        case 'middle':
            currentLine.x =
                getCanvasCenterWidth() -
                gCtx.measureText(currentLine.txt).width / 2;
            break;
        case 'right':
            currentLine.x =
                getCanvasCenterWidth() * 2 -
                gCtx.measureText(currentLine.txt).width -
                20;
            break;
        case 'left':
            currentLine.x = 20;
            break;

        default:
            currentLine.x = 0;
            break;
    }
}

// ************ Interactive with canvas

function checkSelection(point) {
    var selectedLine = gMeme.lines.find((line) => {
        return point.y <= line.y + line.size * 3 && point.y >= line.y;
    });

    if (!selectedLine) return;
}

function setNewYPosition(yPos) {
    let currentLine = getCurrentLine();

    currentLine.y = yPos * _calcImageRatio();
}

function _calcImageRatio() {
    let currImg = getCurrentImg();

    return (currImg.height * 1.4) / currImg.width;
}
