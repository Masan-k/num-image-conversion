/*globals window, document, setInterval, event */
let eBtn00;
let eBtn10;
let eBtn20;
let eBtn30;
let eBtn40;
let eBtn50;
let eBtn60;
let eBtn70;
let eBtn80;
let eBtn90;

let eBtnView;

let eBtnRandom;

let eRdoInput;
let eRdoMode;
let eRdoTest;

function clickBtnView(){
    window.location.href = 'view.html';
}

window.addEventListener('DOMContentLoaded', function() {
    'use strict';
    let el = document.createElement("script");
    el.src = "common.js";
    document.body.appendChild(el);
})

let db;
function clickBtnNum() {
    'use strict';

    let mode;
    for(let i=0;i<eRdoMode.length;i++){
	if(eRdoMode[i].checked){mode = eRdoMode[i].value}
    }
    let rangeIndex = event.currentTarget.dataset['index'];
    if(mode === 'input' && (rangeIndex === 'random' || rangeIndex === 'all')){
        alert('When "input" is selected in the mode, select "number" as the target.');
	return;
	
    }else if(mode === 'test'){
	
	let fromNumber = parseInt(rangeIndex) * 10;
	let wordCount
	
	wordCount = 10;
	let toNumber = fromNumber + wordCount;

	let randomPrams = rangeIndex.split(',');
	console.log(randomPrams);

	if(randomPrams[0] !== 'random'){

	    db.input.where("num")
		.between(fromNumber, toNumber)
		.toArray()
		.then((rec)=>{
		    if(rec.length  === 10){
			window.location.href = mode + '.html?rangeIndex=' + rangeIndex;
		    }else{
			console.log('[errorlog] rec.length -> ' + rec.length);
			alert("There is no target registration. Please enter before the test.");
		    }
		})
		.catch((error)=>{console.log(error);});
	    
	}else{
	    
	    db.input
		.toArray()
		.then((rec)=>{
		    if(rec.length  >= parseInt(randomPrams[1])){
			window.location.href = mode + '.html?rangeIndex=' + rangeIndex;
		    }else{
			console.log('[errorlog] rec.length -> ' + rec.length);
			alert("There is no target registration. Please enter before the test.");
		    }
		})
		.catch((error)=>{console.log(error);});
	    
	    }

    }else{
	window.location.href = mode + '.html?rangeIndex=' + rangeIndex;
    }
}
function getRectColor(count){
    if(count === 0){
        return '#EAECF0';
    }else if(count <= 2){
        return '#6BF8A3';
    }else if(count <= 4){
        return '#00D65D';
    }else if(count <= 6){
        return '#00AF4A';
    }else {
        return '#007839';
    }
}

