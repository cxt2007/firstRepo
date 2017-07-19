var ctx = $("#ctx").val();
$(document).ready(function() {
	setOriginalDate();
	App.datatables();
	getSearchDlsList();	
	getAllSmsResult();
	$("#search_btn").click(function() {
		generate_table_sms_statitical();
		getAllSmsResult();
	});
	$("#dls_select").change(function() {
		generate_table_sms_statitical();
	});
	$("#export_btn").click(function() {
		exportSms();
	});
	$("#export_detail").click(function() {
		exportDetail();
	});
});

function getAllSmsResult(){
	var param = {
			begindate:$("#begindate").val(),
			enddate:$("#enddate").val()
		};
		var submitData = {
			api : ApiParamUtil.SMS_MAIN_ALL_QUERY,
			param : JSON.stringify(param)
		};
		$.post(commonUrl_ajax, submitData, function(data) {
			var json = typeof data === "object" ? data : JSON.parse(data);			
			if (json.ret.code==200) {
				$("#schoolcount").html(json.data.schoolcount);
				$("#sms_parentcount").html(json.data.parentcount);
				$("#sms_teachercount").html(json.data.teachercount);
				$("#sms_total").html(json.data.parentcount+json.data.teachercount);
			} else {
				console.log(json.ret.code+":"+json.ret.msg);
				PromptBox.alert(json.ret.msg);				
			}
		});
}

/**
 * 获取代理商查询条件
 * 
 */
function getSearchDlsList() {
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
				createSearchDlsList(result.data.agentlist);
				generate_table_sms_statitical();
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createSearchDlsList(dataData) {
	var allValue = new Array();
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].id+'">'+dataData[i].value+'</option>');
		allValue.push(dataData[i].id);
	}
	$("#dls_select").html('<option value="'+allValue.toString()+'">全部代理商</option>' + dataList.join(''));
	if(dataData!='' && dataData != null && dataData.length>0){
		$("#dls_select").val(allValue.toString());
	}
	$("#dls_select").trigger("chosen:updated");
}

function exportSms() {
	var param = {
		dlsname:$("#dlsname").val(),
		dlsids:$("#dls_select").val(),
		begindate:$("#begindate").val(),
		enddate:$("#enddate").val()
	};
	var submitData = {
		api : ApiParamUtil.SMS_MAIN_LIST_EXPORT,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == 200) {
			location.href = ctx + json.data;
		} else {
			PromptBox.alert(json.ret.msg);
		}
		return false;
	});
}

function exportDetail() {
	var param = {
		dlsid:$("#detail_dlsid").val(),
		begindate:$("#begindate").val(),
		enddate:$("#enddate").val()
	};
	var submitData = {
		api : ApiParamUtil.SMS_MAIN_DETAIL_EXPORT,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == 200) {
			location.href = ctx + json.data;
		} else {
			PromptBox.alert(json.ret.msg);
		}
		return false;
	});
}

function generate_table_sms_statitical(){
	var rownum = 1;
	var aoColumns= [
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "dlsname"},
					{ "sWidth": "70px", "sClass": "text-center","mDataProp": "schoolcount"},
					{ "sWidth": "100px", "sClass": "text-center","mDataProp": "parentcount"},
					{ "sWidth": "100px", "sClass": "text-center","mDataProp": "teachercount"},
					{ "sWidth": "100px", "sClass": "text-center","mDataProp": "total"}
	           ];
	$('#datatable_smslist').dataTable({
		"iDisplayLength" : 20,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				dlsname:$("#dlsname").val(),
				dlsids:$("#dls_select").val(),
				begindate:$("#begindate").val(),
				enddate:$("#enddate").val()
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.SMS_MAIN_LIST_QUERY } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
			aoData.push( { "name": "iDisplayStart", "value": 0 } );
			aoData.push( { "name": "iDisplayLength", "value": 20 } );
			aoData.push( { "name": "sEcho", "value": 0 } );
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
		"bSort" : false,
		"bServerSide" : true,// false为前端分页
		"aaSorting" : [[ 1, "asc" ]],
		"fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
			var jumpto='<a style="cursor:pointer" onclick=viewSmsDetail("'+aaData.dlsid+'","'+aaData.dlsname+'","'+aaData.parentcount+'","'+aaData.teachercount+'")>'+aaData.schoolcount+'</a>';
			$('td:eq(1)', nRow).html(jumpto);
		}, 
		"aoColumns" : aoColumns
	});	
}

function viewSmsDetail(dlsid,dlsname,parentcount,teachercount){
	$("#detail_dlsid").val(dlsid);
	$("#detail_dlsname").html(dlsname);
	$("#detail_parentcount").html(parentcount);
	$("#detail_teachercount").html(teachercount);
	$("#detail_total").html(parseInt(parentcount)+parseInt(teachercount));
	generate_table_detail();
	$("#modal-sms-detail").modal("show");
}

function generate_table_detail(){
	var rownum = 1;
	var aoColumns= [
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "campusname"},
					{ "sWidth": "100px", "sClass": "text-center","mDataProp": "parentcount"},
					{ "sWidth": "100px", "sClass": "text-center","mDataProp": "teachercount"},
					{ "sWidth": "100px", "sClass": "text-center","mDataProp": "total"}
	           ];
	$('#datatable_detail').dataTable({
		"iDisplayLength" : 20,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				dlsid:$("#detail_dlsid").val(),
				begindate:$("#begindate").val(),
				enddate:$("#enddate").val()
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.SMS_DLS_LIST_QUERY } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
			aoData.push( { "name": "iDisplayStart", "value": 0 } );
			aoData.push( { "name": "iDisplayLength", "value": 20 } );
			aoData.push( { "name": "sEcho", "value": 0 } );
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
		"bSort" : false,
		"bServerSide" : true,// false为前端分页
		"aaSorting" : [[ 1, "asc" ]],
		"fnRowCallback": function( nRow, aaData, iDisplayIndex ) {			
		}, 
		"aoColumns" : aoColumns
	});	
}

//设置初始日期
function setOriginalDate(){
	$("#begindate").datepicker('setDate','null');
	$("#enddate").datepicker('setDate','null');
}
