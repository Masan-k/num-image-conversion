/*globals window, document, setInterval, event , localStorage */

let eBtnStart;
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
let correctAnswer = [];
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
  'use strict';
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
  eBtnStart.disabled = false;

  missNumber = [];
  missAnswer = [];
  correctAnswer = [];

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
  'use strict';
  let workRecord = rec.slice();
  let newRecord = [];
  let maxIndex;
  let randomIndex;

  while(newRecord.length < rec.length){
    maxIndex = workRecord.length - 1;
    randomIndex = getRandom(0, maxIndex);
    newRecord.push(workRecord[randomIndex]);
    workRecord.splice(randomIndex, 1);
  }
  return newRecord;
}

function loadCorrectAnswerRandom(qCount){

  //Search for "-1" to use "SortBy"
  db.test.where('log_date').above(-1).reverse().sortBy('log_date').then((rec)=>{
    //
    //Error if the number tested is less than the specified number.
    if(sumRec.length === undefined || sumRec.length < qCount){
      alert('This is an error. The number tested is less than or equal to the specified number.');
      return;
    }

    //for(let i in rec){ console.log(rec[i].num + ':' + rec[i].sec);}
    let sortRec = getSortNum(rec)
    let sumRec = getRecordSummary(sortRec)
    let worstCount = qCount / 3;
    let avgCount = qCount / 3;
    let testCount = qCount / 3;
    let workRec = Object.create(sumRec);

    let questionNum = [];
    let questionSec = []; //test code

    //-------------------------------------------
    //get max average
    //-------------------------------------------
    let writeCount = 0;
    while(writeCount < avgCount){

      let maxSec = -1;
      let maxIndex = -1;

      for(let i in workRec.num){
        let avgSec = workRec.sumSec[i] / workRec.count[i]; 
        if(avgSec > maxSec){
          maxIndex = i;
          maxSec = avgSec;
        }
      }

      questionNum.push(workRec.num[maxIndex]);
      questionSec.push(maxSec);

      workRec.num.splice(maxIndex, 1);
      workRec.sumSec.splice(maxIndex, 1);
      workRec.worstSec.splice(maxIndex, 1);
      workRec.bestSec.splice(maxIndex, 1);
      workRec.count.splice(maxIndex, 1);
      workRec.latestSec.splice(maxIndex, 1);   

      writeCount += 1
    }
    //
    //-------------------------------------------
    //get max worst
    //-------------------------------------------
    writeCount = 0;
    while(writeCount < avgCount){
      let maxSec = -1;
      let maxIndex = -1;

      for(let i in workRec.num){
        if(workRec.worstSec[i] > maxSec){
          maxIndex = i;
          maxSec = workRec.worstSec[i] ;
        }
      }

      questionNum.push(workRec.num[maxIndex]);
      questionSec.push(maxSec);

      workRec.num.splice(maxIndex, 1);
      workRec.sumSec.splice(maxIndex, 1);
      workRec.worstSec.splice(maxIndex, 1);
      workRec.bestSec.splice(maxIndex, 1);
      workRec.count.splice(maxIndex, 1);
      workRec.latestSec.splice(maxIndex, 1);   

      writeCount += 1
    }
    //
    //-------------------------------------------
    //Get the one with the least number of tests
    //-------------------------------------------
    writeCount = 0;
    while(writeCount < testCount){

      let minCount = 9999999;
      let minIndex = -1;

      for(let i in workRec.num){
        if(workRec.count[i] < minCount){
                      minIndex = i;
                      minCount = workRec.count[i] ;
        }
      }

      questionNum.push(workRec.num[minIndex]);
      questionSec.push(minCount);

      workRec.num.splice(minIndex, 1);
      workRec.sumSec.splice(minIndex, 1);
      workRec.worstSec.splice(minIndex, 1);
      workRec.bestSec.splice(minIndex, 1);
      workRec.count.splice(minIndex, 1);
      workRec.latestSec.splice(minIndex, 1);   

      writeCount += 1
    }

    db.input.bulkGet(questionNum).then((rec)=>{
      console.log("rec:"+rec)
      if(rec.length === 0){
        alert("This is an error. I couldn't get the answer.");
      }else{
        //console.log('rec[0].num : '+ rec[0].num);
        //console.log('rec[1].word : ' + rec[0].word);
        answers = getShuffle(rec);
      }
    }).catch((error)=>{console.log(error);});
  }).catch((error)=>{console.log(error);})
}

