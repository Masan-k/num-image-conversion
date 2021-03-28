/*globals window, document, setInterval, event */


window.addEventListener('DOMContentLoaded', function() {
    'use strict';
    let el = document.createElement("script");
    el.src = "common.js";
    document.body.appendChild(el);
})
function clickBtnMenuView(){
    'use strict';
    clickBtnMenu('view');
}
window.onload = function () {
    'use strict';

    let eBtnMenu = document.getElementById("btnMenu");
    eBtnMenu.addEventListener("click", clickBtnMenuView, false);

    //===
    //DB
    //===
    let db;
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
    const rowHeadSub = document.createElement("tr");

    const cellNum = document.createElement("th");
    const cellWord = document.createElement('th');
    const cellCount = document.createElement('th');
    const cellSec = document.createElement('th');
    const cellLatest = document.createElement('th');
    const cellAverage = document.createElement('th');
    const cellWorst = document.createElement('th');
    const cellBest = document.createElement('th');

    const cellData = document.createElement("td");
    
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    //-------------
    //table(head)
    //-------------
    cellNum.rowSpan = "2";
    cellNum.appendChild(document.createTextNode("NUM"));
   
    cellWord.rowSpan = "2";
    cellWord.appendChild(document.createTextNode("WORD"));

    cellCount.rowSpan = "2";
    cellCount.width = "100";
    cellCount.appendChild(document.createTextNode("COUNT"));

    cellSec.colSpan = "4";
    cellSec.appendChild(document.createTextNode("SEC"));
    
    cellLatest.width = "80";
    cellLatest.appendChild(document.createTextNode("LATEST"));

    cellAverage.width = "80";
    cellAverage.appendChild(document.createTextNode("AVG"));

    cellBest.width = "80";
    cellBest.appendChild(document.createTextNode("BEST"));

    cellWorst.width = "80";
    cellWorst.appendChild(document.createTextNode("WORST"));
    
    rowHead.appendChild(cellNum);
    rowHead.appendChild(cellWord);
    rowHead.appendChild(cellCount);
    rowHead.appendChild(cellSec);
    
    rowHeadSub.appendChild(cellLatest);
    rowHeadSub.appendChild(cellAverage);
    rowHeadSub.appendChild(cellBest);
    rowHeadSub.appendChild(cellWorst);
    
    thead.appendChild(rowHead);
    thead.appendChild(rowHeadSub);
    
    //----------------
    //getLatestRecord
    //----------------

    let recordNum = [];
    let recordCount = [];
    let latestSec = [];
    let recordSumSec = [];
    let recordWorstSec = [];
    let recordBestSec = [];

    let maxLogDate;
    let num = -1;
    let sec = -1;
    let cnt = 1;
    let sumSec = 0; //use average!
    let worstSec = -1;
    let bestSec = 9999;

    //Search for "-1" to use "SortBy"
    db.test.where('num').above(-1).sortBy('num').then((rec)=>{

	for(let i in rec){
	    if(num !== -1 && num !== rec[i].num){
		recordNum.push(num);
		recordCount.push(cnt);
		
		latestSec.push(sec);
		recordSumSec.push(sumSec);
		recordWorstSec.push(worstSec);
		recordBestSec.push(bestSec);
	    }

	    if(num !== rec[i].num){
		num = rec[i].num;
		maxLogDate = rec[i].log_date;
		sec = rec[i].sec;

		worstSec = sec;
		bestSec = sec;
		sumSec = sec;
		cnt = 1;
	    }else{
		if(maxLogDate < rec[i].log_date){
		    maxLogDate = rec[i].log_date;
		    sec = rec[i].sec;
		}
		if(worstSec < rec[i].sec){worstSec = rec[i].sec;}
		if(bestSec > rec[i].sec){bestSec = rec[i].sec;}

		sumSec += sec;
		cnt += 1;
	    }
	}
	recordNum.push(num);
	
	recordSumSec.push(sumSec)
	latestSec.push(sec);

	recordWorstSec.push(worstSec);
	recordBestSec.push(bestSec);

	recordCount.push(cnt);
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
		    const cellLatest = document.createElement('td');
		    const cellAverage = document.createElement('td');
		    const cellWorst = document.createElement('td');
		    const cellBest = document.createElement('td');
		    const cellCount = document.createElement('td');

		    const rowData = document.createElement("tr");

		    cellNum.align = "center";
		    cellNum.appendChild(document.createTextNode(to2Digit(rec.num)));
		    cellWord.appendChild(document.createTextNode(rec.word));

		    let sec = '-';
		    let cnt = 0;
		    let avgSec = '-';
		    let wstSec = '-';
		    let bstSec = '-';
		    for(let i in recordNum){

			if(rec.num === recordNum[i]){
			    sec = Math.round(latestSec[i] * Math.pow(10, 1)) / Math.pow(10,1);
			    cnt = recordCount[i];
			    avgSec = recordSumSec[i] / cnt;
			    avgSec = Math.round(avgSec * Math.pow(10, 1)) / Math.pow(10,1);
			    wstSec = Math.round(recordWorstSec[i] * Math.pow(10, 1)) / Math.pow(10,1);
			    bstSec = Math.round(recordBestSec[i] * Math.pow(10, 1)) / Math.pow(10,1);   
			    break;

			}
		    }

		    cellLatest.align = "right";
		    cellLatest.appendChild(document.createTextNode(sec));
		    cellCount.align = "right";
		    cellCount.appendChild(document.createTextNode(cnt));
		    cellAverage.align = "right";
		    cellAverage.appendChild(document.createTextNode(avgSec));
		    cellWorst.align = "right";
		    cellWorst.appendChild(document.createTextNode(wstSec));
		    cellBest.align = "right";
		    cellBest.appendChild(document.createTextNode(bstSec));

		    rowData.appendChild(cellNum);
		    rowData.appendChild(cellWord);
		    rowData.appendChild(cellCount);
		    rowData.appendChild(cellLatest);
		    rowData.appendChild(cellAverage);
		    rowData.appendChild(cellBest);
		    rowData.appendChild(cellWorst);

		    tbody.appendChild(rowData);
		}
		
	    }).catch((error)=>{console.log(error);})
   
	tbl.appendChild(thead);
	tbl.appendChild(tbody);
	body.appendChild(tbl);

    }).catch((error)=>{console.log(error);})
	
}

