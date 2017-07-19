var COMMON_QUERY_PROVINCE = $("#COMMON_QUERY_PROVINCE").val();
var COMMON_QUERY_CITY = $("#COMMON_QUERY_CITY").val();
var MAIN_MANAGE_ANALYSIS_QUERY_BINDING = $("#MAIN_MANAGE_ANALYSIS_QUERY_BINDING").val();
var MAIN_MANAGE_ANALYSIS_EXPORT_BINDING = $("#MAIN_MANAGE_ANALYSIS_EXPORT_BINDING").val();
var MAIN_MANAGE_ANALYSIS_QUERY_USE = $("#MAIN_MANAGE_ANALYSIS_QUERY_USE").val();
var MAIN_MANAGE_ANALYSIS_EXPORT_USE = $("#MAIN_MANAGE_ANALYSIS_EXPORT_USE").val();

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
	loading_province("search_bd");
	loading_city("search_bd");
	
	loading_province("search_yy");
	loading_city("search_yy");
	
	$("#search_bd_province").change(function() {
		loading_city("search_bd");
	});
	$("#search_bd_city").change(function() {
		generate_rep_bd_table();
	});
	$("#query_bd_btn").click(function() {
		generate_rep_bd_table();
	});
	$("#export_bd_btn").click(function() {
		export_bd_table();
	});
	
	$("#search_yy_province").change(function() {
		loading_city("search_yy");
	});
	$("#search_yy_city").change(function() {
		generate_rep_yy_table();
	});
	$("#query_yy_btn").click(function() {
		generate_rep_yy_table();
	});
	$("#export_yy_btn").click(function() {
		export_yy_table();
	});
	
	$(".fastTime-endDate").blur(function() {
		changeCustomTime();
	});
	$(".fastTime-startDate").blur(function() {
		changeCustomTime();
	});
	
	$(".fastTime .active").click();
	
	//generate_rep_bd_table();
	//generate_rep_yy_table();

});

function loading_province(id) {
	var param = {}
	var submitData = {
		api : COMMON_QUERY_PROVINCE,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			$("#"+id+"_province option").remove();
			var datas = json.data;
			var provinceList = datas.provinceList;
			for (var i = 0; i < provinceList.length; i++) {
				$("#"+id+"_province").append('<option value="'+provinceList[i].id+'">'+provinceList[i].value+'</option>');
			}
			$("#"+id+"_province").trigger("chosen:updated");
		} else {
			PromptBox.alert(json.ret.msg);
		}
		
	});
}

function loading_city(id) {
	var param = {
		provinceid : $("#"+id+"_province").val()
	};
	var submitData = {
		api : COMMON_QUERY_CITY,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == 200) {
			$("#"+id+"_city option").remove();
			var datas = json.data;
			var cityList = datas.cityList;
			for (var i = 0; i < cityList.length; i++) {
				$("#"+id+"_city").append('<option value="'+cityList[i].id+'">'+cityList[i].value+'</option>');
			}
			$("#"+id+"_city").trigger("chosen:updated");
			
			if (id.indexOf('bd') > -1) {
				generate_rep_bd_table();
			} else {
				generate_rep_yy_table();
			}
		} else {
			PromptBox.alert(json.ret.msg);
		}
		
	});
}


function generate_rep_bd_table() {
	App.datatables();
	var rownum = 1;
	GHBB.prompt("正在加载~");
	var aoColumns = [ {
		"mDataProp" : "orderid",
		"bVisible" : false //此列不显示
	}, {
		"sTitle" : "代理商名称",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "dls_name"
	}, {
		"sTitle" : "学校数量",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "campus_total",
		"sType": "campus-total"
	}, {
		"sTitle" : "学生数量",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "student_total"
	}, {
		"sTitle" : "学生绑定数量",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "student_binding"
	}, {
		"sTitle" : "学生绑定率",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "student_lv",
		"sType": "number-fate"
	}, {
		"sTitle" : "老师数量",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "teacher_total"
	}, {
		"sTitle" : "老师绑定数量",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "teacher_binding"
	}, {
		"sTitle" : "老师绑定率",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "teacher_lv",
		"sType": "number-fate"
	}];
	
	$('#rep-bd-datatable').dataTable({
		"iDisplayLength" : 50,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				provinceid : $("#search_bd_province").val(),
				cityid : $("#search_bd_city").val(),
				dls_name : $("#search_bd_dls").val()
			};
			aoData.push( { "name": "api", "value": MAIN_MANAGE_ANALYSIS_QUERY_BINDING } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
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
		"bSort" : true,
		"bServerSide" : false,// false为前端分页
		"aaSorting" : [[ 0, "asc" ], [ 5, "desc" ], [ 8, "desc" ]],
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});

}

function generate_rep_yy_table() {
	if ($("#startDate").val() == '' || $("#endDate").val() == '') {
		PromptBox.alert("请选择日期!");
		return false;
	}
	GHBB.prompt("正在推送~");
//	App.datatables();
	var rownum = 1;
	
	var aoColumns = [ {
		"mDataProp" : "dlsId",
		"bVisible" : false //此列不显示
	}, {
		"sTitle" : "代理商名称",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "dls_name"
	}, {
		"sTitle" : "学校数量",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "campus_total",
		"sType": "campus-total"
	}, {
		"sTitle" : "消息数",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "msg_total"
	}, {
		"sTitle" : "新闻公告数",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "xwgg_total"
	}, {
		"sTitle" : "课堂动态数",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "ktdt_total"
	}, {
		"sTitle" : "班级圈数",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "bjq_total"
	}, {
		"sTitle" : "宝宝作品数",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "bbzp_total"
	}, {
		"sTitle" : "积分",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "jf_total"
	}];
	
	$('#rep-yy-datatable').dataTable({
		"iDisplayLength" : 50,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				provinceid : $("#search_yy_province").val(),
				cityid : $("#search_yy_city").val(),
				dls_name : $("#search_yy_dls").val(),
				startDate : getBeginTime($("#startDate").val()),
				endDate : getEndTime($("#endDate").val())
			};
			aoData.push( { "name": "api", "value": MAIN_MANAGE_ANALYSIS_QUERY_USE } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
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
		"bSort" : true,
		"bServerSide" : false,// false为前端分页
		"aaSorting" : [[ 0, "asc" ]],
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});

}

