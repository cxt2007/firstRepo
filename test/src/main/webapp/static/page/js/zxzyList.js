var ctx = "";
var TablesDatatables = function() {

	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();
$(document).ready(function() {
	generate_resource_table();
	$("#resourceQueryBtn").click(function() {
		generate_resource_table();
	});
});
function generate_resource_table() {
	var rownum = 1;
	App.datatables();
	var sAjaxSource = ctx + "/klxx/catagory/QueryResource";
	var param = "search_EQ_firstId=" + $("#firstid").val();
	param = param + "&search_EQ_lastId=" + $("#lastid").val();
	sAjaxSource = sAjaxSource + "?" + param;
	var aoColumns = [ {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "coverimg"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "catagory"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "type"
	}];
	$("#resource-datatable")
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
							var picHtml = '<img src="'
									+ aaData.coverimg
									+ '" style="height:64px;width: 64px" alt="image" class="img-circle">';
							$('td:eq(1)', nRow).html(picHtml);
						/*	var editHtml = '<div style="text-align:center;"><a href="'
									+ ctx
									+ '/klxx/catagory/update/'
									+ aaData.id
									+ '">'
									+ aaData.catagory
									+ '</a></div>';*/
							var editHtml= '<div class="btn-group btn-group-xs">'
								+ '<a href="javascript:update('
								+ aaData.id + ');">'+aaData.catagory+'</a></div>';
							$('td:eq(2)', nRow).html(editHtml);
							/*delHtml = '<div class="btn-group btn-group-xs">'
									+ '<a href="javascript:delConfirm('
									+ aaData.id + ');">删除</a></div>';
							$('td:eq(4)', nRow).html(delHtml);*/
							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns
					});
}
/*function delConfirm(id) {
	if (confirm("是否删除该资源种类?")) {
		var url = ctx + '/klxx/catagory/delete/';
		var submitData = {
			id : id
		};
		$.post(url, submitData, function(data) {
			alert("删除成功");
			generate_resource_table();
		});
	} else {
		return false;
	}
}*/

function update(id){
	var url=ctx+'/klxx/catagory/update/'+id+"?"+"search_EQ_firstId=" + $("#firstid").val()+ "&search_EQ_lastId=" + $("#lastid").val();
	location.href = url;
}