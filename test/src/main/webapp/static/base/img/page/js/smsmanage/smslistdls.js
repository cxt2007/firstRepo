var ctx = $("#ctx").val();
$(document).ready(function() {
	setOriginalDate();
	App.datatables();
	generate_table_sms_statitical();
	getAllSmsResult();
	$("#search_btn").click(function() {
		generate_table_sms_statitical();
		getAllSmsResult();
	});
	$("#state").change(function() {
		generate_table_sms_statitical();
		getAllSmsResult();
	});
	$("#export_btn").click(function() {
		exportSms();
	});
	$("#export_detail_teacher").click(function() {
		exportDetailTeacher();
	});
	$("#export_detail_stu").click(function() {
		exportDetailStu();
	});
});

function exportDetailStu() {
	GHBB.prompt("数据导出中~");
	var param = {
		campusid:$("#detail_stu_campusid").val(),
		begindate:$("#begindate").val(),
		enddate:$("#enddate").val()
	};
	var submitData = {
		api : ApiParamUtil.SMS_DLS_DETAIL_STU_EXPORT,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		GHBB.hide();
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == 200) {
			location.href = ctx + json.data;
		} else {
			PromptBox.alert(json.ret.msg);
		}
		return false;
	});
}

function exportDetailTeacher() {
	GHBB.prompt("数据导出中~");
	var param = {
		campusid:$("#detail_teacher_campusid").val(),
		begindate:$("#begindate").val(),
		enddate:$("#enddate").val()
	};
	var submitData = {
		api : ApiParamUtil.SMS_DLS_DETAIL_TEACHER_EXPORT,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		GHBB.hide();
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == 200) {
			location.href = ctx + json.data;
		} else {
			PromptBox.alert(json.ret.msg);
		}
		return false;
	});
}

function getAllSmsResult(){
	GHBB.prompt("正在加载~");
	var param = {
			state:$("#state").val(),
			begindate:$("#begindate").val(),
			enddate:$("#enddate").val()
		};
		var submitData = {
			api : ApiParamUtil.SMS_DLS_ALL_QUERY,
			param : JSON.stringify(param)
		};
		$.post(commonUrl_ajax, submitData, function(data) {
			GHBB.hide();
			var json = typeof data === "object" ? data : JSON.parse(data);			
			if (json.ret.code==200) {
				$("#sms_parentcount").html(json.data.parentcount);
				$("#sms_teachercount").html(json.data.teachercount);
				$("#sms_total").html(json.data.parentcount+json.data.teachercount);
			} else {
				console.log(json.ret.code+":"+json.ret.msg);
			}
		});
}

/**
 * 导出活动投票情况
 * 
 */
function exportSms() {
	GHBB.prompt("数据导出中~");
	var param = {
		campusname:$("#campusname").val(),
		state:$("#state").val(),
		begindate:$("#begindate").val(),
		enddate:$("#enddate").val()
	};
	var submitData = {
		api : ApiParamUtil.SMS_DLS_LIST_EXPORT,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		GHBB.hide();
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
	GHBB.prompt("正在加载~");
	var rownum = 1;
	var aoColumns= [
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "campusname"},
					{ "sWidth": "70px", "sClass": "text-center","mDataProp": "xxtype"},
					{ "sWidth": "70px", "sClass": "text-center","mDataProp": "servicestate"},
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
				campusname:$("#campusname").val(),
				state:$("#state").val(),
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
			var stujumpto='<a style="cursor:pointer" onclick=viewStuSmsDetail("'+aaData.campusid+'","'+aaData.campusname+'","'+aaData.parentcount+'")>'+aaData.parentcount+'</a>';
			$('td:eq(3)', nRow).html(stujumpto);
			var teacherjumpto='<a style="cursor:pointer" onclick=viewTeacherSmsDetail("'+aaData.campusid+'","'+aaData.campusname+'","'+aaData.teachercount+'")>'+aaData.teachercount+'</a>';
			$('td:eq(4)', nRow).html(teacherjumpto);
		}, 
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});	
}

function viewStuSmsDetail(campusid,campusname,parentcount){	
	$("#detail_stu_campusname").html(campusname);
	$("#detail_stu_campusid").val(campusid);
	generate_table_datatable_stu_detail(campusid);	
	$("#detail_stu_allsms").html(parentcount);
	$("#modal-sms-stu-detail").modal("show");
}

function viewTeacherSmsDetail(campusid,campusname,teachercount){	
	$("#detail_teacher_campusname").html(campusname);
	$("#detail_teacher_campusid").val(campusid);
	$(".detail-teacher-special").each(function(){
		$(this).remove();
	})
	getSendOfMachineAndMrcp(campusid);
	generate_table_datatable_teacher_detail(campusid);
	$("#detail_teacher_allsms").html(teachercount);
	$("#modal-sms-teacher-detail").modal("show");
}

function getSendOfMachineAndMrcp(campusid){
	var param = {
			campusid:campusid,
			begindate:$("#begindate").val(),
			enddate:$("#enddate").val()
		};
		var submitData = {
			api : ApiParamUtil.SMS_DLS_DETAIL_TEACHER_SPECIAL,
			param : JSON.stringify(param)
		};
		$.post(commonUrl_ajax, submitData, function(data) {
			var json = typeof data === "object" ? data : JSON.parse(data);			
			if (json.ret.code==200) {
				if(json.data.speciallist!=undefined && json.data.speciallist!=null){
					var list=json.data.speciallist;
					for(var i=0;i<list.length;i++){
						var trHtml='<tr class="detail-teacher-special"><td class="text-center">'+list[i].name+'</td><td class="text-center">'+list[i].count+'</td></tr>';
						$("#datatable_teacher_detail thead").append(trHtml);
					}
				}
			} else {
				console.log(json.ret.code+":"+json.ret.msg);
			}
		});
}

function generate_table_datatable_stu_detail(campusid){
	var rownum = 1;
	var aoColumns= [
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "bjname"},
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "stuname"},
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "count"}
	           ];
	$('#datatable_stu_detail').dataTable({
		"iDisplayLength" : 20,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				campusid:campusid,
				begindate:$("#begindate").val(),
				enddate:$("#enddate").val()
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.SMS_STU_DETAIL_LIST_QUERY } );
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

function generate_table_datatable_teacher_detail(campusid){
	var rownum = 1;
	var aoColumns= [
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "teachername"},
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "count"}
	           ];
	$('#datatable_teacher_detail').dataTable({
		"iDisplayLength" : 20,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				campusid:campusid,
				begindate:$("#begindate").val(),
				enddate:$("#enddate").val()
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.SMS_TEACHER_DETAIL_LIST_QUERY } );
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

function getDetailAllSmsCount(campusid,usertype){
	var param = {
			campusid:campusid,
			usertype:usertype,
			begindate:$("#begindate").val(),
			enddate:$("#enddate").val()
		};
		var submitData = {
			api : ApiParamUtil.SMS_DETAIL_ALL_COUNT_QUERY,
			param : JSON.stringify(param)
		};
		$.post(commonUrl_ajax, submitData, function(data) {
			var json = typeof data === "object" ? data : JSON.parse(data);			
			if (json.ret.code==200) {
				if(usertype==1){
					$("#detail_teacher_allsms").html(json.data.count);
				}else{
					$("#detail_stu_allsms").html(json.data.count);
				}
			} else {
				console.log(json.ret.code+":"+json.ret.msg);		
			}
		});
}





//设置初始日期
function setOriginalDate(){
	$("#begindate").datepicker('setDate','null');
	$("#enddate").datepicker('setDate','null');
}
