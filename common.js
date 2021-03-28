function getDexie(){
    'use strict';
    return new Dexie('num-image-conversion');
}

function getDbColPlayLog(){
    'use strict';
    return  "&log_date, mode, range_index";
}

function getDbColInput(){
    'use strict';
    return  "&num, word, log_date";
}

function getDbColInputBack(){
    'use strict';
    return "++id, num, log_date, word, insert_date";
}

function getDbColTest(){
    'use strict';
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

function clickBtnMenu(mode){
    'use strict';
    
    if(typeof mode === "object"){
	window.location.href = 'index.html';
    }else{
	window.location.href = 'index.html?mode=' + mode;
    }
}

function to2Digit(num){
    'use strict';
    return ('0' + num).slice(-2);
}


