var ctx = $("#ctx").val();

$(document).ready(
		function() {
			generate_table_xq();
			$("#xq_campusid").change(function() {// 查询
				generate_table_xq();
				changeCampusForXq();
			});

			$("#xq-search-btn").click(function() {
				generate_table_xq();
			});
			
			$("#xq-add-btn").click(function() {
				setXqResetting();
				$('#modal-xqgl').modal('show');
			});

			$("#saveSubmit").click(
					function() {
						var startNian = $("#xqForm_startNian").val();
						if (startNian == undefined || startNian == "") {
							alert("请填写学期开始年份！");
							return;
						}
						var xqbm = startNian + $("#xqForm_endNian").val() + "0"
								+ $("#xqForm_xqsx").val();
						var xqmc = startNian + $("#xqForm_endNian").val() + "学年"
								+ $("#xqForm_xqsx").find('option:selected').text();

						var weekbegin = $("#xqForm_weekbegin").val();
						if (weekbegin == undefined || weekbegin == "") {
							alert("请填写学期开始日期！");
							return;
						}
						var weeknum = $("#xqForm_weeknum").val();
						var reg = /^[1-9]\d*$|^0$/;
						if (weeknum == undefined || weeknum == ""
								|| weeknum <= 0 || !reg.test(weeknum)) {
							alert("请填写学期周数！");
							return;
						}
						var endNian = $("#xqForm_endNian").val();
						if (endNian == undefined || endNian == "") {
							alert("请填写学期结束年份！");
							return;
						}

						if (confirm("确定保存?")) {
							var url = ctx + "/xtgl/initdata/save_xqb";
							var submitData = {
								id : $("#xqForm_id").val(),
								xqbm : xqbm,
								currentxq : $("#xqForm_currentxq").val(),
								weekbegin : weekbegin,
								weeknum : weeknum,
								campusid : $("#xqForm_campusid").val(),
								xqmc : xqmc,
								xqgb : $("#xqForm_xqsx").val(),
								xnbm : startNian + $("#xqForm_endNian").val()
							};
							$.post(url, submitData, function(data) {
								if (data == "success") {
									setXqResetting();
									generate_table_xq();
									$('#modal-xqgl').modal('hide');
								} else {
									alert(data);
								}
								return false;
							});
							return false;
						} else
							return false;

					});
			$("#resetXq").click(function() {
				setXqResetting();
			});
		});
function getDefaultXueQi(){
	var now_date = new Date();
	var month = now_date.getMonth();
	var year = now_date.getFullYear();
	if(month>=6){
		$("#xqForm_startNian").val((year+"").substr(2,2));
		$("#xqForm_endNian").val((year+1+"").substr(2,2));
		$("#xqForm_xqsx").val(1);
	}else{
		$("#xqForm_startNian").val((year-1+"").substr(2,2));
		$("#xqForm_endNian").val((year+"").substr(2,2));
		$("#xqForm_xqsx").val(2);
	}
	
}
function setXqResetting() {
	$("#xqForm_id").val('');
	$("#xqForm_startNian").val('');
	$("#xqForm_endNian").val('');
	getDefaultXueQi();
//	$("#xqForm_xqsx").val(1);
	$("#xqForm_currentxq").val(1);
	$("#xqForm_weekbegin").val('');
	$("#xqForm_weeknum").val('');
	$(":text").removeAttr("readonly");
	$("#xqForm_xqsx").removeAttr("disabled");
}

function checkStartYear() {
	var year = $("#xqForm_startNian").val();
	var reg = /^[1-9]\d*$|^0$/;
	if (reg.test(year) == true) {
		if (year.length == 2) {
			var now_date = new Date();
			var now_year = now_date.getFullYear();
			var str_year = (now_year+"").substring(2,4);
			if(year==str_year || year==(Number(str_year)-1)){
				$("#xqForm_endNian").val(Number(year) + 1);
			}else{
				alert("输入年份超出范围！");
				$("#xqForm_startNian").val('');
			}
		} else {
			alert("输入年份超出范围！");
			$("#xqForm_startNian").val('');
		}

	} else {
		alert("输入年份必须为数字！");
		$("#xqForm_startNian").val('');
	}
}

