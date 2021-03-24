/*globals window, document, setInterval, event , localStorage */

let eBtnStart;
let eBtnPass;
let eBtnEntry;
let eTxtInput;
let eBtnMenu;
let eLblStatus;
let eLblWaitCount;
let eLblNumber;
let eLblCorrectCount;
let eLblNumberQuestions;

let eLblMissAnswer;

const WAIT_MAX_COUNT = 10;
let waitCount = WAIT_MAX_COUNT;

let currentIndex;
let currentCorrect;
let missNumber = [];
let missAnswer = [];
let correctCount;
let intervalId;

let rangeIndex = 0;
let answers = [];

let recWord;
let recSec;
let recNum;
let recStartTime;

let startNumber;

function init(){
    currentIndex = 0;
    correctCount = 0;
    waitCount = WAIT_MAX_COUNT;

    setWaitCount();

    eLblCorrectCount.innerText = '0';
    eLblMissAnswer.innerText = 'none';

    eLblNumber.innerText = 'XX'; 
    eLblNumberQuestions.innerText = currentIndex + '/' + answers.length;
    

    eLblStatus.innerText = 'Waiting for start';
    eTxtInput.value = '';

    eBtnEntry.disabled = false;
    eBtnPass.disabled = false;
    eBtnStart.disabled = false;

    missNumber = [];
    missAnswer = [];

    recWord = [];
    recSec = [];
    recNum = [];
}


function getRandom(min, max) {
    'use strict';
    
    let range = max - min + 1;
    let ramdomRange = Math.floor(Math.random() * range);
    let randomNum = ramdomRange + min;
    return randomNum;
}


function getShuffle(rec){
    let workRecord = rec.slice();
    let newRecord = [];
    let maxIndex;
    let randomIndex;
    let newRec;

    while(newRecord.length < rec.length){
        maxIndex = workRecord.length - 1;
        randomIndex = getRandom(0, maxIndex);
        newRecord.push(workRecord[randomIndex]);
        workRecord.splice(randomIndex, 1);
    }
    return newRecord;

}

function loadCorrectAnswer(rangeId){
    db.input.where("num")
    	.between(parseInt(rangeId), parseInt(rangeId) + 10)
	.toArray()
	.then((rec)=>{
           if(rec === undefined){
	        alert("This is an error. I couldn't get the answer.");
	    }else{
	        answers = getShuffle(rec);
	    }
	})
	.catch((error)=>{console.log(error);});
}    

function saveScore(){
    let logDate = getLogdate();

    db.play_log.add({log_date:logDate,mode:'test',range_index:rangeIndex});
    for(let i in recNum){
	db.test.add({num:recNum[i], log_date:logDate, word:recWord[i], sec:recSec[i]});
    }
}

function setClear() {
    'use strict';
    eLblStatus.innerText = "Clear!!";
    eLblCorrectCount.innerText = correctCount;
    eLblNumberQuestions.innerText = currentIndex + '/' + answers.length;
    
    saveScore();

    eLblWaitCount = '';
    clearInterval(intervalId);

    eBtnEntry.disabled = true;
    eBtnPass.disabled = true;

    let answer = '';
    for(let i in missNumber){
        answer = answer + missAnswer[i] + '(' + missNumber[i] + ')' + '\n';
    }
    eLblMissAnswer.innerText = answer

}

function clickBtnPass() {
    'use strict';

    missNumber.push(answers[currentIndex].num);
    missAnswer.push('none');
    
    eTxtInput.value = '';
    setRecord();


    if(currentIndex !== answers.length){
        currentIndex += 1;
        if(currentIndex !== answers.length){
            setQuestion(currentIndex, correctCount);
        }else{
            eLblNumberQuestions.innerText = currentIndex + '/' + answers.length;
            setClear();
	}
    }
}


function setWaitCount() {
    'use strict';
    let str = ' ';
    for(let i = 0;i < waitCount; i++){
        str = str + '*';
    }
    eLblWaitCount.innerText = str;
}

