var ctx = "";
var appid = $("#appid").val();
var TablesDatatables = function() {

	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();
$(document).ready(function() {
	getCity('#city');
	$("#province").change(function(){
		getCity('#city');
	});
	$("#countyTownList").change(function() {
		generate_dls_table();
	});
	$("#city").change(function() {
		getCountyTownList('#countyTownList');
	});
	$("#dls-isstart").change(function() {
		generate_dls_table();
	});
	// 查询
	$("#dlsQueryBtn").click(function() {
		generate_dls_table();
	});
});

function getCountyTownList(node){
	var msg = "没有选项！";
	var url = commonUrl_ajax;
	var submitData = {
			api: ApiParamUtil.COMMON_QUERY_COUNTY_TOWN,
			param: JSON.stringify({
				provinceId: $("#province").val(),
				cityId: $("#city").val()
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			$("#countyTownList option").remove();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createCityList(result.data.countyTownList,msg,node);
				generate_dls_table();
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}
function getCity(node){
	var msg = "没有选项！";
	var url = commonUrl_ajax;
	var submitData = {
			api: ApiParamUtil.COMMON_QUERY_CITY,
			param: JSON.stringify({
				provinceid: $("#province").val(),
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			$("#city option").remove();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				 createCityList(result.data.cityList,msg,node);
				 getCountyTownList('#countyTownList');
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}
function createCityList(dataData,msg,node){
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].id+'">'+dataData[i].value+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.alert(msg);
	}else{
		$(node).find("option[index='0']").attr("selected", 'selected');
	}
	$(node).trigger("chosen:updated");
}
function getSearchFormCity() {
	var url = ctx + "/xtgl/dls/findBydictcode";
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
		generate_dls_table();
	});
}
function generate_dls_table() {
	var rownum = 1;
	App.datatables();
	var sAjaxSource = ctx + "/xtgl/dls/findDlsInfo";
	var aoColumns = [ {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "name"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "loginname"
	}, {
		"sWidth" : "120px",
		"sClass" : "text-center",
		"mDataProp" : "dlstype"
	}, {
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "businessmodel"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "cphone"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "amount"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "paid"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "isstart"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "isstart"
	} ];
	GHBB.prompt("正在加载~");
	
	$('#dls-datatable').dataTable(
			{
				"iDisplayLength" : 50,
				"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
				"bFilter" : false,
				"bLengthChange" : false,
				"bDestroy" : true,
				"bAutoWidth" : false,
				"bSort" : false,
				"sAjaxSource" : sAjaxSource,
				"bServerSide" : true,// 服务器端必须设置为true
				"sServerMethod" : "POST",
				"fnServerParams": function (aoData) {
					var param = {
					EQ_city : $("#city").val(),
					LIKE_name : $("#dls-name").val(),
					LIKE_isstart : $("#dls-isstart").val(),
					countyTown : $("#countyTownList").val(),
					province : $("#province").val()
					};
					aoData.push( { "name": "param", "value": JSON.stringify(param) } );
					},
				"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
					// 序号
					$('td:eq(0)', nRow).html(rownum);
					// 姓名
					var editHtml = '<div style="text-align:center;"><a href="'
							+ ctx + '/xtgl/dls/update/' + aaData.id + '?appid='+appid+'">'
							+ aaData.name + '</a></div>';
					$('td:eq(1)', nRow).html(editHtml);
					var dlstype = "";
					if (aaData.dlstype == 1) {
						dlstype = "独家";
					} else if (aaData.dlstype == 2) {
						dlstype = "非独家(3.5万)";
					} else if (aaData.dlstype == 3) {
						dlstype = "非独家(2.5万)";
					}
					var dlsHtml = '<div style="text-align:center;">' + dlstype
							+ '</div>';
					$('td:eq(3)', nRow).html(dlsHtml);
					var businessmodel = "";
					if (aaData.businessmodel == 1) {
						businessmodel = "学期服务模式";
					} else if(aaData.businessmodel == 2){
						businessmodel = "key模式";
					} else if(aaData.businessmodel == 3){
						businessmodel = "学期key模式";
					}
					var businessmodelHtml = '<div style="text-align:center;">' + businessmodel
					+ '</div>';
					$('td:eq(4)', nRow).html(businessmodelHtml);
			
					var isstart = "";
					if (aaData.isstart == 1) {
						isstart = "已生效";
					} else {
						isstart = "未生效";
					}
					var xbHtml = '<div style="text-align:center;">' + isstart
							+ '</div>';
					$('td:eq(8)', nRow).html(xbHtml);
					
					// 删除
					// var delhtml = '<div class="btn-group btn-group-xs" >'
					// + '<a href="'
					// + ctx
					// + '/xtgl/dls/delete/'
					// + aaData.id
					// + '" onclick="return delConfirm();">删除</a>&nbsp;&nbsp;'
					// + '</div>';
					delHtml = '<div class="btn-group btn-group-xs">'
							+ '<a href="javascript:delConfirm(' + aaData.id
							+ ');">删除</a></div>';
					$('td:eq(9)', nRow).html(delHtml);
					rownum = rownum + 1;
					return nRow;
				},
				"aoColumns" : aoColumns,
				"fnInitComplete": function(oSettings, json) {
					GHBB.hide();
			    }
			});
}
function delConfirm(id) {
	if (confirm("是否删除该代理商?")) {
		GHBB.prompt("数据保存中~");
		var url = ctx + '/xtgl/dls/delete/';
		var submitData = {
			id : id
		};
		$.post(url, submitData, function(data) {
			GHBB.hide();
			alert("删除成功");
			generate_dls_table();
		});
	} else {
		return false;
	}
}