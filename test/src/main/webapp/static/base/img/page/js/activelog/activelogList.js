var xxType = $("#xxType").val();
var commonUrl_ajax = $("#commonUrl_ajax").val();

var ctx = "";
var repPage = function() {
	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$(document).ready(function() {
	setOriginalDate();
	queryCountryTownList();
	
	$("#query_activelog_detail").click(function (){
		queryActivelogDetail();
	});
	
	$("#search_campus_countrytown").change(function (){
		queryActivelogDetail();
	});
	
	$("#search_countrytown").change(function (){
		queryActivelog();
	});
	
	$("#query_activelog").click(function (){
		queryActivelog();
	});
	
	$("#callActivelogService").click(function (){
		callActivelogService();
	});
	
	
});


function queryCountryTownList(){
	var param = {};
	var submitData = {
		api : ApiParamUtil.QUERY_CAMPUS_COUNTRYTOWN_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			initActivelogDetail(result);
			initActivelog(result);
		}else{
			console.log(result.ret.code+":"+result.ret.msg);
		}
	});
}

function initActivelogDetail(result){
	$("#search_campus_countrytown option").remove();
	for (var i = 0; i < result.data.length; i++) {
		$("#search_campus_countrytown")
			.append("<option value=" + result.data[i].value + ">" + result.data[i].name + "</option>");
	}
	$("#search_campus_countrytown option").eq(0).attr("selected", true);
	$("#search_campus_countrytown").trigger("chosen:updated");
	queryActivelogDetail();
}

function initActivelog(result){
	$("#search_countrytown option").remove();
	for (var i = 0; i < result.data.length; i++) {
		$("#search_countrytown")
			.append("<option value=" + result.data[i].value + ">" + result.data[i].name + "</option>");
	}
	$("#search_countrytown option").eq(0).attr("selected", true);
	$("#search_countrytown").trigger("chosen:updated");
	queryActivelog();
}

//设置初始日期
function setOriginalDate(){
	var currentDate = new Date();
	currentDate.setTime(currentDate.getTime()-24*60*60*1000);
	var day = currentDate.getDate();
	
	$("#startDate").datepicker('setDate','-'+day+'d');
	$("#endDate").datepicker('setDate','-1d');
	$("#starttime").datepicker('setDate','-'+day+'d');
	$("#endtime").datepicker('setDate','-1d');
}

function queryActivelogDetail() {
	GHBB.prompt("正在加载~");
	if ($("#startDate").val() == '' || $("#endDate").val() == '') {
		PromptBox.alert("请选择日期!");
		return false;
	}
	
	App.datatables();
	var aoColumns = [ {
		"sTitle" : "学校",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "campus"
	}, {
		"sTitle" : "老师",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "creator"
	}, {
		"sTitle" : "信息更新内容",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "title"
	}, {
		"sTitle" : "所属模块",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "module"
	}, {
		"sTitle" : "日期",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "createtime"
	}];

	
	$('#rep-activelog-detail-datatable').dataTable({
		"iDisplayLength" : 50,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				campus : $("#search_campus_name").val(),
				starttime : getBeginTime($("#startDate").val()),
				endtime : getEndTime($("#endDate").val()),
				countrytown : $("#search_campus_countrytown").val()
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.ANALYSIS_STATISTICS_DETAIL_REPORT } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
			aoData.push( { "name": "sEcho", "value": 0 } );
		},
		"fnServerData": function (sSource, aoData, fnCallback) {
            $.ajax( {
                "dataType": 'json',
                "type": "POST",
                "url": sSource,
                "data": aoData,
                "success": function(json) {
                	if (json.ret.code == 200) {
                		fnCallback(json.data);
                	} else {
                		PromptBox.alert(json.ret.msg);
                	}
				}             
            } );
        },
		"bServerSide" : true, //服务器端必须设置为true
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});

}

function queryActivelog() {
	GHBB.prompt("正在加载~");
	if ($("#starttime").val() == '' || $("#endtime").val() == '') {
		PromptBox.alert("请选择日期!");
		return false;
	}
	
	App.datatables();
	var aoColumns = [ {
		"sTitle" : "区域",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "countrytown"
	}, {
		"sTitle" : "学校名称",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "campus"
	}, {
		"sTitle" : "教师人数",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "teachercount"
	}, {
		"sTitle" : "信息发布数",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "msgcount"
	}, {
		"sTitle" : "登录次数",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "logincount"
	}];

	
	$('#rep-activelog-datatable').dataTable({
		"iDisplayLength" : 50,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				campus : $("#search_campus").val(),
				starttime : getBeginTime($("#starttime").val()),
				endtime : getEndTime($("#endtime").val()),
				countrytown : $("#search_countrytown").val()
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.ANALYSIS_STATISTICS_REPORT } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
			aoData.push( { "name": "sEcho", "value": 0 } );
		},
		"fnServerData": function (sSource, aoData, fnCallback) {
            $.ajax( {
                "dataType": 'json',
                "type": "POST",
                "url": sSource,
                "data": aoData,
                "success": function(json) {
                	if (json.ret.code == 200) {
                		fnCallback(json.data);
                	} else {
                		PromptBox.alert(json.ret.msg);
                	}
				}             
            } );
        },
		"bServerSide" : true, //服务器端必须设置为true
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});

}




///**
// * 快捷设置时间
// * 
// */
//function FastSetUpTime(node) {
//	fastTimeType = node.value;
//	var startDateInput = $(node).parents(".table-responsive").find('.fastTime-startDate');
//	var endDateInput = $(node).parents(".table-responsive").find('.fastTime-endDate');
//	if(fastTimeType==0) {
//		return;
//	} else if(fastTimeType==1) {
//		var time = new Date();
//		time.setDate(time.getDate() - time.getDay() + 1);
//		startDateInput.val(time.getFullYear()+"-"+checkTime(time.getMonth()+1)+"-"+checkTime(time.getDate()));
//		$("#startDate").datepicker('setDate', parseDate(startDateInput.val()));
//		time.setDate(time.getDate() + 6);
//		endDateInput.val(time.getFullYear()+"-"+checkTime(time.getMonth()+1)+"-"+checkTime(time.getDate()));
//		$("#endDate").datepicker('setDate', parseDate(endDateInput.val()));
//	} else if(fastTimeType==2) {
//		var myDate = new Date();
//	    var year = myDate.getFullYear();
//	    var month = myDate.getMonth()+1;
//	    if(month<10) {
//	        month = "0"+month;
//	    }
//	    var firstDay = year+"-"+month+"-"+"01";
//	    startDateInput.val(firstDay);
//	    $("#startDate").datepicker('setDate', parseDate(startDateInput.val()));
//	    myDate = new Date(year,month,0);
//	    var lastDay = year+"-"+month+"-"+myDate.getDate();
//	    endDateInput.val(lastDay);
//	    $("#endDate").datepicker('setDate', parseDate(endDateInput.val()));
//	}
//}

function getBeginTime(starttime) {
	return starttime + " 00:00:00";
}

function getEndTime(endtime) {
	return endtime + " 23:59:59";
}

function callActivelogService(){
	if($("#starttime").val()==undefined || $("#endtime").val()==undefined){
		alert("请设置初始时间");
		return;
	}
	var param = {
		starttime : getBeginTime($("#starttime").val()),
		endtime : getEndTime($("#endtime").val())
	};
	var submitData = {
		api : ApiParamUtil.ANALYSIS_CALL_ACTIVELOGSERVICE,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			initActivelogDetail(result);
			initActivelog(result);
		}else{
			console.log(result.ret.code+":"+result.ret.msg);
		}
	});
}
