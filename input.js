/*globals window, document, setInterval, event */

let eBtnEntry;
let eTxtInput;
let eLblNumber;
let eBtnMenu;

let inputWord = [];
let inputNumber = [];

const db = new Dexie('num-image-conversion');

function keyInput() {
    'use strict';
    const KEYCODE_ENTER = 13;
    if(event.keyCode === KEYCODE_ENTER) {
        clickBtnEntry();
    }
}

function getLogdate(){
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = ('00' + (nowDate.getMonth()+1)).slice(-2);
    let day = ('00' + nowDate.getDate()).slice(-2);
    let hour = ('00' + nowDate.getHours()).slice(-2);
    let minute = ('00' + nowDate.getMinutes()).slice(-2);
    let second = ('00' + nowDate.getSeconds()).slice(-2);

    return year + month + day + '_' + hour + minute + second;
}

function saveScore(){
    'use strict';

    let logDate = getLogdate();

    db.play_log.add({log_date:logDate,mode:'input',range_index:rangeIndex});

    for(let i in inputNumber){

	db.input
	    .get(inputNumber[i])
	    .then((dbData)=>{
		if(dbData === undefined){
		    //new data
		    console.log('!!!! INSERT !!!!'); 
		    db.input.add({num:inputNumber[i], word:inputWord[i], logDate});
		}else{
		    console.log('!!!! UPDATE !!!!'); 
		    if(inputWord[i] !== dbData.word){
			db.input_back.add({num:dbData.num,log_date:logDate,word:dbData.word,insert_date:dbData.log_date});
		    }

		    //delete & insert
		    db.input.delete(inputNumber[i])
		    db.input.add({num:inputNumber[i], word:inputWord[i], log_date:logDate});
		}
	    })
	    .catch((error)=>{console.log(error);});
    }

}
function clickBtnMenu(){
    'use strict';
    
    //window.location.href = 'index.html';
    window.location.href = 'https://masan-k.github.io/num-image-conversion/'
    
}
function clickBtnEntry(){
    'use strict';
    
    if(eTxtInput.value.trim().length===0){
	alert('Input is required.');
	return;
    }

    if(currentNumber >= endNumber){return}

    inputWord.push(eTxtInput.value);
    inputNumber.push(currentNumber);

    currentNumber += 1;
    if(currentNumber < endNumber){
	eLblNumber.innerText = to2Digit(currentNumber);
	eTxtInput.value = '';
    }else{
        saveScore();
        eLblNumber.innerText = to2Digit(rangeIndex) + '-' + rangeIndex + 9
	eTxtInput.value = 'Completion of registration';
	console.log('call saveScore!!!!!!');
    }
}

let endNumber;
let currentNumber;
let rangeIndex;

function to2Digit(num){
    'use strict';
    return ('0' + num).slice(-2);
}


window.onload = function () {
    'use strict';
    
    document.body.onkeyup = keyInput;

    eBtnEntry = document.getElementById("btnEntry");
    eBtnMenu = document.getElementById("btnMenu");
    eTxtInput = document.getElementById("txtInput");
    eLblNumber = document.getElementById("lblNumber");
    eBtnEntry.addEventListener("click", clickBtnEntry, false);
    eBtnMenu.addEventListener("click", clickBtnMenu, false);

    //
    let param = location.search.split('=')
    rangeIndex = param[1]
    eLblNumber.innerText = to2Digit(rangeIndex);

    currentNumber = parseInt(rangeIndex);
    endNumber = parseInt(rangeIndex) + 10;

    //---
    //DB
    //---
    db.version(2).stores({
	play_log: "&log_date, mode, range_index",
	input: "&num, word, log_date",
	input_back: "&[num+log_date], word, insert_date",
	test: "&[num+log_date], word, sec"
    });



}


