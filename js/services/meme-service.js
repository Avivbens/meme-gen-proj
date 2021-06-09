'use strict';

var gKeywords;
var gImgs;

var gMeme;

function initMeme() {
    gKeywords = { happy: 12, 'funny puk': 1 };
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
        selectedImgId: 5,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Put your text here',
                size: 40,
                font: 'Impact',
                align: 'left',
                color: 'white',
            },
        ],
    };
}

function getImages() {
    return gImgs;
}

function getCurrentImg() {
    let imgById = gImgs.find((img) => {
        return img.id === +gMeme.selectedImgId;
    });

    let img = new Image();
    img.src = imgById.url;

    return img;
}

function getCurrentMeme() {
    return gMeme;
}

function setCurrentMemeImg(img) {
    let imgId = img.dataset['id'];
    gMeme.selectedImgId = imgId;
}

function setCurrentSelectedLine(idx) {
    gMeme.selectedLineIdx = idx;
}

function getCurrentLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function addNewLine() {
    gMeme.lines.push({
        txt: 'Put your text here',
        size: 40,
        font: 'Impact',
        align: 'left',
        color: 'white',
    });

    gMeme.selectedLineIdx++;
}
