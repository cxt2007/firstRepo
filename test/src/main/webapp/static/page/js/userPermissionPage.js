
var ctx = $("#ctx").val();
var slaveuser = $("#slaveuser").val();
var xxType = $("#xxType").val();
var dataType = 0;
var ifpreview = 0;
var isedit = 0;
var editor;

$(document).ready(function() {
	queryCampusList();

	$("#campus-chosen").change(function() {
		generate_table();
	});
	
	$("#search-btn").click(function() {
		generate_table();
	});
	
	$("#exportBtn").click(function() {
		expectPermissionUserList();
	});
	
});

function queryCampusList() {
	var param = {};
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_CAMPUS,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if (result.ret.code == 200) {
			for ( var i = 0; i < result.data.campusList.length; i++) {
				$("#campus-chosen")
						.append(
								"<option value=" + result.data.campusList[i].id
										+ ">" + result.data.campusList[i].value
										+ "</option>");
			}
			$("#campus-chosen option").eq(0).attr("selected", true);
			$("#campus-chosen").trigger("chosen:updated");
			generate_table();
		}
	});
}

function generate_table() {
	App.datatables();
	GHBB.prompt("正在加载~");
	var aoColumns = [ {
		"sTitle" : "姓名",
		"mDataProp" : "name",
		"sClass" : "text-center",
		"sWidth": "150px"
	}, {
		"sTitle" : "角色",
		"mDataProp" : "role_ch",
		"sClass" : "text-center",
		"sWidth": "150px"
	}, {
		"sTitle" : "职位",
		"mDataProp" : "position",
		"sClass" : "text-center",
		"sWidth": "150px"
	}, {
		"sTitle" : "报修审批",
		"mDataProp" : "userid",
		"sClass" : "text-center",
		"sWidth": "150px"
	}, {
		"sTitle" : "出差审批",
		"mDataProp" : "userid",
		"sClass" : "text-center",
		"sWidth": "150px"
	}, {
		"sTitle" : "故障维修",
		"mDataProp" : "userid",
		"sClass" : "text-center",
		"sWidth": "150px"
	}  ];
	$('#menu-datatable').dataTable({
		"iDisplayLength": 15,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort" : false,
		"sAjaxSource" : commonUrl_ajax,
		"sAjaxDataProp" : 'dataList',
		"bServerSide" : true,// 服务器端必须设置为true
		"fnServerParams" : function(aoData) {
			var param = {
				campusid : $("#campus-chosen").val(),
				teacher_name : $("#teacher_name").val(),
				"iDisplayStart" : 0,
				"sEcho" : 1
			};
			aoData.push({
				"name" : "api",
				"value" : ApiParamUtil.OA_QUERY_PERMISSION_USER_LIST
			});
			aoData.push({
				"name" : "param",
				"value" : JSON.stringify(param)
			});
		},
		"fnServerData" : function(sSource, aoData, fnCallback) {
			$.ajax({
				"dataType" : 'json',
				"type" : "POST",
				"url" : sSource,
				"data" : aoData,
				"success" : function(json) {
					if (json.ret.code === "200") {
						fnCallback(json.data);
					} else {
						console.log(json.ret.code + ":" + json.ret.msg);
					}
				}
			});
		},
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			if(aaData.permissionList != null && aaData.permissionList.length >0){
				var tripstate = 0;
				var repairstate = 0;
				for(var i=0;i<aaData.permissionList.length;i++){
					var permission = aaData.permissionList[i];
					
					if(permission.id != null ){
						var checkClass = "";
						if(permission.value == 1){
							checkClass = "checked";
						}
						var checkBox = '<div style="width:100%;height:100%;cursor:pointer;" onclick="setPermission(\''+permission.id+'\','+aaData.userid+')"><input name="permission_'+permission.id+'_'+aaData.userid+'" id="permission_'+permission.id+'_'+aaData.userid+'" type="checkbox" '+checkClass+' value="1" onclick="return false" /><div>';
						
						if(permission.type == OaProcessType.PROCESS_TYPE_BUSINESS_TRIP){
				        	$('td:eq(4)', nRow).html(checkBox);
				        	tripstate = 1;
						}else if(permission.type == OaProcessType.PROCESS_TYPE_REPAIR){
							repairstate = 1;
				        	$('td:eq(3)', nRow).html(checkBox);
						}else if(permission.type == OaProcessType.PROCESS_TYPE_PERMISSION){
				        	$('td:eq(5)', nRow).html(checkBox);
						}
					}
					
					if(tripstate == 0){
						$('td:eq(4)', nRow).html("");
					}
					
					if(repairstate == 0){
						$('td:eq(3)', nRow).html("");
					}
				}
			}
			
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}

function setPermission(processtypeid,userid){
	var obj = "#permission_"+processtypeid+'_'+userid;
	
	var submitData = {
			api:ApiParamUtil.OA_SET_USER_PERMISSION,
			param:JSON.stringify({
				campusid : $("#campus-chosen").val(),
				processtypeid : processtypeid,
				publisherid:userid
			})
		};
		$.ajax({
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas){
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code==="200"){
					if(result.data=="SAVE"){
						$(obj)[0].checked=true;
					}else if(result.data=="CANCEL"){
						$(obj)[0].checked=false;
					}
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
}


function expectPermissionUserList(){
	GHBB.prompt("数据导出中~");
		var param = {
			campusid : $("#campus-chosen").val(),
			teacher_name : $("#teacher_name").val()
		};
		var submitData = {
			api : ApiParamUtil.OA_EXPORT_USER_PERMISSION_LIST,
			param : JSON.stringify(param)
		};
		$.post(commonUrl_ajax, submitData, function(data) {
			var json = typeof data === "object" ? data : JSON.parse(data);
			if (json.ret.code == 200) {
				location.href = ctx + json.data;
			} else {
				PromptBox.alert(json.ret.msg);
			}
			GHBB.hide();
			return false;
		});
}

