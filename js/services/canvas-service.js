'use strict';

var gCanvas;
var gCtx;

var gAllObjectOnCanvas;

const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

var gCurrShape;
var gCurrentColor;
var gCurrentBgColor;

var gTouchStartPos, gTouchEndPos;
var gCurrentClickPos;

var gStringToPrint;

var gFreeStylePath;

var gDensity;

function initCanvasService() {
    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d');

    resizeCanvas();

    gAllObjectOnCanvas = [];

    gCurrShape = 'line';
    gCurrentColor = '#000';
    gCurrentBgColor = '#fff';

    gTouchStartPos = null;
    gTouchEndPos = null;
    gCurrentClickPos = 0;
    gDensity = 2;

    gFreeStylePath = [];

    gStringToPrint = '';
}

function getCanvas() {
    return gCanvas;
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');

    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
}

function resizeCanvasByImageSize(img) {
    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = img.width;
    gCanvas.height = img.height;
}

function setShape(option) {
    var shape = option.value;
    gCurrShape = shape;

    if (shape === 'text') setStringToPrint(prompt('What to print?'));
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

function setStringToPrint(str) {
    gStringToPrint = '';
    if (str) gStringToPrint = str;
}

function drawImg() {
    var elImg = document.querySelector('img');
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
}

function drawImg2(src) {
    var img = new Image();
    img.src = src;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawMeme();
    };
}

function drawImg3() {
    var img = new Image();
    img.src =
        'https://steamuserimages-a.akamaihd.net/ugc/940586530515504757/CDDE77CB810474E1C07B945E40AE4713141AFD76/';
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

function drawTriangle(firstPoint, x, y, xEnd = 250, yEnd = 250) {
    gCtx.beginPath();
    gCtx.lineWidth = gDensity;
    gCtx.moveTo(firstPoint.x, firstPoint.y);
    gCtx.lineTo(x, y);
    gCtx.lineTo(xEnd, yEnd);
    gCtx.closePath();
    // gCtx.lineTo(x, y);

    gCtx.fillStyle = gCurrentBgColor;
    gCtx.fill();
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
    gCtx.strokeStyle = gCurrentColor;
    gCtx.stroke();
    gCtx.fillStyle = gCurrentBgColor;
    gCtx.fill();
}

function drawTextByLine(line, idx) {
    gCtx.font = `${line.size}px ${line.font}`;

    gCtx.fillStyle = line.color;
    gCtx.strokeStyle = 'black';

    let curerntPosition = {
        x: getCanvasCenterWidth() - gCtx.measureText(line.txt).width / 2,
        y: line.size * 1.5 * (idx + 1),
    };

    drawText(line.txt, curerntPosition);
}

function drawText(text, pos = { x: 100, y: 200 }) {
    gCtx.lineWidth = gDensity;
    // gCtx.font = `${size}px ${font}`;

    // gCtx.fillStyle = color;
    // gCtx.strokeStyle = 'black';

    gCtx.fillText(text, pos.x, pos.y);
    gCtx.strokeText(text, pos.x, pos.y);
}

function drawFreeStyle(allPoints) {
    allPoints.forEach((point) => {
        drawLine(point.x, point.y, point.x + 1, point.y + 1, gDensity);
    });
}

function drawFreeStyleRec(allPoints) {
    allPoints.forEach((point) => {
        drawRect(
            point.x,
            point.y,
            point.x + gDensity * 7,
            point.y + gDensity * 7,
        );
    });
}

function drawFreeStyleIntegraRec(allPoints) {
    allPoints.forEach((point, idx) => {
        if (!idx) {
            drawRect(point.x, point.y, point.x + 20, point.y + 20);
            return;
        }
        if (idx % gDensity !== 0) {
            return;
        }

        let prevX = allPoints[idx - 1].x;
        let prevY = allPoints[idx - 1].y;

        let currentWidth = (point.x - prevX) * 10;
        let currentHeight = (point.y - prevY) * 10;

        drawRect(
            point.x,
            point.y,
            point.x + currentWidth,
            point.y + currentHeight,
        );
    });
}

function drawFreeStyleIntegraCircle(allPoints) {
    allPoints.forEach((point, idx) => {
        if (!idx) {
            drawArc(point.x, point.y, 20);
            return;
        }
        if (idx % gDensity !== 0) {
            return;
        }

        let prevX = allPoints[idx - 1].x;
        let prevY = allPoints[idx - 1].y;

        let currentWidth = (point.x - prevX) * 10;
        let currentHeight = (point.y - prevY) * 10;
        let radius = (currentHeight + currentWidth) / 2;
        radius = Math.abs(radius);

        drawArc(point.x, point.y, radius);
    });
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function drawMeme() {
    let meme = getCurrentMeme();

    if (!meme) return;
    meme.lines.forEach((line, idx) => {
        drawTextByLine(line, idx);
    });
}

function getCanvasCenterWidth() {
    return gCanvas.width / 2;
}

function getCanvasCenterHeight() {
    return gCanvas.height / 2;
}

function repaint() {
    drawImg2(getCurrentImg().src);
}

function draw() {
    switch (gCurrShape) {
        case 'line':
            drawLine(
                gTouchStartPos.x,
                gTouchStartPos.y,
                gTouchEndPos.x,
                gTouchEndPos.y,
            );

            gAllObjectOnCanvas.push({
                shape: 'line',
                innerData: [
                    gTouchStartPos.x,
                    gTouchStartPos.y,
                    gTouchEndPos.x,
                    gTouchEndPos.y,
                ],
            });
            break;

        case 'triangle':
            console.log('in');
            drawTriangle(
                gCurrentClickPos,
                gTouchStartPos.x,
                gTouchStartPos.y,
                gTouchEndPos.x,
                gTouchEndPos.y,
            );

            gAllObjectOnCanvas.push({
                shape: 'triangle',
                innerData: [
                    gCurrentClickPos,
                    gTouchStartPos.x,
                    gTouchStartPos.y,
                    gTouchEndPos.x,
                    gTouchEndPos.y,
                ],
            });
            break;

        case 'rect':
            drawRect(
                gTouchStartPos.x,
                gTouchStartPos.y,
                gTouchEndPos.x,
                gTouchEndPos.y,
            );

            gAllObjectOnCanvas.push({
                shape: 'rect',
                innerData: [
                    gTouchStartPos.x,
                    gTouchStartPos.y,
                    gTouchEndPos.x,
                    gTouchEndPos.y,
                ],
            });
            break;

        case 'text':
            drawText(gStringToPrint, gCurrentClickPos);

            gAllObjectOnCanvas.push({
                shape: 'text',
                innerData: [gStringToPrint],
            });
            break;

        // Flow brushes ----------------------

        case 'free-style-flow':
            drawFreeStyle(gFreeStylePath);
            break;

        case 'rect-flow':
            drawFreeStyleRec(gFreeStylePath);
            break;

        case 'integrative-rect-flow':
            drawFreeStyleIntegraRec(gFreeStylePath);
            break;
        case 'integrative-rect-flow':
            drawFreeStyleIntegraRec(gFreeStylePath);
            break;

        case 'integrative-circle-flow':
            drawFreeStyleIntegraCircle(gFreeStylePath);
            break;
    }
}
