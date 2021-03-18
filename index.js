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

let eBtnRandom;
let eBtnAll;

let eRdoInput;
let eRdoMode;

window.addEventListener('DOMContentLoaded', function() {
    'use strict';
    let el = document.createElement("script");
    el.src = "common.js";
    document.body.appendChild(el);
})

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
        //--------------
	//DB definition
	//--------------
	let db = getDexie(); 

	db.version(2).stores({
	    input: getDbColInput()
	});

	db.input.where("num")
	    .between(parseInt(rangeIndex), parseInt(rangeIndex) + 10)
	    .toArray()
	    .then((rec)=>{
	        if(rec.length  === 10){
	            window.location.href = mode + '.html?rangeIndex=' + rangeIndex;
		}else{
		    alert("There is no target registration. Please enter before the test.");
		}
	    })
	    .catch((error)=>{console.log(error);});

    }else{
	window.location.href = mode + '.html?rangeIndex=' + rangeIndex;
    }
}
window.onload = function () {
    'use strict';
         
    eRdoMode = document.getElementsByName("rdoMode");
    eRdoInput = document.getElementById("rdoInput");
    eRdoInput.checked = true ;
    
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
    eBtnAll= document.getElementById("btnAll");

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
    eBtnAll.addEventListener("click", clickBtnNum, false);
}









