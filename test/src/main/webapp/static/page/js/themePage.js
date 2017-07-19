var ctx = "";

var TablesDatatables = function() {

	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();
$(document).ready(function() {
	$("#themeForm_camupsid").change(function() {
		getFormBjsjList('');

	});
	$("#theme-bjids").change(function() {
		getFormXsjbList('', $("#theme-bjids").val());

	});
});
function getFormBjsjList(bjids) {
	var url = ctx + "/base/findBjJsonByCampusid";
	var submitData = {
		campusid : $("#themeForm_camupsid").val() + ""
	};
	$.post(url, submitData, function(data) {
		var datas = eval(data);
		$("#theme-bjids option").remove();// user为要绑定的select，先清除数据
		for ( var i = 0; i < datas.length; i++) {
			var selectState = '';
			if (bjids != null && bjids != '') {
				var arr = eval('[' + bjids + ']');
				;
				var index = $.inArray(datas[i].id, arr);
				if (index != '-1') {
					selectState = 'selected';
				}
			}
			$("#theme-bjids").append(
					"<option value=" + datas[i].id + " " + selectState + " >"
							+ datas[i].bj + "</option>");
			selectState = '';
		}
		;
		$("#theme-bjids").multiselect('refresh');
	});
}
function getFormXsjbList(stuids, bjids) {
	var url = ctx + "/base/findXsjbJsonByBjids";

	var submitData = {
		bjids : bjids.toString()
	};
	$.get(url, submitData, function(data) {
		var datas = eval(data);
		$("#theme-stuids option").remove();// user为要绑定的select，先清除数据
		for ( var i = 0; i < datas.length; i++) {
			var selectState = '';
			if (stuids != null && stuids != '') {
				var arr = eval('[' + stuids + ']');
				;
				var index = $.inArray(datas[i].id, arr);
				if (index != '-1') {
					selectState = 'selected';
				}
			}
			$("#theme-stuids").append(
					"<option value=" + datas[i].id + " " + selectState + " >"
							+ datas[i].bjid_ch + "-" + datas[i].xm
							+ "</option>");
			selectState = '';
		}
		;
		$("#theme-stuids").multiselect('refresh');
	});
}
$(function() {
	$("#theme-stuids").multiselect({
		selectedList : 20
	});
});


function checkStartTime() {
	var year = $("#starttime").val();
	var start = year.substring(0, 10).split('-');
	var endyear = $("#endtime").val();
	var end = endyear.substring(0, 10).split('-');
	var a = (Date.parse(end) - Date.parse(start)) / 3600 / 1000;
	if (a < 0) {
		$("#endtime").val(year);
	} else {
		return true;
	}
}

function checkEndTime() {
	var year = $("#starttime").val();
	var start = year.substring(0, 10).split('-');
	var endyear = $("#endtime").val();
	var end = endyear.substring(0, 10).split('-');
	var a = (Date.parse(end) - Date.parse(start)) / 3600 / 1000;
	if (a < 0) {
		alert("活动结束时间不能比活动开始时间早");
	} else {
		return true;
	}
}