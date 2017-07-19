var ctx = "";
var TablesDatatables = function() {
	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();
$(document).ready(function() {
	generate_theme_table();
	$("#theme-camups-chosen").change(function() {
		getSearchBj();
	});
	$("#theme-bjid-chosen").change(function() {
		generate_theme_table();
	});
	$("#themeQueryBtn").click(function() {
		generate_theme_table();
	});
});
function generate_theme_table() {
	var rownum = 1;
	App.datatables();
	var sAjaxSource = ctx + "/xtgl/theme/findTheme";
	param = "&campusid=" + $("#theme-camups-chosen").val();
	param = param + "&title=" + $("#theme-title").val();
	param = param + "&bjids=" + $("#theme-bjid-chosen").val();
	sAjaxSource = sAjaxSource + "?" + param;// 调用后台携带参数路径
	var aoColumns = [ {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "picpath"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "title"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "bjid_ch"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "starttime"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "endtime"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "endtime"
	} ];
	$('#theme-datatable')
			.dataTable(
					{
						"iDisplayLength" : 50,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"bSort" : false,
						"sAjaxSource" : sAjaxSource,
						"bServerSide" : false,// 服务器端必须设置为true
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							// 序号
							$('td:eq(0)', nRow).html(rownum);
							var picpath = "";
							if (aaData.picpath != null && aaData.picpath != '') {
								picpath = aaData.picpath;
							} else {
								picpath = ctx
										+ "/static/pixelcave/backend/img/jquery.chosen/campus.png";
							}
							var picHtml = '<img src="'
									+ picpath
									+ '" style="height:64px;width: 64px" alt="avatar" class="img-circle">';
							$('td:eq(1)', nRow).html(picHtml);

							var editHtml = '<div style="text-align:center;"><a href="'
									+ ctx
									+ '/xtgl/theme/update/'
									+ aaData.id
									+ '">' + aaData.title + '</a></div>';
							$('td:eq(2)', nRow).html(editHtml);

							delHtml = '<div class="btn-group btn-group-xs">'
									+ '<a href="'
									+ ctx
									+ '/xtgl/theme/editComment/'
									+ aaData.id
									+ '?appid='+$("#appid").val()+'">填写评语</a>&nbsp;&nbsp;'
									 +'<a href="javascript:delConfirm('
									+ aaData.id + ');">删除</a></div>';
							$('td:eq(6)', nRow).html(delHtml);
							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns
					});
}
function delConfirm(id) {
	if (confirm("是否删除该主题活动?")) {
		var url = ctx + '/xtgl/theme/deleteTheme';
		var submitData = {
			id : id
		};
		$.post(url, submitData, function(data) {
			alert("删除成功");
			generate_theme_table();
		});
	} else {
		return false;
	}
}
function getSearchBj() {
	var url = ctx + "/yqdt/yqdt/ajax_change_bj";
	var submitData = {
		campusid : $("#theme-camups-chosen").val()
	};
	$.post(url, submitData, function(data) {
		var datas = eval(data);
		$("#theme-bjid-chosen option").remove();// user为要绑定的select，先清除数据
		for (var i = 0; i < datas.length; i++) {
			$("#theme-bjid-chosen").append(
					"<option value=" + datas[i][0] + ">" + datas[i][1]
							+ "</option>");
		}
		;
		$("#theme-bjid-chosen option").eq(0).attr("selected", true);
		$("#theme-bjid-chosen").trigger("chosen:updated");
		generate_theme_table();
		return false;
	});
}