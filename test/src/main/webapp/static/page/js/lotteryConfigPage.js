var ctx = "";
var lotteryDatatables = function() {

	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$(document).ready(function() {
	generate_theme_table();
	$("#themeAddBtn").click(function() {
		addTheme();
	});
	$("#saveThemeSubmit").click(function() {
		saveTheme();
	});
	$("#periodAddBtn").click(function() {
		addPeriod();
	});
	$("#savePeriodSubmit").click(function() {
		savePeriod();
	});

	$("#saveAwardSubmit").click(function() {
		var awardid = $("#awardid").val();
		var periodid = $("#periodid").val();
		updateAward(awardid, periodid);
	});
});

/**
 * 主题列表
 */
function generate_theme_table() {
	App.datatables();
	var rownum = 1;

	/* Initialize Datatables */
	var sAjaxSource = ctx + "/xtgl/lotteryconfig/ajax_query_theme";
	var aoColumns = [ {
		"sTitle" : "选择",
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sTitle" : "主题",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "name"
	}, {
		"sTitle" : "管理",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "name"
	} ];
	$('#theme-datatable')
			.dataTable(
					{
						// "aoColumnDefs": [ { "bSortable": false, "aTargets": [
						// 1, 3] }
						// ],
						// "aaSorting":[ [2,'desc']],
						"iDisplayLength" : 50,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"sAjaxSource" : sAjaxSource,
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {

							var selectCheckHtml = "";
							selectCheckHtml = "<input type='radio' id='"
									+ aaData.id
									+ "' name='themeOptionsRadios' value='"
									+ aaData.id
									+ "' onclick='selectPeriodOptions("
									+ aaData.id + ")'>";
							$('td:eq(0)', nRow).html(selectCheckHtml);

							var updatehtml = '<div class="btn-group btn-group-xs"><a href="javascript:toEditTheme('
									+ aaData.id
									+ ');">'
									+ aaData.name
									+ '</a></div>';
							$('td:eq(1)', nRow).html(updatehtml);

							var delhtml = '<div class="btn-group btn-group-xs"><a href="javascript:delLotteryConfigConfirm('
									+ aaData.id
									+ ','
									+ aaData.parentid
									+ ');">删除</a></div>';
							$('td:eq(2)', nRow).html(delhtml);

							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns
					});
}

/**
 * 期次列表
 */
function generate_period_table(id) {
	App.datatables();
	var rownum = 1;
	/* Initialize Datatables */
	var sAjaxSource = ctx + "/xtgl/lotteryconfig/ajax_query_period?id=" + id;
	var aoColumns = [ {
		"sTitle" : "选择",
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sTitle" : "期次",
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sTitle" : "名称",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "name"
	}, {
		"sTitle" : "开始时间",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "starttime"
	}, {
		"sTitle" : "结束时间",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "endtime"
	}, {
		"sTitle" : "是否启用",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "enabled"
	}, {
		"sTitle" : "管理",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "name"
	} ];
	$('#period-datatable')
			.dataTable(
					{
						// "aoColumnDefs": [ { "bSortable": false, "aTargets": [
						// 1, 3] }
						// ],
						// "aaSorting":[ [2,'desc']],
						"iDisplayLength" : 6,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"sAjaxSource" : sAjaxSource,
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {

							var selectCheckHtml = "";
							selectCheckHtml = "<input type='radio' id='"
									+ aaData.id
									+ "' name='periodOptionsRadios' value='"
									+ aaData.id
									+ "' onclick='selectAwardOptions("
									+ aaData.id + ")'>";
							$('td:eq(0)', nRow).html(selectCheckHtml);

							$('td:eq(1)', nRow).html('第'+rownum+'期');

							var updatehtml = '<div class="btn-group btn-group-xs"><a href="javascript:toEditPeriod('
									+ aaData.id
									+ ');">'
									+ aaData.name
									+ '</a></div>';
							$('td:eq(2)', nRow).html(updatehtml);

							$('td:eq(3)', nRow).html(aaData.starttime.substring(0,10));
							$('td:eq(4)', nRow).html(aaData.endtime.substring(0,10));

							if (aaData.enabled == 0) {
								$('td:eq(5)', nRow).html('<div>未启用</div>');
							} else {
								$('td:eq(5)', nRow).html('<div>启用</div>');
							}

							var delhtml = '<div class="btn-group btn-group-xs"><a href="javascript:delLotteryConfigConfirm('
									+ aaData.id
									+ ','
									+ aaData.parentid
									+ ');">删除</a></div>';
							$('td:eq(6)', nRow).html(delhtml);

							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns
					});
}

/**
 * 奖品列表
 */
function generate_award_table(id) {
	App.datatables();
	var rownum = 1;
	/* Initialize Datatables */
	var sAjaxSource = ctx + "/xtgl/lotteryconfig/ajax_query_award?id=" + id;
	var aoColumns = [ {
		"sTitle" : "奖项",
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "rank"
	}, {
		"sTitle" : "奖品",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "name"
	}, {
		"sTitle" : "奖品数量",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "total"
	}, {
		"sTitle" : "奖品价值(元)",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "value"
	}, {
		"sTitle" : "中奖概率",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "probability"
	}, {
		"sTitle" : "卡券",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "cardid"
	}, {
		"sTitle" : "管理",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	} ];
	$('#award-datatable')
			.dataTable(
					{
						// "aoColumnDefs": [ { "bSortable": false, "aTargets": [
						// 1, 3] }
						// ],
						// "aaSorting":[ [2,'desc']],
						"iDisplayLength" : 50,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"sAjaxSource" : sAjaxSource,
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {

							$('td:eq(0)', nRow).html(aaData.rank + '等奖');
							$('td:eq(1)', nRow).html(aaData.name);
							$('td:eq(2)', nRow).html(aaData.total);
							$('td:eq(3)', nRow).html(aaData.value);
							$('td:eq(4)', nRow).html(aaData.probability);
							$('td:eq(5)', nRow).html(aaData.cardid);
							var delhtml = '<div class="btn-group btn-group-xs"><a href="javascript:updateAwardConfigConfirm('
									+ aaData.id
									+ ','
									+ aaData.parentid
									+ ');">修改</a></div>';
							$('td:eq(6)', nRow).html(delhtml);
							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns
					});
}

function selectPeriodOptions(id) {
	generate_period_table(id);
}

function selectAwardOptions(id) {
	$("#periodid").val(id);
	generate_award_table(id);
}

/**
 * 新增主题
 */
function addTheme() {
	$('#addOrEditTheme').html("新增");
	// 新增时清空表单
	$("#themename").val("");
	$('#theme-id').val("");

	// 显示新增表单
	$('#theme-addconfig').modal('show');

	$.get(url, {}, function(data) {
		generate_theme_table();
	});
}

/**
 * 保存主题
 */
function saveTheme() {
	if ($("#themename").val() == null || $("#themename").val() == '') {
		alert("请填写主题名称");
		return;
	}

	if (confirm("是否确定继续操作?")) {
		var url = ctx + "/xtgl/lotteryconfig/ajax_query_addTheme";
		var submitData = {
			parentid : 0,
			id : $("#theme-id").val(),
			name : $("#themename").val(),
			lotterytype : $("#themetype-chosen").val()
		};
		$('#saveThemeSubmit').attr('disabled', 'disabled');
		$.post(url, submitData, function(data) {
			$('#saveThemeSubmit').removeAttr('disabled');
			$('#theme-addconfig').modal('hide');
			alert("主题保存成功");
			generate_theme_table();
			return false;
		});
	}
	;
}

/**
 * 修改主题页面
 */
function toEditTheme(id) {
	$('#addOrEditTheme').html("修改");
	var url = ctx + "/xtgl/lotteryconfig/ajax_edit_theme";
	var submitData = {
		id : id
	};
	$.post(url, submitData, function(data) {
		var datas = eval("(" + data + ")");
		$('#theme-id').val(datas.id);
		$('#themename').val(datas.name);
		$('#themetype-chosen').find("option[value='" + datas.themetype + "']")
				.attr("selected", true);
		$('#themetype-chosen').trigger("chosen:updated");
		$('#theme-addconfig').modal('show');
		return false;
	});
}

/**
 * 修改期次页面
 * 
 * @param id
 */
function toEditPeriod(id) {
	$('#addOrEditPeriod').html("修改");
	var url = ctx + "/xtgl/lotteryconfig/ajax_edit_period";
	var submitData = {
		id : id
	};
	$.post(url, submitData, function(data) {
		var datas = eval("(" + data + ")");

		// 期次中 修改期次页面的是否启用
		if (datas.enabled == undefined || datas.enabled == null
				|| datas.enabled == "") {
			editPeriodEnabled();
		} else {
			$("#enabled option").eq(0).attr("disabled", false);
			$("#enabled option").eq(0).attr("selected", "selected");
			$("#enabled").trigger("chosen:updated");
		}

		$('#period-id').val(datas.id);
		$('#period-parentid').val(datas.parentid);
		$('#periodname').val(datas.name);
		$('#starttime').val(datas.starttime.substring(0,10));
		$('#endtime').val(datas.endtime.substring(0,10));
		$('#remark').val(datas.remark);
		$('#period-addconfig').modal('show');
		return false;
	});
}

/**
 * 修改期次时判断 启用的期次 的数量
 */
function editPeriodEnabled() {
	var url = ctx + "/xtgl/lotteryconfig/ajax_query_periodEnabled";
	$.post(url, function(data) {
		if (data == 0) {
			$("#enabled option").eq(0).attr("disabled", false);
			$("#enabled option").eq(1).attr("selected", true);
			$("#enabled").trigger("chosen:updated");
		} else {
			$("#enabled option").eq(0).attr("disabled", true);
			$("#enabled option").eq(1).attr("selected", true);
			$("#enabled").trigger("chosen:updated");
		}
	});
}
/**
 * 新增期次
 */
function addPeriod() {
	id = $('input:radio[name="themeOptionsRadios"]:checked').val();
	if (id == null || id == "") {
		alert("请选择主题");
		return;
	}
	$('#addOrEditPeriod').html("新增");
	var url = ctx + "/xtgl/lotteryconfig/ajax_query_periodEnabled";// 新增时查询是否已经有启用的期次存在
	var submitData = {
		parentid : id
	};
	$.post(url, submitData, function(data) {

		if (data == 0) {
			// 还原下拉菜单中的值为第一个
			$("#enabled option").eq(0).attr("selected", true);
			$("#enabled").trigger("chosen:updated");
		} else {
			$("#enabled option").eq(0).attr("disabled", true);

			// 还原下拉菜单中的值为第一个
			$("#enabled option").eq(1).attr("selected", true);
			$("#enabled").trigger("chosen:updated");
		}

		// 新增时清空表单
		$("#periodname").val("");
		$("#starttime").val("");
		$("#endtime").val("");
		$("#description").val("");
		$('#period-id').val("");
		$('#period-parentid').val("");

		// 显示新增表单
		$('#period-addconfig').modal('show');
	});
}

/**
 * 保存期次
 */
function savePeriod() {
	if ($("#period-parentid").val() == null
			|| $("#period-parentid").val() == "") {
		$("#period-parentid").val(id);
	}

	if ($("#periodname").val() == null || $("#periodname").val() == '') {
		alert("请填写期次名称");
		return;
	}
	if ($("#starttime").val() == null || $("#starttime").val() == '') {
		alert("请填写开始时间");
		return;
	}
	if ($("#endtime").val() == null || $("#endtime").val() == '') {
		alert("请填写结束时间");
		return;
	}
	if ($("#starttime").val() > $("#endtime").val()) {
		alert("开始日期不能小于结束日期");
		return;
	}
	if (confirm("是否确定继续操作?")) {
		var url = ctx + "/xtgl/lotteryconfig/ajax_query_addPeriod";
		var submitData = {
			id : $("#period-id").val(),
			parentid : $("#period-parentid").val(),
			name : $("#periodname").val(),
			starttime : $("#starttime").val(),
			endtime : $("#endtime").val(),
			description : $("#description").val(),
			enabled : $("#enabled").val()
		};
		$('#savePeriodSubmit').attr('disabled', 'disabled');
		$.post(url, submitData, function(data) {
			$('#savePeriodSubmit').removeAttr('disabled');
			$('#period-addconfig').modal('hide');
			alert("期次保存成功");
			generate_period_table($("#period-parentid").val());
			if (data != "success" && data != null) {
				var periodid = data;
				for ( var i = 0; i < 6; i++) {
					addAward(i + 1, periodid);
				}
			}
			return false;
		});
	}
	;
}

/**
 * 新增奖品
 */
function addAward(rank, id) {
	var url = ctx + "/xtgl/lotteryconfig/ajax_query_addAward";
	var submitData = {
		parentid : id,
		name : null,
		rank : rank,
		total : 0,
		value : 0,
		probability : 0,
		cardid : null,
		remark : null
	};
	$.post(url, submitData, function(data) {
		generate_award_table(id);
		return false;
	});
}

/**
 * 修改奖品页面
 */
function updateAwardConfigConfirm(id, parentid) {

	$('#awardid').val(id);
	var url = ctx + "/xtgl/lotteryconfig/ajax_edit_award";
	var submitData = {
		id : id
	};
	$.post(url, submitData, function(data) {
		var datas = eval("(" + data + ")");
		$('#info-id').val(datas.id);
		$('#awardname').val(datas.name);
		$('#rank').val(datas.rank);
		$('#total').val(datas.total);
		$('#value').val(datas.value);
		$('#probability').val(datas.probability);
		$('#cardid').val(datas.cardid);
		$('#remark').val(datas.remark);
		$('#award-addconfig').modal('show');
		return false;
	});

}

/**
 * 修改奖品
 */
function updateAward(id, parentid) {
	if ($("#awardname").val() == null || $("#awardname").val() == '') {
		alert("请填写奖品名称");
		return;
	}
	if ($("#rank").val() == null || $("#rank").val() == '') {
		alert("请填写奖项");
		return;
	}
	if ($("#total").val() == null || $("#total").val() == '') {
		alert("请填写奖品数量");
		return;
	}
	if (isNaN($("#total").val())) {
		alert("奖品数量只能输入数字");
		return;
	}
	if ($("#value").val() == null || $("#value").val() == '') {
		alert("请填写奖品价值");
		return;
	}
	if (isNaN($("#value").val())) {
		alert("奖品价值只能输入数字");
		return;
	}
	if ($("#probability").val() == null || $("#probability").val() == '') {
		alert("请填写中奖概率");
		return;
	}
	if ($("#probability").val() < 0 || $("#probability").val() > 1
			|| isNaN($("#probability").val())) {
		alert("中奖概率必须是大于等于0或是小于等于1的数");
		return;
	}
	if ($("#cardid").val() == null || $("#cardid").val() == '') {
		alert("请填写卡券");
		return;
	}
	if (confirm("是否确定继续操作?")) {
		var url = ctx + "/xtgl/lotteryconfig/ajax_query_updateAward";
		var submitData = {
			id : id,
			parentid : parentid,
			name : $("#awardname").val(),
			rank : $("#rank").val(),
			total : $("#total").val(),
			value : $("#value").val(),
			probability : $("#probability").val(),
			cardid : $("#cardid").val(),
			remark : $("#remark").val()
		};
		$('#saveAwardSubmit').attr('disabled', 'disabled');
		$.post(url, submitData, function(data) {
			$('#saveAwardSubmit').removeAttr('disabled');
			$('#award-addconfig').modal('hide');
			alert("奖品保存成功");
			generate_award_table(parentid);
			return false;
		});
	}
	;
}
/**
 * 删除
 * 
 * @param id
 * @param parentid
 */
function delLotteryConfigConfirm(id, parentid) {
	if (confirm("确认删除?")) {
		var url = ctx + "/xtgl/lotteryconfig/ajax_query_delLotteryConfig";
		var submitData = {
			id : id,
			parentid : parentid
		};
		$.post(url, submitData, function(data) {
			if (data == "error") {
				alert("该主题下有期次,请先删除期次再删除该主题");
				return;
			}
			alert("删除成功!");
			if (parentid == 0) {
				generate_theme_table();
			} else {
				generate_period_table(parentid);
			}
			return false;
		});
	}
}