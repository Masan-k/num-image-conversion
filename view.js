/*globals window, document, setInterval, event */

window.addEventListener('DOMContentLoaded', function() {
    'use strict';
    let el = document.createElement("script");
    el.src = "common.js";
    document.body.appendChild(el);
})

window.onload = function () {
    'use strict';
    
    //===
    //DB
    //===
    let db = getDexie(); 
    db.version(2).stores({
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

    const cellData = document.createElement("td");
    
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    let textNode;

    //-------------
    //table(head)
    //-------------
    textNode = document.createTextNode("NUM");
    cellNum.appendChild(textNode);

    textNode = document.createTextNode("WORD");
    cellWord.appendChild(textNode);

    rowHead.appendChild(cellNum);
    rowHead.appendChild(cellWord);
    thead.appendChild(rowHead);

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
                const rowData = document.createElement("tr");

		textNode = document.createTextNode(to2Digit(rec.num));
		cellNum.appendChild(textNode);

		textNode = document.createTextNode(rec.word);
		cellWord.appendChild(textNode);

		rowData.appendChild(cellNum);
		rowData.appendChild(cellWord);

                tbody.appendChild(rowData);
	    }
	    
	})
	.catch((error)=>{console.log(error);});
   
    tbl.appendChild(thead);
    tbl.appendChild(tbody);
    body.appendChild(tbl);
}