function changeCampusForXq(){
	$("#xqForm_id").val('');
	$("#xqForm_startNian").val('');
	$("#xqForm_endNian").val('');
	$("#xqForm_xqsx").val(1);
	$("#xqForm_currentxq").val(1);
	$("#xqForm_weekbegin").val('');
	$("#xqForm_weeknum").val('');
	$(":text").removeAttr("readonly");
	$("#xqForm_xqsx").removeAttr("disabled");
//	$('#xqForm_campusid').find("option[value='"+$("#xq_campusid").val()+"']").attr("selected",true);
//	$('#xqForm_campusid').trigger("chosen:updated");
}

function checkEndYear() {
	var year = $("#xqForm_endNian").val();
	var reg = /^[1-9]\d*$|^0$/;
	if (reg.test(year) == true) {
		if (year.length == 2) {
			var now_date = new Date();
			var now_year = now_date.getFullYear();
			var str_year = (now_year+"").substring(2,4);
			if(year==str_year || year==(Number(str_year)+1)){
				$("#xqForm_startNian").val(Number(year) - 1);
			}else{
				alert("输入年份超出范围！");
				$("#xqForm_endNian").val('');
			}
		} else {
			alert("输入年份超出范围！");
			$("#xqForm_endNian").val('');
		}

	} else {
		alert("输入年份必须为数字！");
		$("#xqForm_endNian").val('');
	}
}

function generate_table_xq() {
	GHBB.prompt("正在加载~");
	var rownum = 1;
	var sAjaxSource = ctx + "/xtgl/initdata/ajax_query_xq";
	var param = "campusid=" + $("#xq_campusid").val();
	sAjaxSource = sAjaxSource + "?" + param;
	var aoColumns = [ {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "150px",
		"mDataProp" : "xqmc"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "weekbegin"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "weeknum"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "currentxq"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "campusid_ch"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "campusid_ch"
	} ];

	$('#xq-datatable')
			.dataTable(
					{
						"aaSorting" : [ [ 3, 'desc' ] ],
						"iDisplayLength" : 20,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"bSort" : false,
						"sAjaxSource" : sAjaxSource,
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							// 序号
							$('td:eq(0)', nRow).html(rownum);
							// 学期名
							var editHtml = '<div style="text-align:center"><a href="#" onclick="openXqEdit(\''
									+ aaData.id
									+ '\');">'
									+ aaData.xqmc
									+ '</a></div>';
							$('td:eq(1)', nRow).html(editHtml);
							// 开学日期
							if (aaData.weekbegin != null
									&& aaData.weekbegin != ''
									&& aaData.weekbegin.length > 10) {
								$('td:eq(2)', nRow).html(
										aaData.weekbegin.substring(0, 10));
							}
							// 是否当前学期
							if (aaData.currentxq == false) {
								$('td:eq(4)', nRow).html('否');
							} else {
								$('td:eq(4)', nRow).html('是');
							}
							// 删除
							var delHtml = '<div class="btn-group btn-group-xs"><a href="javascript:delXqConfirm('
									+ aaData.id + ');">删除</a></div>';
							$('td:eq(6)', nRow).html(delHtml);

							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns,
						"fnInitComplete": function(oSettings, json) {
							GHBB.hide();
					    }
					});
}

function openXqEdit(xq_id) {
	var url = ctx + "/xtgl/initdata/ajax_query_xqb_id";
	var submitData = {
		id : xq_id
	};
	$.post(url, submitData, function(data) {
		var datas = eval("(" + data + ")");
		var xqbm = datas.xqbm;
		$("#xqForm_startNian").val(xqbm.substring(0, 2));
		$("#xqForm_endNian").val(xqbm.substring(2, 4));
		$("#xqForm_xqsx").val(xqbm.substring(5, 6));
		$("#xqForm_startNian").attr("readonly","true");
		$("#xqForm_endNian").attr("readonly","true");
		$("#xqForm_xqsx").attr("disabled","true");
		if (datas.currentxq == true) {
			$("#xqForm_currentxq").val(1);
		} else {
			$("#xqForm_currentxq").val(0);
		}

		$("#xqForm_weekbegin").val(datas.weekbegin.substring(0, 10));
		$("#xqForm_weeknum").val(datas.weeknum);
		$('#xqForm_campusid').val(datas.campusid);
		$("#xqForm_id").val(datas.id);
		
		$('#modal-xqgl').modal('show');
	});
}

function delXqConfirm(id) {
	if (confirm("确认删除?")) {
		var url = ctx + "/xtgl/initdata/ajax_delXq";
		var submitData = {
			id : id
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				alert("删除成功!");
				generate_table_xq();
			} else {
				alert(data);
			}

			return false;
		});
	}
}