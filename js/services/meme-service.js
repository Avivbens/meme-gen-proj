'use strict';

var gKeywords = { happy: 12, 'funny puk': 1 };
var gImgs = [
    { id: 1, url: 'img/2.jpg', keywords: ['happy'] },
    { id: 2, url: 'img/003.jpg', keywords: ['happy'] },
    { id: 3, url: 'img/004.jpg', keywords: ['happy'] },
    { id: 4, url: 'img/5.jpg', keywords: ['happy'] },
    { id: 5, url: 'img/005.jpg', keywords: ['happy'] },
    { id: 6, url: 'img/006.jpg', keywords: ['happy'] },
    { id: 7, url: 'img/8.jpg', keywords: ['happy'] },
    { id: 8, url: 'img/9.jpg', keywords: ['happy'] },
    { id: 9, url: 'img/12.jpg', keywords: ['happy'] },
    { id: 10, url: 'img/19.jpg', keywords: ['happy'] },
    { id: 11, url: 'img/Ancient-Aliens.jpg', keywords: ['happy'] },
    { id: 12, url: 'img/drevil.jpg', keywords: ['happy'] },
    { id: 13, url: 'img/img2.jpg', keywords: ['happy'] },
    { id: 14, url: 'img/img4.jpg', keywords: ['happy'] },
    { id: 15, url: 'img/img5.jpg', keywords: ['happy'] },
    { id: 16, url: 'img/img6.jpg', keywords: ['happy'] },
    { id: 17, url: 'img/img11.jpg', keywords: ['happy'] },
    { id: 18, url: 'img/img12.jpg', keywords: ['happy'] },
    { id: 19, url: 'img/leo.jpg', keywords: ['happy'] },
    { id: 20, url: 'img/meme1.jpg', keywords: ['happy'] },
    { id: 21, url: 'img/One-Does-Not-Simply.jpg', keywords: ['happy'] },
    { id: 22, url: 'img/Oprah-You-Get-A.jpg', keywords: ['happy'] },
    { id: 23, url: 'img/patrick.jpg', keywords: ['happy'] },
    { id: 24, url: 'img/putin.jpg', keywords: ['happy'] },
    { id: 25, url: 'img/X-Everywhere.jpg', keywords: ['happy'] },
];

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        { txt: 'I never eat Falafel', size: 20, align: 'left', color: 'red' },
    ],
};

function getImages() {
    return gImgs;
}