function drawCtxLastYear() {
    'use strict';

    const X_BLANK_WIDTH = 60;
    const Y_BLANK_WIDTH = 50;
    const RECT_LENGTH = 10;
    const BLANK_LENGTH = 3;
    const INIT_BLANK_HEIGHT = 30;
    const INIT_BLANK_WIDTH = 30;
    const VERTICAL_COUNT = 7;
    const HORIZONTAL_COUNT = 50;

    let canvas = document.getElementById('cvsLastYear');
    let ctx = canvas.getContext('2d'); 

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Character drawing
    ctx.lineWidth = '0.3';
    ctx.textBaseline = 'alphabetic';
    ctx.strokeText('Mon', 5, 50.3);
    ctx.strokeText('Wed', 5, 77.3);
    ctx.strokeText('Fri', 5, 105.3);

    ctx.textBaseline = 'top';
    ctx.strokeText('Less', 500, 130);
    ctx.fillStyle = getRectColor(0);
    ctx.fillRect(528, 133, RECT_LENGTH, RECT_LENGTH)
    
    ctx.textBaseline = 'top';
    ctx.fillStyle = getRectColor(2);
    ctx.fillRect(540, 133, RECT_LENGTH, RECT_LENGTH)

    ctx.fillStyle = getRectColor(4);
    ctx.fillRect(552, 133, RECT_LENGTH, RECT_LENGTH)

    ctx.fillStyle = getRectColor(6);
    ctx.fillRect(564, 133, RECT_LENGTH, RECT_LENGTH)

    ctx.fillStyle = getRectColor(8);
    ctx.fillRect(576, 133, RECT_LENGTH, RECT_LENGTH)

    ctx.strokeText('More', 595, 130);

    //------------------
    //Drawing of shapes
    //------------------
    ctx.lineWidth = '0.2';

    let nowDate = new Date();
    let dayOfWeek = nowDate.getDay();
    
    //--------------
    //DB(getRecord)
    //--------------
    let dateYmd_work = [];    
    let record = new Object();
    let date = [];
    let count_work = [];

    db.play_log.orderBy("log_date")
        .toArray()
	.then((records)=>{
	    for(let i in records){
		dateYmd_work.push(records[i].log_date.split('_')[0]);
	    }
	    let wDate;
	    for(let d in dateYmd_work){
		if(wDate !== dateYmd_work[d]) {
		    wDate = dateYmd_work[d];
		    count_work.push(1);
		    date.push(wDate);
		}else{
		    count_work[count_work.length - 1] += 1;
		}
	    }

	　　record.count = count_work;
	    record.dateYmd = date;

        }).then(()=>{
	    //--------------
	    //draw
	    //--------------
	    let blockCount = (VERTICAL_COUNT * HORIZONTAL_COUNT) + dayOfWeek + 1;
	    let targetDate = new Date();
	    targetDate.setDate(nowDate.getDate() - (blockCount - 1));

	    let dateYmd = targetDate.getFullYear() + ('00' + (targetDate.getMonth()+1)).slice(-2) + ('00' + targetDate.getDate()).slice(-2);
	    let count = 0;

	    for(var x = 0; x <= HORIZONTAL_COUNT - 1; x++){
		for(var y = 0; y <= VERTICAL_COUNT - 1; y++){
			  
		    for (var key in Object.keys(record.dateYmd)){
			if(dateYmd === record.dateYmd[key]){
			    count = record.count[key];
			}
		    }

		    ctx.fillStyle = getRectColor(count);
		    count = 0;
		    ctx.fillRect(INIT_BLANK_WIDTH + (BLANK_LENGTH + RECT_LENGTH) * x, INIT_BLANK_HEIGHT + (BLANK_LENGTH + RECT_LENGTH) * y, RECT_LENGTH, RECT_LENGTH);

		    
		    targetDate.setDate(targetDate.getDate() + 1);
		    dateYmd = targetDate.getFullYear() + ('00' + (targetDate.getMonth()+1)).slice(-2) + ('00' + targetDate.getDate()).slice(-2);
		}
	    }
	    for(var y = 0; y <= dayOfWeek; y++){
		for (var key in Object.keys(record.dateYmd)){
		    if(dateYmd === record.dateYmd[key]){
			count = record.count[key];
		    }
		}

		ctx.fillStyle = getRectColor(count)
		count = 0;
		
		ctx.fillRect(INIT_BLANK_WIDTH + (BLANK_LENGTH + RECT_LENGTH) * HORIZONTAL_COUNT, INIT_BLANK_HEIGHT + (BLANK_LENGTH + RECT_LENGTH) * y, RECT_LENGTH, RECT_LENGTH)
		
		targetDate.setDate(targetDate.getDate() + 1);
		dateYmd = targetDate.getFullYear() + ('00' + (targetDate.getMonth()+1)).slice(-2) + ('00' + targetDate.getDate()).slice(-2);
	    }
	    ctx.stroke();

	}).catch((error)=>{
	    console.log(error);
	});
}


window.onload = function () {
    'use strict';
         
    eRdoMode = document.getElementsByName("rdoMode");
    eRdoInput = document.getElementById("rdoInput");
    eRdoTest = document.getElementById("rdoTest");

    eBtn00 = document.getElementById("btn00");
    eBtn10 = document.getElementById("btn10");
    eBtn20 = document.getElementById("btn20");
    eBtn30 = document.getElementById("btn30");
    eBtn40 = document.getElementById("btn40");
    eBtn50 = document.getElementById("btn50");
    eBtn60 = document.getElementById("btn60");
    eBtn70 = document.getElementById("btn70");
    eBtn80 = document.getElementById("btn80");
    eBtn90 = document.getElementById("btn90");

    eBtnRandom = document.getElementById("btnRandom");
    eBtnView = document.getElementById('btnView');

    eBtnView.addEventListener("click", clickBtnView, false);

    eBtn00.addEventListener("click", clickBtnNum, false);
    eBtn10.addEventListener("click", clickBtnNum, false);
    eBtn20.addEventListener("click", clickBtnNum, false);
    eBtn30.addEventListener("click", clickBtnNum, false);
    eBtn40.addEventListener("click", clickBtnNum, false);
    eBtn50.addEventListener("click", clickBtnNum, false);
    eBtn60.addEventListener("click", clickBtnNum, false);
    eBtn70.addEventListener("click", clickBtnNum, false);
    eBtn80.addEventListener("click", clickBtnNum, false);
    eBtn90.addEventListener("click", clickBtnNum, false);
    eBtnRandom.addEventListener("click", clickBtnNum, false);
    
    //---
    //DB
    //---
    db = getDexie(); 
    db.version(4).stores({
	play_log: getDbColPlayLog(),
	input: getDbColInput(),
	input_back: getDbColInputBack(),
	test: getDbColTest()
    });

    let param = location.search.split('=')
    let mode = null
    if(param.length === 2){
	mode = param[1]
    }
    if(mode === 'test'){
	eRdoTest.checked = true;
    }else if(mode === 'view'){
	eRdoTest.checked = true;
    }else if(mode === 'input'){
	eRdoInput.checked = true;
    }else{
	eRdoTest.checked = true;
    }

    drawCtxLastYear();
}


