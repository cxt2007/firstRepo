
var ctx = $('#ctx').val();
$(document).ready(function() {
	App.datatables();
	$("#search_btn").click(function() {
		queryAdList();
	});
	$("#search_dlsid").change(function() {
		queryAdList();
	});
	$("#search_state").change(function() {
		queryAdList();
	});
	$("#setState").click(function() {
		examine();
	});
	getDlsList();
	getAdTypeList();
	queryAdList();
});

function getDlsList(){
	var submitData = {
		api: ApiParamUtil.COMMON_QUERY_AGENT,
		param: JSON.stringify({})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		async:false,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createDlsList(result.data.agentlist);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createDlsList(dataData){
	var allValue = new Array();
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].id+'">'+dataData[i].value+'</option>');
		allValue.push(dataData[i].id);
	}
	$("#search_dlsid").html('<option value="'+allValue.toString()+'">全部代理商</option>' + dataList.join(''));
	if(dataData!='' && dataData != null && dataData.length>0){
		$("#search_dlsid").val(allValue.toString());
	}
	$("#search_dlsid").trigger("chosen:updated");
}

function getAdTypeList(){
	var submitData = {
		api: ApiParamUtil.COMMON_QUERY_DICT,
		param: JSON.stringify({
			type:DICTTYPE.DICT_TYPE_DLS_AD_STATE
		})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		async:false,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createAdTypeList(result.data.dictList);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createAdTypeList(dataData){
	var allValue = new Array();
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].key+'">'+dataData[i].value+'</option>');
		allValue.push(dataData[i].key);
	}
	$("#search_state").html('<option value="'+allValue.toString()+'">全部状态</option>' + dataList.join(''));
	if(dataData!='' && dataData != null && dataData.length>0){
		$("#search_state").val(allValue.toString());
	}
	$("#search_state").trigger("chosen:updated");
}

function queryAdList() {
	GHBB.prompt("正在加载~");
	var aoColumns = [
	{
		"sTitle" : "活动名称",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "title"
	}, {
		"sTitle" : "代理商名称",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "dlsname"
	},  {
		"sTitle" : "提交时间",
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "publishdate"
	}, {
		"sTitle" : "审核状态",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "state"
	}, {
		"sTitle" : "操作",
		"sWidth" : "50px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sTitle" : "备注",
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "remark"
	}];
	$('#ad-datatable').dataTable({
		"aaSorting":[ [3,'desc']],
		"iDisplayLength" : 50,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort":false,
		"sAjaxSource" : commonUrl_ajax,
		//"sAjaxDataProp":'dataLsit',
		"bServerSide" : true,// false为前端分页
		"fnServerParams": function (aoData) {
			var param = {
				dlsid: $('#search_dlsid').val(),
				state:  $('#search_state').val(),
				title: $('#search_title').val(),
				iDisplayStart: 0,
		        iDisplayLength: 10,
		        sEcho: 1
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.MAIN_DLS_AD_LIST_QUERY } );
			aoData.push( { "name": "iDisplayStart", "value": 0 } );
			aoData.push( { "name": "iDisplayLength", "value": 10 } );
			aoData.push( { "name": "sEcho", "value": 1 } );
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
		//"aaSorting" : [[ 0, "asc" ], [ 5, "desc" ], [ 8, "desc" ]],
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			$('td:eq(0)',nRow).html('<a href="javascript:toForm('+aaData.id+');">'+aaData.title+'</a>');
			var stateText = "";
			if(aaData.state == "0"){
				stateText = "审核驳回";
			}else if(aaData.state == "1"){
				stateText = "审核通过";
			}else if(aaData.state == "2"){
				stateText = "待审核";
			}else{
				stateText = "未知状态";
			}
			$('td:eq(3)',nRow).html(stateText);
			var btnStr = "";
			if(aaData.state == "2"){
				btnStr = '<a class="l color_green" href="javascript:ifShowRemarkEdit('+aaData.id+',1);">审核通过</a><a class="r color_red" href="javascript:ifShowRemarkEdit('+aaData.id+',0);">审核驳回</a>';
			}else{
				btnStr = '<a class="l disableBtn" href="javascript:void(0);">审核通过</a><a class="r disableBtn" href="javascript:void(0);">审核驳回</a>';
			}
			$('td:eq(4)',nRow).html(btnStr);
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}

function toForm(id){
	window.location.href = ctx + "/base/func/61002?appid=1110&adId="+id;
}

function ifShowRemarkEdit(id,state){
	$("#currentId").val(id);
	$("#currentState").val(state);
	$("#remark").val("");
	if(state == "0"){
		$('#modal-edit-remark').modal('show');
		return;
	}
	examine();
}

function examine(){
	GHBB.prompt("数据保存中~");
	var id = $("#currentId").val();
	var state = $("#currentState").val();
	var remark = $("#remark").val();
	var submitData = {
		api: ApiParamUtil.MAIN_DLS_AD_STATE_UPDATE,
		param: JSON.stringify({
			id:id,
			state:state,
			remark:remark
		})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		async:false,
		data: submitData,
		success: function(datas){
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				queryAdList();
				$('#modal-edit-remark').modal('hide');
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}