function setQuestion(currentId, correctCnt){
    'use strict';

    eLblNumberQuestions.innerText = currentId + '/' + answers.length;
    eLblCorrectCount.innerText = correctCnt;

    eLblNumber.innerText = to2Digit(answers[currentId].num);
    currentCorrect = answers[currentId].word.split(',');
    eTxtInput.value = '';
    waitCount = WAIT_MAX_COUNT;
    setWaitCount();
}

function countdown() {
    'use strict';
    waitCount -= 1;
    if(0 < waitCount){setWaitCount();}
    else{clickBtnPass();}       
}

function setStartTimer() {
    let nowDate = new Date();
    recStartTime = nowDate.getTime();
}

function setRecord(){
    recWord.push(eTxtInput.value);
    recNum.push(answers[currentIndex].num);

    let nowDate = new Date()
    let sec = (nowDate.getTime() - recStartTime) / 1000 ;
    recSec.push(sec);
    recStartTime = nowDate.getTime();
}


function clickBtnStart() {
    'use strict';
    setQuestion(currentIndex, correctCount);
    intervalId = setInterval(countdown, 1000);

    eBtnStart.disabled = true;
    eLblStatus.innerText = 'Please enter the answer';

    setStartTimer();
}


function clickBtnEntry(){
    'use strict';
    
    if(currentCorrect.includes(eTxtInput.value)){
        setRecord();

        currentIndex += 1;
        correctCount += 1;

        if(currentIndex !== answers.length){
            eLblStatus.innerText = "OK";
            setQuestion(currentIndex, correctCount); 
            
        }else{
	    setClear();
        }
    }else{
        eLblStatus.innerText = "NG";
        missNumber.push(answers[currentIndex].num);
        missAnswer.push(eTxtInput.value);
    }
}
window.addEventListener('DOMContentLoaded', function() {
    'use strict';
    let el = document.createElement("script");
    el.src = "common.js";
    document.body.appendChild(el);
})


function keyInput() {
    'use strict';
    const KEYCODE_ENTER = 13;
    if(currentIndex >= answers.length){
        return;
    }
    if(event.keyCode === KEYCODE_ENTER) {
        event.preventDefault();
        clickBtnEntry();
    }
}
let db;
window.onload = function () {
    'use strict';

    document.body.onkeyup = keyInput;

    eBtnStart = document.getElementById("btnStart");
    
    eBtnEntry= document.getElementById("btnEntry");
    eBtnPass = document.getElementById("btnPass");
    eBtnMenu= document.getElementById("btnMenu");
    eTxtInput = document.getElementById("txtInput");

    eLblStatus = document.getElementById("lblStatus");
    eLblWaitCount = document.getElementById("lblWaitCount");
    eLblMissAnswer = document.getElementById("lblMissAnswer");
    eLblCorrectCount= document.getElementById("lblCorrectCount");
    eLblNumber = document.getElementById("lblNumber");
    eLblNumberQuestions = document.getElementById("lblNumberQuestions");
 
    eBtnMenu= document.getElementById("btnMenu");
    eBtnPass.addEventListener("click", clickBtnPass, false);
    eBtnEntry.addEventListener("click", clickBtnEntry, false);
    eBtnMenu.addEventListener("click", clickBtnMenu, false);
    eBtnStart.addEventListener("click", clickBtnStart, false);

    //--------------
    //DB definition
    //--------------
    db = getDexie(); 

    db.version(4).stores({
	play_log: getDbColPlayLog(),
	input: getDbColInput(),
	test: getDbColTest()
    });
    
    //--------------
    //DB definition
    //--------------
    let param = location.search.split('=')
    if(param.length !== 2){
	alert('There are no parameters in the URL. Please start from the menu.');
    }else{
	startNumber = param[1] * 10;
	console.log('startNumber -> ' + startNumber);
	loadCorrectAnswer(startNumber);
    }

    init();

}


