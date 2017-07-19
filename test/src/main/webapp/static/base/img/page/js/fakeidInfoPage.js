var ctx = "";
var TablesDatatables = function() {

	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$(document).ready(function() {
	generate_fakeidinfo_table();

	$("#state").change(function() {
		generate_fakeidinfo_table();
	});

	$("#province").change(function() {
		getSearchFormCity();
	});

	$("#city").change(function() {
		generate_fakeidinfo_table();
	});

	$("#fakeidInfoQueryBtn").click(function() {
		generate_fakeidinfo_table();
	});
});

function generate_fakeidinfo_table() {
	var rownum = 1;
	App.datatables();

	var sAjaxSource = ctx
			+ "/xtgl/fakeidinfo/ajax_query_fakeidinfo?&search_EQ_orgcode="
			+ $("#orgcode").val() + "&search_EQ_state=" + $("#state").val()
			+ "&search_LIKE_province=" + $("#province").val()
			+ "&search_LIKE_city=" + $("#city").val() + "&search_LIKE_nickname="
			+ $("#nickname").val();
	var aoColumns = [ {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "headimgurl"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "nickname"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "province"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "city"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "subscribetime"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "state"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "orgname"
	} ];

	$('#fakeidinfo-datatable')
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
							$('td:eq(0)', nRow).html(rownum);

							// if(aaData.headimgurl!=null &&
							// aaData.headimgurl!=''){
							// picpath = aaData.headimgurl;
							// }else{
							// if(aaData.sex == 1){
							// picpath =
							// "http://jeff-ye-1978.qiniudn.com/boyteacher.jpg";
							// }else{
							// picpath =
							// "http://jeff-ye-1978.qiniudn.com/girlteacher.jpg";
							// }
							// }
							var picHtml = '<img src="'
									+ aaData.headimgurl
									+ '" style="height:64px;width: 64px" alt="avatar" class="img-circle">';
							$('td:eq(1)', nRow).html(picHtml);

							if (aaData.state == 1) {
								$('td:eq(6)', nRow).html("已绑定");
							} else {
								$('td:eq(6)', nRow).html("未绑定");
							}

							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns
					});
}

function getSearchFormCity() {
	var url = ctx + "/xtgl/fakeidinfo/findBydictcode";
	var submitData = {
		dictcode : $("#province").val()
	};
	$.post(url, submitData, function(data) {
		var datas = eval(data);
		$("#city option").remove();// user为要绑定的select，先清除数据
		for ( var i = 0; i < datas.length; i++) {
			$("#city").append(
					"<option value=" + datas[i][0] + " >" + datas[i][1]
							+ "</option>");
		}
		;
		$("#city").find("option[index='0']").attr("selected", 'selected');
		$("#city").trigger("chosen:updated");
		generate_fakeidinfo_table();
	});
}