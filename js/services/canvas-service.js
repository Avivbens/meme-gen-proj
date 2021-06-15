'use strict';

var gCanvas;
var gCtx;

const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

var gCurrShape;
var gCurrentColor;
var gCurrentBgColor;

var gDensity;

function initCanvasService() {
    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d');

    addListeners();

    gCurrentColor = '#000';
    gCurrentBgColor = '#fff';

    gDensity = 2;
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');

    let currImg = getCurrentImg();
    elContainer.style.width = currImg.width;
    elContainer.style.height = currImg.height;

    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
}

function resizeCanvasByImgSize(img) {
    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = img.width;
    gCanvas.height = img.height;
}

function setColor(color) {
    gCurrentColor = color.value;
}

function setBgColor(color) {
    gCurrentBgColor = color.value;
}

function setDensity(newD) {
    gDensity = newD;
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL();
    console.log('DATA', data);
    elLink.href = data;
    elLink.download = 'Your Meme';
}

function drawImg() {
    var elImg = document.querySelector('img');
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
}

/**
 * Drawing all Meme properties
 * @param {String} src
 */
function drawCanvas(src) {
    var img = new Image();
    img.src = src;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        // drawImgScaled(img);
        drawMeme();
    };
}

/**
 * Drawing img on the canvas with rect around
 * @param {Image} img
 */
function drawImg2(line, idx) {
    var img = new Image();
    img.src = line.stickerImg;

    // Rect
    if (getCurrentMeme().selectedLineIdx === idx) {
        gCtx.fillStyle = 'rgb(56 59 66 / 44%)';
        gCtx.fillRect(line.x - 15, line.y - 15, line.size + 35, line.size + 35);
    }

    // Point of scale
    // drawArc(line.x + 20 + line.size, line.y + line.size + 20, 10);
    // drawArc(line.x - 15, line.y - 15, 10);

    gCtx.drawImage(img, line.x, line.y, line.size, line.size);
}

// ! Unused
function drawImgScaled(img) {
    var hRatio = gCanvas.width / img.width;
    var vRatio = gCanvas.height / img.height;
    var ratio = Math.max(hRatio, vRatio);
    var centerShift_x = (gCanvas.width - img.width * ratio) / 2;
    var centerShift_y = (gCanvas.height - img.height * ratio) / 2;
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    gCtx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}

function drawImg3() {
    var img = new Image();
    img.src = 'https://steamuserimgs-a.akamaihd.net/ugc/940586530515504757/CDDE77CB810474E1C07B945E40AE4713141AFD76/';
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    };
}

function drawLine(x, y, xEnd = 250, yEnd = 250, width = gDensity) {
    gCtx.beginPath();
    gCtx.lineWidth = width;
    gCtx.moveTo(x, y);
    gCtx.lineTo(xEnd, yEnd);
    gCtx.closePath();
    gCtx.strokeStyle = gCurrentColor;
    gCtx.stroke();
}

function drawRect(x, y, xEnd = 150, yEnd = 150) {
    gCtx.beginPath();
    gCtx.rect(x, y, xEnd - x, yEnd - y);
    gCtx.fillStyle = gCurrentBgColor;
    gCtx.fillRect(x, y, xEnd - x, yEnd - y);
    gCtx.strokeStyle = gCurrentColor;
    gCtx.stroke();
}

function drawArc(x, y, r) {
    gCtx.beginPath();
    gCtx.lineWidth = 3;
    gCtx.arc(x, y, r, 0, 2 * Math.PI);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.fillStyle = 'lightblue';
    gCtx.fill();
}

function drawTextByLine(line, idx) {
    // Text
    gCtx.font = `${line.size}px ${line.font}`;

    // Adding bold if needed
    if (line.isBold) gCtx.font = `bold ${line.size}px ${line.font}`;

    // Saving current position of each line
    var currentPos = { x: line.x, y: line.y };
    if (!line.x && !line.y) {
        currentPos = {
            x: getCanvasCenterWidth() - gCtx.measureText(line.txt).width / 2,
            y: line.size * 2 * (idx + 1),
        };

        line.x = currentPos.x;
        line.y = currentPos.y;
    }

    // Rect
    if (getCurrentMeme().selectedLineIdx === idx) {
        gCtx.fillStyle = 'rgb(56 59 66 / 44%)';
        gCtx.fillRect(0, currentPos.y - line.size * 1, gCanvas.width, line.size * 1.5);
    }

    // Underline
    if (line.isUnderline) {
        gCtx.fillStyle = 'black';
        gCtx.strokeStyle = 'black';

        let underLine = '_';
        underLine = underLine.repeat(line.txt.length);

        gCtx.textBaseline = 'middle';
        gCtx.fillText(underLine, currentPos.x, currentPos.y);
        gCtx.strokeText(underLine, currentPos.x, currentPos.y);
    }

    // Text
    gCtx.font = `${line.size}px ${line.font}`;

    // Adding bold if needed
    if (line.isBold) gCtx.font = `bold ${line.size}px ${line.font}`;

    gCtx.fillStyle = line.color;
    gCtx.strokeStyle = line.strokeColor;

    gCtx.textBaseline = 'alphabetic';

    drawText(line.txt, currentPos);
}

function drawText(text, pos = { x: 100, y: 200 }) {
    gCtx.lineWidth = gDensity;
    // gCtx.font = `${size}px ${font}`;

    // gCtx.fillStyle = color;
    // gCtx.strokeStyle = 'black';

    gCtx.fillText(text, pos.x, pos.y);
    gCtx.strokeText(text, pos.x, pos.y);
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function drawMeme() {
    let meme = getCurrentMeme();

    if (!meme) return;
    meme.lines.forEach((line, idx) => {
        if (!line.isSticker) {
            drawTextByLine(line, idx);
        } else {
            drawImg2(line, idx);
        }
    });
}

function getCanvasCenterWidth() {
    return gCanvas.width / 2;
}

function getCanvasCenterHeight() {
    return gCanvas.height / 2;
}

function getCanvasHeight() {
    return gCanvas.height;
}

function repaint() {
    drawCanvas(getCurrentImg().src);
}
