'use strict'

const LOCAL_KEY = 'user_pre';



function saveToLocal(item, KEY = LOCAL_KEY) {
    var json = JSON.stringify(item);

    localStorage.setItem(KEY, json);
}


function loadFormStorage(KEY = LOCAL_KEY) {
    var json = localStorage.getItem(KEY);

    json = JSON.parse(json);

    return json;
}