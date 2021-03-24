function getDexie(){
    return new Dexie('num-image-conversion');
}

function getDbColPlayLog(){
    return  "&log_date, mode, range_index";
}

function getDbColInput(){
    return  "&num, word, log_date";
}

function getDbColInputBack(){
    return "++id, num, log_date, word, insert_date";
}

function getDbColTest(){
    return "++id, num, log_date, word, sec";
}

function getLogdate(){
     'use strict';

    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = ('00' + (nowDate.getMonth()+1)).slice(-2);
    let day = ('00' + nowDate.getDate()).slice(-2);
    let hour = ('00' + nowDate.getHours()).slice(-2);
    let minute = ('00' + nowDate.getMinutes()).slice(-2);
    let second = ('00' + nowDate.getSeconds()).slice(-2);

    return year + month + day + '_' + hour + minute + second;
}

function clickBtnMenu(){
    'use strict';
    
    window.location.href = 'index.html';
    //window.location.href = 'https://masan-k.github.io/num-image-conversion/'
    
}

function to2Digit(num){
    'use strict';
    return ('0' + num).slice(-2);
}


