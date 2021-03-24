/*globals window, document, setInterval, event */


window.addEventListener('DOMContentLoaded', function() {
    'use strict';
    let el = document.createElement("script");
    el.src = "common.js";
    document.body.appendChild(el);
})

let db;

window.onload = function () {
    'use strict';

    let eBtnMenu = document.getElementById("btnMenu");
    eBtnMenu.addEventListener("click", clickBtnMenu, false);

    //===
    //DB
    //===
    db = getDexie(); 
    db.version(4).stores({
	play_log: getDbColPlayLog(),
	input: getDbColInput(),
	input_back: getDbColInputBack(), 
	test: getDbColTest()
    });

    //================
    //REGISTERED DATA
    //================
    const body = document.getElementsByTagName("body")[0];
    const tbl = document.createElement("table");
    
    const rowHead = document.createElement("tr");

    const cellNum = document.createElement("th");
    const cellWord = document.createElement('th');
    const cellTime = document.createElement('th');

    const cellData = document.createElement("td");
    
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");


    //-------------
    //table(head)
    //-------------
    cellNum.appendChild(document.createTextNode("NUM"));
    cellWord.appendChild(document.createTextNode("WORD"));
    cellTime.appendChild(document.createTextNode("ANSWER TIME:SEC"));

    rowHead.appendChild(cellNum);
    rowHead.appendChild(cellWord);
    rowHead.appendChild(cellTime);
    
    thead.appendChild(rowHead);
    

    //----------------
    //getLatestRecord
    //----------------

    let latestNum = [];
    //let latestLogDate = [];
    let latestSec = [];

    let num = -1;
    let maxLogDate;
    let sec = -1;

    //Search for "-1" to use "SortBy"
    db.test.where('num').above(-1).sortBy('num').then((rec)=>{

	for(let i in rec){
	    if(num !== -1 && num !== rec[i].num){
		latestNum.push(num);
		//latestLogDate.push(maxLogDate);
		latestSec.push(sec);
	    }

	    if(num !== rec[i].num){
		num = rec[i].num;
		maxLogDate = rec[i].log_date;
		sec = rec[i].sec;   
	
	    }else{
		if(maxLogDate < rec[i].log_date){
		    maxLogDate = rec[i].log_date;
		    sec = rec[i].sec;
		}
	    }
	}
	latestNum.push(num);
	//latestLogDate.push(maxLogDate);
	latestSec.push(sec);

    }).then(() =>{

	//------------
	//table(body)
	//------------
	db.input
	    .orderBy("num")
	    .each((rec)=>{
	       if(rec === undefined){
		    alert("This is an error. I couldn't get the answer.");

		}else{
		    const cellNum = document.createElement('td');
		    const cellWord = document.createElement('td');
		    const cellSec = document.createElement('td');

		    const rowData = document.createElement("tr");

		    cellNum.appendChild(document.createTextNode(to2Digit(rec.num)));
		    cellWord.appendChild(document.createTextNode(rec.word));

		    let sec = -1;
		    for(let i in latestNum){

			if(rec.num === latestNum[i]){
			    sec = latestSec[i];
			    break;
			}
		    }
		    cellSec.appendChild(document.createTextNode(sec));

		    rowData.appendChild(cellNum);
		    rowData.appendChild(cellWord);
		    rowData.appendChild(cellSec);

		    tbody.appendChild(rowData);
		}
		
	    }).catch((error)=>{console.log(error);})
   
	tbl.appendChild(thead);
	tbl.appendChild(tbody);
	body.appendChild(tbl);

    }).catch((error)=>{console.log(error);})
	
}

