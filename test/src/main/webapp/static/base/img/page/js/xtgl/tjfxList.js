var COMMON_QUERY_CAMPUS = $("#COMMON_QUERY_CAMPUS").val();
var SYS_MANAGE_ANALYSIS_STUDENT_TOTAL = $("#SYS_MANAGE_ANALYSIS_STUDENT_TOTAL").val();
var SYS_MANAGE_ANALYSIS_STUDENT_BINDING = $("#SYS_MANAGE_ANALYSIS_STUDENT_BINDING").val();
var SYS_MANAGE_ANALYSIS_TEACHER_TOTAL = $("#SYS_MANAGE_ANALYSIS_TEACHER_TOTAL").val();
var SYS_MANAGE_ANALYSIS_TEACHER_BINDING = $("#SYS_MANAGE_ANALYSIS_TEACHER_BINDING").val();
var SYS_MANAGE_ANALYSIS_QUERY_BINDING_GROUP_BY_CLASS = $("#SYS_MANAGE_ANALYSIS_QUERY_BINDING_GROUP_BY_CLASS").val();
var SYS_MANAGE_ANALYSIS_QUERY_USE_GROUP_BY_TEACHER = $("#SYS_MANAGE_ANALYSIS_QUERY_USE_GROUP_BY_TEACHER").val();
var SYS_MANAGE_ANALYSIS_EXPORT_USE_GROUP_BY_TEACHER = $("#SYS_MANAGE_ANALYSIS_EXPORT_USE_GROUP_BY_TEACHER").val();
var SYS_MANAGE_ANALYSIS_CHART_MESSAGE = $("#SYS_MANAGE_ANALYSIS_CHART_MESSAGE").val();
var SYS_MANAGE_ANALYSIS_CHART_NEWS = $("#SYS_MANAGE_ANALYSIS_CHART_NEWS").val();
var SYS_MANAGE_ANALYSIS_CHART_CLASS_CIRCLE = $("#SYS_MANAGE_ANALYSIS_CHART_CLASS_CIRCLE").val();
var SYS_MANAGE_ANALYSIS_CHART_BABY_ARTICLE = $("#SYS_MANAGE_ANALYSIS_CHART_BABY_ARTICLE").val();
var SYS_MANAGE_ANALYSIS_CHART_CLASSROOM = $("#SYS_MANAGE_ANALYSIS_CHART_CLASSROOM").val();

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
	
	loading_campus();
	
	$("#detail_yy_btn").click(function() {
		viewDetail();
	});
	
	$("#chart_yy_btn").click(function() {
		viewChart();
	});
	
	$("#query_chart_btn").click(function() {
		query_chart();
	});
	
	$("#query_yy_btn").click(function() {
		generate_rep_yy_table();
	});
	
	$("#export_yy_btn").click(function() {
		export_yy_table();
	});
	
	$("#search_yy_campus").change(function() {
		if ($("#chartDiv").css("display") == "block") {
			query_chart();
		} else {
			generate_rep_yy_table();
		}
	});
	
	$("#search_bd_campus").change(function() {
		changeCampusData();
	});
	
	$(".fastTime-endDate").blur(function() {
		changeCustomTime();
	});
	$(".fastTime-startDate").blur(function() {
		changeCustomTime();
	});
	
	$(".fastTime .active").click();
	
});

function loading_campus() {
	GHBB.prompt("正在加载~");
	var param = {}
	var submitData = {
		api : COMMON_QUERY_CAMPUS,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			$("#search_yy_campus option").remove();
			$("#search_bd_campus option").remove();
			var datas = json.data;
			var campusList = datas.campusList;
			var campusTabHtml = '';
			var spanClass = 'active';
			for (var i = 0; i < campusList.length; i++) {
				$("#search_yy_campus").append('<option value="'+campusList[i].id+'">'+campusList[i].value+'</option>');
				$("#search_bd_campus").append('<option value="'+campusList[i].id+'">'+campusList[i].value+'</option>');
//				campusTabHtml += '<button class="btn btn-alt btn-primary '+spanClass+'" type="button" name="'+campusList[i].id+'" onclick="changeCampusData(this)">'+campusList[i].value+'</button>';
//				spanClass = '';
			}
			$("#search_yy_campus").trigger("chosen:updated");
			$("#search_bd_campus").trigger("chosen:updated");
//			$("#campusTab").html(campusTabHtml);
			
			generate_chart(SYS_MANAGE_ANALYSIS_CHART_MESSAGE);
			
			init_student_data();
			init_teacher_data();
			generate_rep_bd_table();
			
		} else {
			PromptBox.alert(json.ret.msg);
		}
		
	});
}

function query_chart() {
	if ($("#startDate").val() == '' || $("#endDate").val() == '') {
		PromptBox.alert("请选择日期!");
		return false;
	}
	$("#chartTab .active").click();
}

