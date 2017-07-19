var ctx = $("#ctx").val();

$(document).ready(function() {
	generate_table_nj();
	
	$("#njgl-search-campusid").change(function() {
		generate_table_nj();
		changeCampus();
	});
	
	$("#njgl-search-btn").click(function(){
		generate_table_nj();
	});
	
	$("#njgl-add-btn").click(function() {
		setResetting();
		$('#modal-njgl').modal('show');
	});
	
	// 保存事件
	$("#saveNj").click(function() {
		var njmc = $("#njglForm_njmc").val();
		if (njmc == undefined || njmc == "") {
			alert("请填写年级名称！");
			return;
		}
		
		var orderid = $("#njglForm_orderid").val();
		if (orderid == undefined || orderid == "") {
			alert("年级序号只能为数字！");
			return;
		}

		if (confirm("确定保存?")) {
			var url = ctx + "/xtgl/initdata/save_nj";
			var submitData = {
				id : $("#njglForm_id").val(),
				njmc : $("#njglForm_njmc").val(),
				campusid : $("#njglForm_campusid").val(),
				orderid : $("#njglForm_orderid").val()
			};
			$.post(url, submitData, function(data) {
				if (data == "success") {
					setResetting();
					generate_table_nj();
					$('#modal-njgl').modal('hide');
				} else {
					alert(data);
				}
				return false;
			});
			return false;
		} else
			return false;

	});
	$("#resetNj").click(function() {
		setResetting();
	});
});

function setResetting() {
	$("#njglForm_id").val('');
	$("#njglForm_njmc").val('');
	$("#njglForm_orderid").val('');
	$("#njglForm_ifbiye").val(0);

}

function changeCampus(){
	$("#njglForm_id").val('');
	$("#njglForm_njmc").val('');
	$("#njglForm_orderid").val('');
	$("#njglForm_ifbiye").val(0);
//	$('#njglForm_campusid').find("option[value='"+$("#nj_campusid").val()+"']").attr("selected",true);
//	$('#campusid_nj').trigger("chosen:updated");
}

function generate_table_nj() {
	GHBB.prompt("正在加载~");
	var rownum = 1;
	var sAjaxSource = ctx + "/xtgl/initdata/ajax_query_nj";
	var param = "campusid=" + $("#njgl-search-campusid").val();
	sAjaxSource = sAjaxSource + "?" + param;
	var aoColumns = [ {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "150px",
		"mDataProp" : "campusid_ch"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "njmc"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "orderid"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "ifbiye"
	} ];

	$('#nj-datatable')
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
						"sAjaxSource" : sAjaxSource,
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							// 序号
							$('td:eq(0)', nRow).html(rownum);
							// 年级名称
							var editHtml = '<div style="text-align:center"><a href="#" onclick="openEdit(\''
									+ aaData.id
									+ '\');">'
									+ aaData.njmc
									+ '</a></div>';
							$('td:eq(2)', nRow).html(editHtml);
							// 删除
							var delHtml = '<div class="btn-group btn-group-xs"><a href="javascript:delNjConfirm('
									+ aaData.id + ');">删除</a></div>';
							$('td:eq(4)', nRow).html(delHtml);

							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns,
						"fnInitComplete": function(oSettings, json) {
							GHBB.hide();
					    }
					});
}

function openEdit(nj_id) {
	var url = ctx + "/xtgl/initdata/ajax_query_nj_id";
	var submitData = {
		id : nj_id
	};
	$.post(url, submitData, function(data) {
		var datas = eval("(" + data + ")");

		if (datas.ifbiye == "1") {
			$("#njglForm_ifbiye").val(1);
		} else {
			$("#njglForm_ifbiye").val(0);
		}

		$("#njglForm_id").val(datas.id);
		$("#njglForm_njmc").val(datas.njmc);
		$("#njglForm_orderid").val(datas.orderid);
		$('#njglForm_campusid').find("option[value='"+datas.campusid+"']").attr("selected",true);
		$('#njglForm_campusid').trigger("chosen:updated");
		$('#modal-njgl').modal('show');
	});
	
}

function delNjConfirm(id) {
	if (confirm("确认删除?")) {
		var url = ctx + "/xtgl/initdata/ajax_delNj";
		var submitData = {
			id : id
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				alert("删除成功!");
				generate_table_nj();
				return false;
			} else {
				alert(data);
			}

		});
	}
}