function export_bd_table() {
	GHBB.prompt("数据导出中~");
	var param = {
		provinceid : $("#search_bd_province").val(),
		cityid : $("#search_bd_city").val(),
		dls_name : $("#search_bd_dls").val()
	};
	var submitData = {
		api : MAIN_MANAGE_ANALYSIS_EXPORT_BINDING,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		GHBB.hide();
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == 200) {
			location.href = ctx + json.data.url;
		} else {
			PromptBox.alert(json.ret.msg);
		}
		
		return false;
	});

}

function export_yy_table() {
	GHBB.prompt("数据导出中~");
	var param = {
		provinceid : $("#search_yy_province").val(),
		cityid : $("#search_yy_city").val(),
		dls_name : $("#search_yy_dls").val(),
		startDate : getBeginTime($("#startDate").val()),
		endDate : getEndTime($("#endDate").val())
	};
	var submitData = {
		api : MAIN_MANAGE_ANALYSIS_EXPORT_USE,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		GHBB.hide();
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == 200) {
			location.href = ctx + json.data.url;
		} else {
			PromptBox.alert(json.ret.msg);
		}
		
		return false;
	});

}

/**
 * 快捷设置时间
 * 
 */
function FastSetUpTime(node) {
	fastTimeType = node.value;
	var startDateInput = $(node).parents(".table-responsive").find('.fastTime-startDate');
	var endDateInput = $(node).parents(".table-responsive").find('.fastTime-endDate');
	if(fastTimeType==0) {
		return;
	} else if(fastTimeType==1) {
		var time = new Date();
		time.setDate(time.getDate() - time.getDay() + 1);
		startDateInput.val(time.getFullYear()+"-"+checkTime(time.getMonth()+1)+"-"+checkTime(time.getDate()));
		$("#startDate").datepicker('setDate', parseDate(startDateInput.val()));
		time.setDate(time.getDate() + 6);
		endDateInput.val(time.getFullYear()+"-"+checkTime(time.getMonth()+1)+"-"+checkTime(time.getDate()));
		$("#endDate").datepicker('setDate', parseDate(endDateInput.val()));
	} else if(fastTimeType==2) {
		var myDate = new Date();
	    var year = myDate.getFullYear();
	    var month = myDate.getMonth()+1;
	    if(month<10) {
	        month = "0"+month;
	    }
	    var firstDay = year+"-"+month+"-"+"01";
	    startDateInput.val(firstDay);
	    $("#startDate").datepicker('setDate', parseDate(startDateInput.val()));
	    myDate = new Date(year,month,0);
	    var lastDay = year+"-"+month+"-"+myDate.getDate();
	    endDateInput.val(lastDay);
	    $("#endDate").datepicker('setDate', parseDate(endDateInput.val()));
	}
}

function changeFastSetUpTime(node) {
	activeTag(node);
	FastSetUpTime(node);
	generate_rep_yy_table();
}

function activeTag(obj) {
	$(obj).parent().children().removeClass("active");
	$(obj).addClass("active");
}

function checkTime(i){
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

function changeCustomTime() {
	$(".fastTime").children().removeClass("active");
	$("#custom-time").addClass("active");
}

function getBeginTime(starttime) {
	return starttime + " 00:00:00";
}

function getEndTime(endtime) {
	return endtime + " 23:59:59";
}

function parseDate(dependedVal) {
	var regEx = new RegExp("\\-","gi");
    dependedVal = dependedVal.replace(regEx, "/");
    var milliseconds = Date.parse(dependedVal);
    var dependedDate = new Date();
    dependedDate.setTime(milliseconds);
    return dependedDate;
}

//百分率排序  
jQuery.fn.dataTableExt.oSort['number-fate-asc']  = function(s1,s2) {  
    s1 = s1.replace('%','');  
    s2 = s2.replace('%','');  
    return s1-s2;  
};  
jQuery.fn.dataTableExt.oSort['number-fate-desc'] = function(s1,s2) {  
    s1 = s1.replace('%','');  
    s2 = s2.replace('%','');  
    return s2-s1;  
};

//中文排序  
jQuery.fn.dataTableExt.oSort['chinese-string-asc']  = function(s1,s2) {  
    return s1.localeCompare(s2);  
};  
jQuery.fn.dataTableExt.oSort['chinese-string-desc'] = function(s1,s2) {  
    return s2.localeCompare(s1);  
};

//学校数量排序  
jQuery.fn.dataTableExt.oSort['campus-total-asc']  = function(s1,s2) {  
    s1 = s1.replace('所','');  
    s2 = s2.replace('所','');  
    return s1-s2;  
};  
jQuery.fn.dataTableExt.oSort['campus-total-desc'] = function(s1,s2) {  
    s1 = s1.replace('所','');  
    s2 = s2.replace('所','');  
    return s2-s1;  
};
