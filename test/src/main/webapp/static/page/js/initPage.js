/*
 *  Document   : tablesDatatables.js
 *  Author     : pixelcave
 *  Description: Custom javascript code used in Tables Datatables page
 */
var ctx="";
var currentPage = 1;
var TablesDatatables = function() {

    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
            $('#basic-wizard').formwizard({disableUIStyles: true, inDuration: 0, outDuration: 0});
        }
    };
}();

/**
 * 学期
 * @param page
 */
function chooseXqPage(page){
	changeTab(page);
	currentPage = page;
}
/**
 * 年级
 * @param page
 */
function chooseNjPage(page){
	changeTab(page);
	currentPage = page;
}

/**
 * 班级导入
 * @param page
 */
function chooseBjPage(page){
	changeTab(page);
	currentPage = page;
}
/**
 * 老师导入
 * @param page
 */
function chooseTeacherPage(page){
	changeTab(page);
	currentPage = page;
}
/**
 * 学生导入
 * @param page
 */
function chooseXsjbPage(page){
	changeTab(page);
	currentPage = page;
}

function chooseDeptPage(page){
	changeTab(page);
	currentPage = page;
}

function changeTab(page){
	var classValue="";
	for(var i=1;i<=5;i++){
		if(i==page){
			classValue = "col-xs-2 active";
		}else{
			classValue = "col-xs-2 done";
		}
		document.getElementById("tab"+i).className=classValue;
	}
	
	var step = currentPage - page;
	
	if(step>0){
		clickStep("back",step);
	}else{
		clickStep("next",step);
	}
}

function clickStep(dir,step){
	if(dir == "next"){
		step = -step;
	}
	for(var i=0;i<step;i++){
		document.getElementById(dir).click();
	}
}