function generate_chart(api) {
	GHBB.prompt("正在加载~");
	var param = {
		campusid : $("#search_yy_campus").val(),
		startDate : getBeginTime($("#startDate").val()),
		endDate : getEndTime($("#endDate").val())
	};
	var submitData = {
		api : api,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		GHBB.hide();
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var dataArr = [];
			var xaxisArr = [];
			var datas = json.data;
			var chartData = datas.chartData;
			for (var i = 0; i < chartData.length; i++) {
				dataArr[i] = [i,chartData[i].total];
				xaxisArr[i] = [i,subDate(chartData[i].date)];
			}
			init_chart(dataArr, xaxisArr);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
	
}

function generate_rep_yy_table() {
	GHBB.prompt("正在加载~");
	if ($("#startDate").val() == '' || $("#endDate").val() == '') {
		PromptBox.alert("请选择日期!");
		return false;
	}
	
	App.datatables();
	var rownum = 1;
	
	
	if (xxType == 1) {
		var aoColumns = [ {
			"sTitle" : "老师姓名",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "teacher_name"
		}, {
			"sTitle" : "消息数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "msg_total"
		}, {
			"sTitle" : "新闻数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "ysxw_total"
		}, {
			"sTitle" : "公告数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "ysgg_total"
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
			"sTitle" : "宝宝相册数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "bbzp_total"
		}, {
			"sTitle" : "积分",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "jf_total"
		}];
	}
	
	if (xxType == 2) {
		var aoColumns = [ {
			"sTitle" : "老师姓名",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "teacher_name"
		}, {
			"sTitle" : "消息数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "msg_total"
		}, {
			"sTitle" : "新闻数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "ysxw_total"
		}, {
			"sTitle" : "公告数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "ysgg_total"
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
			"sTitle" : "作业数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "homeworknumber"
		}, {
			"sTitle" : "积分",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "jf_total"
		}];
	}
	
	
	$('#rep-yy-datatable').dataTable({
		"iDisplayLength" : 50,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				campusid : $("#search_yy_campus").val(),
				startDate : getBeginTime($("#startDate").val()),
				endDate : getEndTime($("#endDate").val()),
				teacher_name : $("#search_teacher_name").val()
			};
			aoData.push( { "name": "api", "value": SYS_MANAGE_ANALYSIS_QUERY_USE_GROUP_BY_TEACHER } );
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
		"bServerSide" : true, //服务器端必须设置为true
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});

}