function loadCorrectAnswer(startNum, questionCount = 10){
 
  db.input.where("num")
    .between(parseInt(startNum), parseInt(startNum) + parseInt(questionCount))
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
  'use strict';
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

  let answer = '';
  for(let i in missNumber){
    answer = answer + missAnswer[i] + '(' + to2Digit(missNumber[i]) + ')' + '>>' + correctAnswer[i] + '\n';
  }
  eLblMissAnswer.innerText = answer

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
  else{
    missNumber.push(answers[currentIndex].num);
    missAnswer.push('NO ANSWER');
    correctAnswer.push(currentCorrect);
    
    eTxtInput.value = '';

    const isTimeup = true;
    setRecord(isTimeup);

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
}

function setStartTimer() {
  'use strict';
  let nowDate = new Date();
  recStartTime = nowDate.getTime();
}

function setRecord(isTimeup){
  'use strict';

  let nowDate = new Date()
  let sec = (nowDate.getTime() - recStartTime) / 1000 ;
  recStartTime = nowDate.getTime();

  if(isTimeup){
    recSec.push(WAIT_MAX_COUNT);
  }else{
    recSec.push(sec);
  }
  recWord.push(eTxtInput.value);
  recNum.push(answers[currentIndex].num);
}


function clickBtnStart() {
  'use strict';
  
  setQuestion(currentIndex, correctCount);
  intervalId = setInterval(countdown, 1000);

  eBtnStart.disabled = true;
  eLblStatus.innerText = 'Please enter the answer';

  document.getElementById("txtInput").focus();
  setStartTimer();
}


function clickBtnEntry(){
  'use strict';
  
  if(currentCorrect.includes(eTxtInput.value)){
    const isTimeup = false;
    setRecord(isTimeup);

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
    correctAnswer.push(currentCorrect);
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
  
  if(event.keyCode === 9){ //9:tab
    clickBtnMenuTest();
  }
  if(event.keyCode === 17){ //17:Ctrl
    clickBtnStart();
  }

  if(currentIndex >= answers.length){
      return;
  }
  if(event.keyCode === KEYCODE_ENTER) {
      event.preventDefault();
      clickBtnEntry();
  }
}
function clickBtnMenuTest(){
  'use strict';
  clickBtnMenu('test');
}

let db;
window.onload = async function () {
  'use strict';

  document.body.onkeyup = keyInput;

  eBtnStart = document.getElementById("btnStart");
  
  eBtnEntry= document.getElementById("btnEntry");
  eBtnMenu= document.getElementById("btnMenu");
  eTxtInput = document.getElementById("txtInput");

  eLblStatus = document.getElementById("lblStatus");
  eLblWaitCount = document.getElementById("lblWaitCount");
  eLblMissAnswer = document.getElementById("lblMissAnswer");
  eLblCorrectCount= document.getElementById("lblCorrectCount");
  eLblNumber = document.getElementById("lblNumber");
  eLblNumberQuestions = document.getElementById("lblNumberQuestions");

  eBtnMenu= document.getElementById("btnMenu");
  eBtnEntry.addEventListener("click", clickBtnEntry, false);
  eBtnMenu.addEventListener("click", clickBtnMenuTest, false);
  eBtnStart.addEventListener("click", clickBtnStart, false);

  //--------------
  //DB definition
  //--------------
  db = getDexie(); 

  db.version(4).stores({
    play_log: getDbColPlayLog(),
    input: getDbColInput(),
    test: getDbColTest(),
    input_back: getDbColInputBack()
  });
    
  //--------------
  //DB definition
  //--------------
  let param = location.search.split('=')
  if(param.length !== 2){
    alert('There are no parameters in the URL. Please start from the menu.');

  }else if(isFinite(param[1])){
    startNumber = param[1] * 10;
    loadCorrectAnswer(startNumber);

  }else{
    let questionCount = param[1].split(',')[1]
    let testAnswer = [];
   
    db.test.toArray().then((rec)=>{
      for(let i = 0; i <= rec.length -1; i++){
        for(let j = 0; j <= 9; j++){
          if(rec[i].num % (j*10) ===0){
            testAnswer.push(j); 
            break;
          }
        }
      }
      //console.log("testAnswer:" + testAnswer);
    })
      if(testAnswer.length <= 9){
        console.log("check2");
        let startNumber = getRandom(0, 7)
        loadCorrectAnswer(startNumber*10,questionCount);
      }else{
        console.log("check3");
        loadCorrectAnswerRandom(questionCount);
      }
  }
  init();
}
