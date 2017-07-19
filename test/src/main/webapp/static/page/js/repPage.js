var ctx = "";
var repPage = function() {
	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

var repid = $("#repid").val();

$(document).ready(function() {
	$("#repQueryBtn").click(function() {
		generate_rep_table();
	});

	$("#search_EQ_campusid").change(function() {
		generate_rep_table();
	});

});

function generate_rep_table() {
	GHBB.prompt("正在加载~");
	App.datatables();
	var rownum = 1;
	var campusid = $("#search_EQ_campusid").val();
	var sAjaxSource = getUrlByRepid(campusid, repid);
	var aoColumns = getRepColumns(repid);

	$('#rep-datatable').dataTable({
		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : sAjaxSource,
		"sAjaxDataProp" : "aaData",
		"bSort" : false,
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(rownum);
			if (repid == 1001) {
				var html = fillDataColumn(aaData);
				$('td:eq(1)', nRow).html(html);
			}
			if (repid == 1005) {
				var html = fillTjfxDataColumn(aaData);
				$('td:eq(1)', nRow).html(html);
			}

			rownum = rownum + 1;
			return nRow;
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}

function getUrlByRepid(campusid, repid) {
	if (repid == 1001) {
		var per_start_xs = $("#xs_startPercent").val();
		var per_end_xs = $("#xs_endPercent").val();

		var per_start_ls = $("#ls_startPercent").val();
		var per_end_ls = $("#ls_endPercent").val();

		var start_time = $("#search_GTE_dqrq").val();
		var end_time = $("#search_LTE_dqrq").val();

		var param = "search_repid=" + repid;
		param = param + "&search_campusid=" + campusid;
		param = param + "&search_xs_startpre=" + getStartPercent(per_start_xs);
		param = param + "&search_xs_endpre=" + getEndPercent(per_end_xs);
		param = param + "&search_ls_startpre=" + getStartPercent(per_start_ls);
		param = param + "&search_ls_endpre=" + getEndPercent(per_end_ls);
		param = param + "&search_starttime=" + getBeginTime(start_time);
		param = param + "&search_endtime=" + getEndTime(end_time);
		return ctx + "/xtgl/rep/ajax_query_repinfo?" + param;
	} else if (repid == 100101) {
		var param = "search_repid=" + repid;
		param = param + "&search_campusid=" + campusid;
		return ctx + "/xtgl/rep/ajax_query_repinfo?" + param;
	} else if (repid == 1002) {
		var start_time = $("#search_GTE_dqrq").val();
		var end_time = $("#search_LTE_dqrq").val();
		var param = "search_repid=" + repid;
		param = param + "&search_campusid=" + campusid;
		param = param + "&search_starttime=" + getBeginTime(start_time);
		param = param + "&search_endtime=" + getEndTime(end_time);
		return ctx + "/xtgl/rep/ajax_query_repinfo?" + param;
	} else if (repid == 1003) {
		var param = "search_repid=" + repid;
		param = param + "&search_campusid=" + campusid;
		return ctx + "/xtgl/rep/ajax_query_repinfo?" + param;
	} else if (repid == 1004) {
		var param = "search_repid=" + repid;
		param = param + "&search_campusid=" + campusid;
		return ctx + "/xtgl/rep/ajax_query_repinfo?" + param;
	} else if (repid == 1005) {
		var param = "search_repid=" + repid;
		param = param + "&search_userid=" + $("#search_EQ_dls").val();
		return ctx + "/xtgl/rep/ajax_query_repinfo?" + param
		
	} else if (repid == 100501) {
		var param = "search_repid=" + repid;
		param = param + "&search_dlsid=" + campusid;
		return ctx + "/xtgl/rep/ajax_query_repinfo?" + param
		
	}
	return "";
}

function getRepColumns(repid) {
	GHBB.prompt("正在加载~");
	var aoColumns = [];
	if (repid == 1001) {
		aoColumns = [ {
			"sTitle" : "序号",
			"sWidth" : "60px",
			"sClass" : "text-center",
			"mDataProp" : "campusid"
		}, {
			"sTitle" : "学校",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "campus"
		}, {
			"sTitle" : "学生数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_count"
		}, {
			"sTitle" : "学生绑定数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_bd_count"
		}, {
			"sTitle" : "绑定率（%）",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_percent"
		}, {
			"sTitle" : "教师数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tch_count"
		}, {
			"sTitle" : "教师绑定数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tch_bd_count"
		}, {
			"sTitle" : "绑定率（%）",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tch_percent"
		}, {
			"sTitle" : "接入时间",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "date"
		} ];
	} else if (repid == 100101) {
		aoColumns = [ {
			"sTitle" : "序号",
			"sWidth" : "60px",
			"sClass" : "text-center",
			"mDataProp" : "bjid"
		}, {
			"sTitle" : "班级",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "bjmc"
		}, {
			"sTitle" : "学生数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_count"
		}, {
			"sTitle" : "学生绑定数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_bd_count"
		}, {
			"sTitle" : "绑定率（%）",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_percent"
		}, {
			"sTitle" : "配卡学生数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "xsjb_count"
		}, {
			"sTitle" : "学生配卡数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "card_count"
		}, {
			"sTitle" : "绑卡率（%）",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "card_percent"
		} ];
	} else if (repid == 1002) {
		aoColumns = [ {
			"sTitle" : "序号",
			"sWidth" : "60px",
			"sClass" : "text-center",
			"mDataProp" : "campusid"
		}, {
			"sTitle" : "学校",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "campus"
		}, {
			"sTitle" : "老师总数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tch_count"
		}, {
			"sTitle" : "教师人均打卡",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tch_per"
		}, {
			"sTitle" : "学生总数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_count"
		}, {
			"sTitle" : "学生人均打卡",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_per"
		}, {
			"sTitle" : "全员通知",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "qytz"
		}, {
			"sTitle" : "班级通知",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "bjtz"
		}, {
			"sTitle" : "教师通知",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "jstz"
		}, {
			"sTitle" : "微课堂记录数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "wktcount"
		}, {
			"sTitle" : "班级动态记录数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "bjdtcount"
		}, {
			"sTitle" : "班级相册记录数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "bjxccount"
		}, {
			"sTitle" : "个人相册记录数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "grxccount"
		} ];
	} else if (repid == 1003) {
		aoColumns = [ {
			"sTitle" : "序号",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "campusid"
		}, {
			"sTitle" : "学校",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "campus"
		}, {
			"sTitle" : "学期",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "xqmc"
		}, {
			"sTitle" : "学生总数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_count"
		}, {
			"sTitle" : "学生绑定数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_bd_count"
		}, {
			"sTitle" : "服务开通人数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_pay_count"
		}, {
			"sTitle" : "收费单价",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "charge"
		}, {
			"sTitle" : "已收总额",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "total_price"
		} ];
	} else if (repid == 1004) {
		aoColumns = [ {
			"sTitle" : "序号",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "campusid"
		}, {
			"sTitle" : "学校",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "campus"
		}, {
			"sTitle" : "学期",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "xqmc"
		}, {
			"sTitle" : "学期开始时间",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "weekbegin"
		}, {
			"sTitle" : "学期结束时间",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "weekend"
		},{
			"sTitle" : "收费金额",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "charge"
		}, {
			"sTitle" : "设置时间",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "createtime"
		} ];
	} else if (repid == 1005) {
		aoColumns = [ {
			"sTitle" : "序号",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "id"
		}, {
			"sTitle" : "代理商姓名",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "name"
		}, {
			"sTitle" : "学校数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "orgcount"
		}, {
			"sTitle" : "学生数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "xscount"
		}, {
			"sTitle" : "学生绑定数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "xsbdcount"
		},{
			"sTitle" : "学生绑定率",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "xs_percent"
		}, {
			"sTitle" : "老师数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tchcount"
		}, {
			"sTitle" : "老师绑定数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tchbdcount"
		}, {
			"sTitle" : "老师绑定率",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tch_percent"
		}];
	} else if (repid == 1005) {
		aoColumns = [ {
			"sTitle" : "序号",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "id"
		}, {
			"sTitle" : "学校名称",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "campus"
		}, {
			"sTitle" : "学生数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "xscount"
		}, {
			"sTitle" : "学生绑定数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "xsbdcount"
		},{
			"sTitle" : "学生绑定率",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "xs_percent"
		}, {
			"sTitle" : "老师数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tchcount"
		}, {
			"sTitle" : "老师绑定数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tchbdcount"
		}, {
			"sTitle" : "老师绑定率",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tch_percent"
		}];
	} else if(repid == 100501){
		aoColumns = [ {
			"sTitle" : "序号",
			"sWidth" : "60px",
			"sClass" : "text-center",
			"mDataProp" : "campusid"
		},{
			"sTitle" : "学校",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "campus"
		}, {
			"sTitle" : "学生数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_count"
		}, {
			"sTitle" : "学生绑定数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "stu_bd_count"
		}, {
			"sTitle" : "绑定率（%）",
			"sWidth" : "100px",
			"sClass" : "text-center",
			"mDataProp" : "stu_percent"
		}, {
			"sTitle" : "教师数量",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tch_count"
		}, {
			"sTitle" : "教师绑定数",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "tch_bd_count"
		}, {
			"sTitle" : "绑定率（%）",
			"sWidth" : "100px",
			"sClass" : "text-center",
			"mDataProp" : "tch_percent"
		}, ];
	}
	return aoColumns;
}

function fillDataColumn(aaData) {
	if (aaData.campusid != 0) {
		return '<div style="text-align:center"><a href="javascript:openDetail(\''
				+ aaData.campusid
				+ '\',\''
				+ aaData.campus
				+ '\');">'
				+ aaData.campus + '</a></div>';
	}
	return aaData.campus;
}

function fillTjfxDataColumn(aaData){
	if (aaData.id != 0) {
		return '<div style="text-align:center"><a href="javascript:openDlsDetail(\''
				+ aaData.id
				+ '\',\''
				+ aaData.name
				+ '\');">'
				+ aaData.name + '</a></div>';
	}
	return aaData.name;
}

function openDetail(campusid, campus) {
	$('#title').html(campus + "绑定率汇总表");
	generate_repdetail_table(campusid, 100101);
	$('#modal-querydetail').modal('show');
}

function openDlsDetail(id,name){
	$('#title').html(name + " 下属学校绑定情况统计表");
	generate_repdetail_table(id, 100501);
	$('#modal-querydetail').modal('show');
}

function generate_repdetail_table(campusid, repid) {
	GHBB.prompt("正在加载~");
	App.datatables();
	var rownum = 1;
	var sAjaxSource = getUrlByRepid(campusid, repid);
	var aoColumns = getRepColumns(repid);
	$('#rep_detail_datatable').dataTable({
		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : sAjaxSource,
		"sAjaxDataProp" : "aaData",
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			$('td:eq(0)', nRow).html(rownum);
			rownum = rownum + 1;
			return nRow;
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}

function getBeginTime(starttime) {
	return starttime + " 00:00:00";
}

function getEndTime(endtime) {
	return endtime + " 23:59:59";
}

function getStartPercent(value) {
	if (value == "") {
		return "0";
	}
	return value;
}

function getEndPercent(value) {
	if (value == "") {
		return "100";
	}
	return value;
}