function export_yy_table() {
	GHBB.prompt("数据导出中~");
	var param = {
		campusid : $("#search_yy_campus").val(),
		startDate : getBeginTime($("#startDate").val()),
		endDate : getEndTime($("#endDate").val()),
		teacher_name : $("#search_teacher_name").val()
	};
	var submitData = {
		api : SYS_MANAGE_ANALYSIS_EXPORT_USE_GROUP_BY_TEACHER,
		param : JSON.stringify(param),
		iDisplayStart : 0,
		iDisplayLength : 5000
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

function generate_rep_bd_table() {
	App.datatables();
	GHBB.prompt("正在加载~");
	var rownum = 1;
	
	var aoColumns = [ {
		"sTitle" : "班级名称",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "class_name"
	}, {
		"sTitle" : "学生数量",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "student_total"
	}, {
		"sTitle" : "绑定数量",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "student_binding"
	}, {
		"sTitle" : "绑定率",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "student_lv"
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
//				campusid : $("#campusTab .active").attr("name")
				campusid : $("#search_bd_campus").val()
			};
			aoData.push( { "name": "api", "value": SYS_MANAGE_ANALYSIS_QUERY_BINDING_GROUP_BY_CLASS } );
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
		"bServerSide" : true, //服务器端必须设置为true
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});

}

function init_student_data() {
	var param = {
//		campusid : $("#campusTab .active").attr("name")
		campusid : $("#search_bd_campus").val()
	};
	var submitData = {
		api : SYS_MANAGE_ANALYSIS_STUDENT_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			var student_total = datas.student_total;
			
			var param = {
				campusid : $("#search_bd_campus").val()
			};
			var submitData = {
				api : SYS_MANAGE_ANALYSIS_STUDENT_BINDING,
				param : JSON.stringify(param)
			};
			$.post(commonUrl_ajax, submitData, function(data) {
				var json = typeof data === "object" ? data : JSON.parse(data);
				if (json.ret.code == "200") {
					var datas = json.data;
					var student_binding = datas.student_binding;
					
					$("#student_total").html(student_total);
					$("#student_binding").html(student_binding);
					
					if (student_total != 0) {
						$("#student_lv").html(toPercent(student_binding/student_total));
						$("#student_pie").attr("data-percent", student_binding*100/student_total);
				        init_pie_chart($("#student_pie"));
					} else {
						$("#student_lv").html("0%");
						$("#student_pie").attr("data-percent", 0);
				        init_pie_chart($("#student_pie"));
					}
					
				} else {
					PromptBox.alert(json.ret.msg);
				}
			});
			
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
	
}

function init_teacher_data() {
	var param = {
//		campusid : $("#campusTab .active").attr("name")
		campusid : $("#search_bd_campus").val()
	};
	var submitData = {
		api : SYS_MANAGE_ANALYSIS_TEACHER_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			var teacher_total = datas.teacher_total;
			
			var param = {
				campusid : $("#search_bd_campus").val()
			};
			var submitData = {
				api : SYS_MANAGE_ANALYSIS_TEACHER_BINDING,
				param : JSON.stringify(param)
			};
			$.post(commonUrl_ajax, submitData, function(data) {
				var json = typeof data === "object" ? data : JSON.parse(data);
				if (json.ret.code == "200") {
					var datas = json.data;
					var teacher_binding = datas.teacher_binding;
					
					$("#teacher_total").html(teacher_total);
					$("#teacher_binding").html(teacher_binding);
					
					if (teacher_total != 0) {
						$("#teacher_lv").html(toPercent(teacher_binding/teacher_total));
				        $("#teacher_pie").attr("data-percent", teacher_binding*100/teacher_total);
				        init_pie_chart($("#teacher_pie"));
					} else {
						$("#teacher_lv").html("0%");
				        $("#teacher_pie").attr("data-percent", 0);
				        init_pie_chart($("#teacher_pie"));
					}
					
				} else {
					PromptBox.alert(json.ret.msg);
				}
			});
			
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function init_pie_chart(obj) {
	obj.easyPieChart({
        barColor: $(this).data('bar-color') ? $(this).data('bar-color') : '#777777',
        trackColor: $(this).data('track-color') ? $(this).data('track-color') : '#eeeeee',
        lineWidth: $(this).data('line-width') ? $(this).data('line-width') : 3,
        size: $(this).data('size') ? $(this).data('size') : '80',
        animate: 800,
        scaleColor: false
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
	if ($("#chartDiv").css("display") == "block") {
		query_chart();
	} else {
		generate_rep_yy_table();
	}
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

function init_chart(dataArr, xaxisArr) {
	var chartClassic = $('#chart-classic');

	$.plot(chartClassic,
	    [
	        {
	            data: dataArr,
	            lines: {show: true, fill: true, fillColor: {colors: [{opacity: 0.15}, {opacity: 0.15}]}},
	            points: {show: true, radius: 5}
	        }
	    ],
	    {
	        colors: ['#3498db', '#333333'],
	        legend: {show: true, position: 'nw', margin: [15, 10]},
	        grid: {borderWidth: 0, hoverable: true, clickable: true},
	        yaxis: {
	        	tickColor: '#eeeeee', 
	        	minTickSize: 1, 
	        	min: 0, 
	        	tickFormatter: function(axis) {
	        		return axis.toString();
                }
	        },
	        xaxis: {ticks: xaxisArr, tickColor: '#ffffff'}
	    }
	);

	var previousPoint = null, ttlabel = null;
	chartClassic.bind('plothover', function(event, pos, item) {

	    if (item) {
	        if (previousPoint !== item.dataIndex) {
	            previousPoint = item.dataIndex;

	            $('#chart-tooltip').remove();
	            var x = item.datapoint[0], y = item.datapoint[1];

	            if (item.seriesIndex === 1) {
	                ttlabel = '<strong>' + y + '</strong> sales';
	            } else {
	                ttlabel = '<strong>' + y + '</strong>';
	            }

	            $('<div id="chart-tooltip" class="chart-tooltip">' + ttlabel + '</div>')
	                .css({top: item.pageY - 45, left: item.pageX + 5}).appendTo("body").show();
	        }
	    }
	    else {
	        $('#chart-tooltip').remove();
	        previousPoint = null;
	    }
	});
}

function changeChartType(api, obj) {
	activeTag(obj);
	generate_chart(api);
}

function changeCampusData() {
//	activeTag(obj);
	init_student_data();
	init_teacher_data();
	generate_rep_bd_table();
}

function activeTag(obj) {
	$(obj).parent().children().removeClass("active");
	$(obj).addClass("active");
}

function viewDetail() {
	$("#detail_btn").css("display","none");
	$("#query_chart").css("display","none");
	$("#chartDiv").css("display","none");
	$("#query_data").css("display","block");
	$("#teacher_name").css("display","block");
	$("#export_btn").css("display","block");
	$("#chart_btn").css("display","block");
	$("#rep-yy-datatable").css("display","block");
	
	generate_rep_yy_table();
}

function viewChart() {
	$("#detail_btn").css("display","block");
	$("#query_chart").css("display","block");
	$("#chartDiv").css("display","block");
	$("#query_data").css("display","none");
	$("#teacher_name").css("display","none");
	$("#export_btn").css("display","none");
	$("#chart_btn").css("display","none");
	$("#rep-yy-datatable_wrapper").css("display","none");
	
	query_chart();
}

function toPercent(data) {
	var strData = parseFloat(data)*10000;
	strData = Math.round(strData);
	strData /= 100.00;
	var ret = strData.toString()+"%";
	return ret;
}

function subDate(date) {
	var dd = date.substr(8);
	if (dd.indexOf('0') == 0) {
		dd = dd.substr(1);
	}
	return dd;
}

function parseDate(dependedVal) {
	var regEx = new RegExp("\\-","gi");
    dependedVal = dependedVal.replace(regEx, "/");
    var milliseconds = Date.parse(dependedVal);
    var dependedDate = new Date();
    dependedDate.setTime(milliseconds);
    return dependedDate;
}
