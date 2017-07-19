/*
 *  Document   : tzList.js
 *  Author     : hbz
 *  Description: 卡片和考勤机管理页面
 */
var checkedId;
var ctx = $("#commonUrl_cxt").val();
var SYS_MANAGE_CARD_EXPEXCEL = $("#SYS_MANAGE_CARD_EXPEXCEL").val();
var machineTypeList=[];
var cardList = function() {
	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$(document).ready(function() {
	//查询是否设置一卡通信息
	findSmartCardKeyListCount();

	//查询考勤设备型号
	findMechineTypeList();
	
	$("#stuCardQueryBtn").click(function() {
		checkedId = "";
		generate_stuCard_table();
		generate_card_table('-1', 2);
	});

	$("#expCardExcel").click(function() {
		expCardExcel();
	});
	$("#expCardTeacherExcel").click(function() {
		expCardTeacherExcel();
	});	

	$("#teacherCardQueryBtn").click(function() {
		generate_teacherCard_table();
		generate_card_table('-1', 1);
	});

	$("#backupCardQueryBtn").click(function() {
		generate_backupCard_table();
	});

	$("#macStatusQueryBtn").click(function() {
		generate_macStatus_table();
	});

	$("#cardImportMacQueryBtn").click(function() {
		generate_cardImportMac_table();
	});
	
	
	/**
	 * 重置校区卡片状态
	 */
	$("#resetCampusCardBtn").click(function() {
		resetCampusCardState();
	});

	$("#addStuCard").click(function() {
		addCard(2);
	});

	$("#teacherStuCard").click(function() {
		addCard(1);
	});

	$("#search_EQ_campusid1").change(function() {
		generate_teacherCard_table();
	});

	$("#search_EQ_campusid2").change(function() {
		getFormBjsjList();// 过滤条件存在班级时生效
		generate_card_table('-1', 2);
		findSmartCardKeyListCount();
	});

	$("#search_EQ_bjid2").change(function() {
		generate_stuCard_table();
		generate_card_table('-1', 2);

	});

	$("#addMacidBtn").click(function() {
		addMachine();

	});

	// 业务表单校区选择触犯班级列表变化
	$("#expectXsjb_EQ_campusid").change(function() {

		getExpectStuCardTemplateFormBjsjList();

	});
	
	//业务表单校区选择触犯班级列表变化
	$("#search_EQ_campusid4").change(function() {
		generate_macStatus_table();
		getTeacherAdminList();
	});
	
	$("#adminSubmit").click(function() {
		changeKqjAdmin();
	});
	
	$("#camera-input-form").keyup(function() {
		queryCameraList();
	});
	queryCameraList();

	$("#searchCameraBtn").click(function() {
		queryCameraList();
	});
	
	$("#exportCameraDeveloperKeyBtn").click(function() {
		exportCameraDeveloperKey();
	});
	
	$("#addCameraBtn").click(function() {
		addCamera();
	});
	
	$("#setCameraInfoBtn").click(function() {
		setCameraInfo();
	});
	
});


/**
 * 导出摄像头developerKey
 */
function exportCameraDeveloperKey(){
	GHBB.prompt("数据导出中~");
	var submitData = {
		//	api:ApiParamUtil.SYS_MANAGE_TRIGGER_CAMERA_EXPORT_KEY,
			api:"50420",
			param:JSON.stringify({
				campusid:$("#search_EQ_campusid5").val()
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
					location.href=main_ctx+result.data.fileurl;
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
}

function getTeacherAdminList(){
	GHBB.prompt("正在加载~");
	var url=ctx+"/xtgl/card/ajax_query_teacherAdmin";
	
	var submitData = {
			search_EQ_campusid: $("#search_EQ_campusid4").val()
	}; 
	$.get(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#search_EQ_teacherAdmin option").remove();//user为要绑定的select，先清除数据   
			$("#kqjAdmin-chosen option").remove();
			for ( var i = 0; i < datas.length; i++) {
				$("#search_EQ_teacherAdmin").append(
						"<option value=" + datas[i].id + ">" + datas[i].name
								+ "</option>");
				$("#kqjAdmin-chosen").append(
						"<option value=" + datas[i].id + ">" + datas[i].name
								+ "</option>");
			};
			$("#search_EQ_teacherAdmin").trigger("chosen:updated");
			$("#kqjAdmin-chosen").trigger("chosen:updated");
			GHBB.hide();
    });
}

function getExpectStuCardTemplateFormBjsjList() {
	var url = ctx + "/base/findBjJsonByCampusid";
	var submitData = {
		campusid : $("#expectXsjb_EQ_campusid").val()
	};
	$.post(url, submitData, function(data) {
		var datas = eval(data);
		$("#expectXsjbTemplate_bjids option").remove();// user为要绑定的select，先清除数据
		for ( var i = 0; i < datas.length; i++) {
			var selectState = '';

			$("#expectXsjbTemplate_bjids").append(
					"<option value=" + datas[i].id + " selected >"
							+ datas[i].bj + "</option>");
		}
		;
		$("#expectXsjbTemplate_bjids").multiselect('refresh');
	});
}

/**
 * 通过校区级联班级数据
 * 
 * @param teacherid
 */
function getFormBjsjList() {
	var url = ctx + "/base/findBjJsonByCampusid";
	var submitData = {
		campusid : $("#search_EQ_campusid2").val()
	};
	$.post(url, submitData, function(data) {
		var datas = eval(data);
		$("#search_EQ_bjid2 option").remove();// user为要绑定的select，先清除数据
		for ( var i = 0; i < datas.length; i++) {

			$("#search_EQ_bjid2").append(
					"<option value=" + datas[i].id + ">" + datas[i].bj
							+ "</option>");
		}
		;
		$("#search_EQ_bjid2").trigger("chosen:updated");
		generate_stuCard_table();
	});
}

function getQueryAjaxUrl(type) {
	if (type == 1) {
		// 老师
		return ctx + "/xtgl/card/ajax_query_ls?search_EQ_campusid="
				+ $("#search_EQ_campusid1").val() + "&search_LIKE_khxmbh="
				+ $("#search_LIKE_khxmbh1").val();

	} else if (type == 2) {
		// 学生
		return ctx + "/xtgl/card/ajax_query_xsjb?search_EQ_bjid="
				+ $("#search_EQ_bjid2").val() + "&search_LIKE_khxmbh="
				+ $("#search_LIKE_khxmbh2").val() + "&search_EQ_campusid="
				+ $("#search_EQ_campusid2").val();
	} else if (type == 3) {
		return ctx + "/xtgl/card/ajax_query_backup?search_EQ_campusid="
				+ $("#search_EQ_campusid3").val() + "&search_LIKE_khxmbh="
				+ $("#search_LIKE_khxmbh3").val();
	} else if (type == 4) {
		return ctx + "/xtgl/card/ajax_query_machine?search_EQ_campusid="
				+ $("#search_EQ_campusid4").val();

	} else if (type == 5) {
		return ctx + "/xtgl/card/ajax_query_cardstate?search_EQ_campusid="
				+ $("#search_EQ_campusid5").val() + "&search_LIKE_khxmbh="
				+ $("#search_LIKE_khxmbh5").val() + "&search_IN_state="
				+ $("#search_IN_state5").val();
	}
}

/**
 * 学生卡片列表
 */
function generate_stuCard_table() {
	GHBB.prompt("正在加载~");
	var rownum = 1;
	/* Initialize Datatables */
	var sAjaxSource = getQueryAjaxUrl(2);

	var aoColumns = [ {
		"sTitle" : "选择",
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "0"
	}, {
		"sTitle" : "姓名",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "1"
	}, {
		"sTitle" : "卡数量",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "3"
	} ];

	$('#stuCard-datatable').dataTable(
			{
				// "aoColumnDefs": [ { "bSortable": false, "aTargets": [ 1, 3] }
				// ],
				// "aaSorting":[ [2,'desc']],
				"iDisplayLength" : 50,
				"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
				"bFilter" : false,
				"bLengthChange" : false,
				"bDestroy" : true,
				"bAutoWidth" : false,
				"sAjaxSource" : sAjaxSource,
				"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
					// Append the grade to the default row class name
					// //alert(aaData.bjid);
					var selectCheckHtml = "";
					if (checkedId == aaData[0]) {
						selectCheckHtml = "<input type='radio' id='"
								+ aaData[0]
								+ "' name='stuOptionsRadios' value='"
								+ aaData[0]
								+ "' checked='checked' onclick='selectOptions("
								+ aaData[0] + ",2)'>";
					} else {
						selectCheckHtml = "<input type='radio' id='"
								+ aaData[0]
								+ "' name='stuOptionsRadios' value='"
								+ aaData[0] + "' onclick='selectXsOptions(this,"
								+ aaData[0] + ",2,selectOptions)'>";
					}
					$('td:eq(0)', nRow).html(selectCheckHtml);
					$('td:eq(3)', nRow).html(
							"<span style='color:#3498db'>" + aaData[3]
									+ "</span>");
					rownum = rownum + 1;
					$('td:eq(0)', nRow).attr("onclick","selectXsOptions(this,"+aaData[0]+",2,selectOptions)");
					$('td:eq(1)', nRow).attr("onclick","selectXsOptions(this,"+aaData[0]+",2,selectOptions)");
					$('td:eq(2)', nRow).attr("onclick","selectXsOptions(this,"+aaData[0]+",2,selectOptions)");
					return nRow;
				},
				"aoColumns" : aoColumns,
				"fnInitComplete": function(oSettings, json) {
					GHBB.hide();
			    }
			});
}

function selectXsOptions(node,stuid,type,callback) {
	$('#stuCard-datatable').find('tr').removeClass('boxselected');
	$(node).parents('tr').addClass('boxselected');
	callback(stuid, type);
}

/**
 * 老师卡片列表
 */
function generate_teacherCard_table() {
	var rownum = 1;
	GHBB.prompt("正在加载~");
	/* Initialize Datatables */
	var sAjaxSource = getQueryAjaxUrl(1);
	var aoColumns = [ {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "0"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "1"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "3"
	} ];

	$('#teacherCard-datatable').dataTable(
			{
				// "aoColumnDefs": [ { "bSortable": false, "aTargets": [ 1, 3] }
				// ],
//				"aaSorting" : [ [ 2, 'desc' ] ],
				"iDisplayLength" : 50,
				"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
				"bFilter" : false,
				"bLengthChange" : false,
				"bDestroy" : true,
				"bSort" : false,
				"bAutoWidth" : false,
				"sAjaxSource" : sAjaxSource,
				"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
					// Append the grade to the default row class name
					// //alert(aaData.bjid);
					var selectCheckHtml = "";
					if (checkedId == aaData[0]) {
						selectCheckHtml = "<input type='radio' id='"
								+ aaData[0]
								+ "' name='teacherOptionsRadios' value='"
								+ aaData[0]
								+ "' checked='checked' onclick='selectOptions("
								+ aaData[0] + ",1)'>";
					} else {
						selectCheckHtml = "<input type='radio' id='"
								+ aaData[0]
								+ "' name='teacherOptionsRadios' value='"
								+ aaData[0] + "' onclick='selectOptions("
								+ aaData[0] + ",1)'>";
					}
					$('td:eq(0)', nRow).html(selectCheckHtml);
					$('td:eq(3)', nRow).html(
							"<span style='color:#3498db'>" + aaData[3]
									+ "</span>");
					rownum = rownum + 1;
					return nRow;
				},
				"aoColumns" : aoColumns,
				"fnInitComplete": function(oSettings, json) {
					GHBB.hide();
			    }
			});
}
/**
 * 备卡列表
 */
function generate_backupCard_table() {
	var rownum = 1;
	/* Initialize Datatables */
	var sAjaxSource = getQueryAjaxUrl(3);
	var aoColumns = [ {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "kh"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "orgcode"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "campusid"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "state"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "state"
	} ];
	$('#backupCard-datatable').dataTable(
			{
				// "aoColumnDefs": [ { "bSortable": false, "aTargets": [ 1, 3] }
				// ],
				"aaSorting" : [ [ 2, 'desc' ] ],
				"iDisplayLength" : 50,
				"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
				"bFilter" : false,
				"bLengthChange" : false,
				"bDestroy" : true,
				"bAutoWidth" : false,
				"sAjaxSource" : sAjaxSource,
				"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
					// Append the grade to the default row class name
					// //alert(aaData.bjid);
					$('td:eq(0)', nRow).html(rownum);
					$('td:eq(4)', nRow).html(getState_ch(aaData.state));
					// 新增删除
					delHtml = '<div class="btn-group btn-group-xs">'
							+ '<a href="javascript:delConfirm(' + aaData.id
							+ ');">删除</a></div>';
					$('td:eq(5)', nRow).html(delHtml);
					rownum = rownum + 1;
					return nRow;
				},
				"aoColumns" : aoColumns
			});
}

function delConfirm(id) {
	if (confirm("是否删除")) {
		var url = ctx + '/xtgl/card/delete/';
		var submitData = {
			id : id
		};
		$.post(url, submitData, function(data) {
			alert("删除成功");
			generate_backupCard_table();
		});
	} else {
		return false;
	}
}

/**
 * 考勤机连接状态列表
 */
function generate_macStatus_table() {
	var rownum = 1;
	/* Initialize Datatables */
	var sAjaxSource = getQueryAjaxUrl(4);
	GHBB.prompt("正在加载~");
	var submitData = {};
	$.get(sAjaxSource, submitData, function(data) {
		//var datas = eval(data);
		assembleMacModuleDate(eval('('+data+')').aaData);
		GHBB.hide();
	});

}

function assembleMacModuleDate(macJsonData){
	var li = "";
	var content='<div class="row" style="margin-top:5px;">';
	var title="";
	if (macJsonData.length > 0) {
		for (var i = 0; i < macJsonData.length; i++) {
			if(i!=0 && i%3==0){
				content+='</div>';
				content+='<div class="row" style="margin-top:5px;">';
			}
			content +='<div class="col-md-4">'
			+ '<div class="cm-box">'
			+ '    <div>'
//			+ '    	<div class="col-md-5">'
//			+ '   		<img src="'+ctx+'/static/pixelcave/page/img/machine.png" style="width:100%;">'
//			+ '   		<div class="col-md-6" style="padding-left:0px;">'
//			+ '   			<button type="button" class="btn btn-sm btn-info" onclick="showKqjAdminModel('+ macJsonData[i].id +',\''+ macJsonData[i].kqjadmin + '\',\''+macJsonData[i].macname+ '\')">编辑</button>'
//			+ '    		</div>'
//			+ '    		<div class="col-md-6">'
//			+ '    			<button type="button" class="btn btn-sm btn-info" onclick="delMachine(\''+ macJsonData[i].id+'\',\''+macJsonData[i].macid+ '\');" name="delMachineBtn">删除</button>'
//			+ '    		</div>'
//			+ '   	</div>'
			
			+ '    		<div class="col-md-12 cm-img">'
			+ '   			<img src="'+ctx+'/static/styles/card/images/CM'+macJsonData[i].protocolversion+'.jpg">'
			+ '   		</div>'
			+ '  		<div class="col-md-12">'
			+ '  			<div class="text-left title-info">'+macJsonData[i].macname+'</div>'
			+ '  			<div class="text-left title-info">型号：'+getMacProtocolVersion_ch(macJsonData[i].protocolversion)+'</div>'
			+ '  			<div class="text-left title-info" style="height:auto;">编号：<span style="color:red;white-space:normal;word-break:break-all;height:40px;">'+macJsonData[i].macid+'</span></div>'
			+ '  			<div class="text-left title-info">管理员：'+macJsonData[i].kqjadminxm+'</div>'
			+ '  			<div class="text-left title-info">添加日期：'+macJsonData[i].publishdate+'</div>'
			+ '  			<div class="text-left title-info">卡片状态：'+ getSynchronousState(macJsonData[i].cardimportdata,macJsonData[i].macid,macJsonData[i].linkstate)				
			+ '  			</div>'
			+ '  			<div class="text-left title-info">连接状态：'+getLinkState_ch(macJsonData[i].linkstate)+'</div>'
//			+ '  			<div class="text-left title-info">教室环境：<span style="color: red;" onclick="showClassroomCondition(\''+macJsonData[i].macid+'\')">点击查看<span></div>'	
			+ '  		</div>'
			
			+ '    		<div>'
			+ '   			<a href="javascript:showKqjAdminModel('+ macJsonData[i].id +',\''+ macJsonData[i].kqjadmin + '\',\''+macJsonData[i].macname+ '\')"><div class="cm-btn btn-l"></div></a>'
			+ '   			<a href="javascript:delMachine(\''+ macJsonData[i].id+'\',\''+macJsonData[i].macid+ '\');"><div class="cm-btn btn-r"></div></a>'
			+ '   		</div>'
			
			
			
			+ '    </div>'
			+ '</div>'
			+ '</div>';
			
		}
		content+='</div>';
	} else {
		content = '<div class="noData">未查询到数据...</div>';
	}
	
	$("#macStatus-datatable").html(content);
}

/**
 * 通过考勤机类型代码转换中文名称
 * @param protocolversion
 * @returns {String}
 */
function getMacProtocolVersion_ch(protocolversion){
	
//	if (protocolversion == 10) {
//		return "竖版MX-650";
//	} else if (protocolversion == 11) {
//		return "横版W-10";
//	}else if (protocolversion == 12) {
//		return "横版MU260";
//	}else if (protocolversion == 13) {
//		return "竖版X-650";
//	}else if (protocolversion == 14) {
//		return "FCZNS-07";
//	}else if (protocolversion == 15) {
//		return "电子校徽";
//	}else if (protocolversion == 16) {
//		return "M880-P";
//	}else if (protocolversion == 17) {
//		return "GH215F";
//	}else if (protocolversion == 18) {
//		return "CZ2015";
//	}
	for(var i=0;i<machineTypeList.length;i++){
		if(machineTypeList[i].key==protocolversion){
			return machineTypeList[i].value;
		}
	}
	
}

function getLinkState_ch(linkstate){
	if (linkstate == -3) {//
	
		var linkStateHtml = '<span style="color: red;">未启用</span>';

	} else if (linkstate == -2) {//
		var linkStateHtml = '<a href="javascript:void(0)" onclick="showConnStateDetail(\''
				+ aaData.id
				+ '\');"  class="label label-warning">掉线已恢复</a>';

	} else if (linkstate == -1) {//
		var linkStateHtml = '<span style="color: red;">已掉线</span>';

	} else if (linkstate == 0) {//
		var linkStateHtml = '已联机';
	}
	return linkStateHtml;
}

function getSynchronousState(importCardData,macid,linkstate){
	if (importCardData>0) {//
		if(linkstate==0){
			var linkStateHtml = '<span style="color: red;" onclick="showImportDataDetailModal(\''+macid+'\');">'+importCardData+'条同步中..</span>';

		}else{
			var linkStateHtml = '<span style="color: red;" onclick="showImportDataDetailModal(\''+macid+'\');">'+importCardData+'条需同步,考勤机离线无法同步</span>';
		}

	} else if (importCardData==null || importCardData==0) {//
		var linkStateHtml = '<span>已同步</span>';
		linkStateHtml += '<button type="button" class="btn btn-sm btn-info" style="padding-top:0px;padding-bottom:0px;margin-left:10px;" onclick="resetCampusCardState(\''+macid+'\','+linkstate+');" name="syncDataBtn">重新导入</button>';
	} else if (importCardData == -1) {//
		var linkStateHtml = '<button type="button" class="btn btn-sm btn-info" style="padding-top:0px;padding-bottom:0px;" onclick="resetCampusCardState(\''+macid+'\','+linkstate+');" name="syncDataBtn">同步数据</button>';
	} 
	return linkStateHtml;
}

function generate_table(machineid) {
	App.datatables();
	/* Initialize Datatables */
	var sAjaxSource = ctx + "/xtgl/card/ajax_query_conndetail?macid="
			+ machineid;
	$('#detail-datatable')
			.dataTable(
					{
						"iDisplayLength" : 50,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"sAjaxSource" : sAjaxSource,
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							// Append the grade to the default row class name

							if (aaData[1] == "true") {//
								var linkStateHtml = '<a href="javascript:void(0)" onclick="showConnStateDetail(\''
										+ aaData.id
										+ '\');" class="label label-success">联机</a>';

							} else {//
								var linkStateHtml = '<a href="javascript:void(0)" onclick="showConnStateDetail(\''
										+ aaData.id
										+ '\');"  class="label label-danger">掉线</a>';

							}

							$('td:eq(3)', nRow).html(linkStateHtml);
						},
						"aoColumns" : [ {
							"sTitle" : "时段",
							"mDataProp" : "0",
							"sClass" : "text-center"
						}, {
							"sTitle" : "开始时间",
							"mDataProp" : "2",
							"sClass" : "text-center"
						}, {
							"sTitle" : "结束时间",
							"mDataProp" : "3",
							"sClass" : "text-center"
						}, {
							"sTitle" : "连接状态",
							"mDataProp" : "1",
							"sClass" : "text-center"
						} ]
					});

}

function showConnStateDetail(machineid)
{
	generate_table(machineid);
	$('#modal-connstatedetail').modal('show');

}

function showClassroomCondition(macid){
	generate_classroomCondition_datatable(macid);
	$('#modal-classroomCondition').modal('show');

}

function showKqjAdminModel(kqjid,kqjadminid,macname){
	$("#kqjid").val(kqjid);
	$("#macname-input").val(macname);
	
	if(kqjadminid == -1){
		$('#kqjAdmin-chosen').find("option:selected").removeAttr("selected");
		$('#kqjAdmin-chosen').trigger("chosen:updated");
	}else{
		$('#kqjAdmin-chosen').find("option[value='" + kqjadminid + "']").attr("selected", true);
		$('#kqjAdmin-chosen').trigger("chosen:updated");
	}
	$('#modal-kqjadmin').modal('show');
}

function changeKqjAdmin(){
	GHBB.prompt("数据保存中~");
	var url = ctx + "/xtgl/card/changeKqjAdmin";
	if($("#kqjAdmin-chosen").val() == "" || $("#kqjAdmin-chosen").val() == null){
		alert("请选择考勤机管理员");
		return;
	}
	var submitData = {
		id 			: $("#kqjid").val(),
		kqjadmin 	: $("#kqjAdmin-chosen").val(),
		kqjadminxm 	: $("#kqjAdmin-chosen").find("option:selected").text(),
		macname:$("#macname-input").val()
	};
	$.post(url, submitData, function(data) {
		GHBB.hide();
		if(data == "success"){
			$('#modal-kqjadmin').modal('hide');
			generate_macStatus_table();
		}else{
			alert(data);
		}
	});
}

/**
 * 远程导入考勤机列表
 */
function generate_cardImportMac_table() {
	var rownum = 1;
	/* Initialize Datatables */
	var sAjaxSource = getQueryAjaxUrl(5);
	var aoColumns = [ {
		"sTitle" : "序号",
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "0"
	}, {
		"sTitle" : "班级",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "0"
	}, {
		"sTitle" : "姓名",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "1"
	}, {
		"sTitle" : "卡号",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "2"
	}, {
		"sTitle" : "状态",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "4"
	} ];

	$('#cardImportMac-datatable').dataTable({
		// "aoColumnDefs": [ { "bSortable": false, "aTargets": [ 1, 3] } ],
		"aaSorting" : [ [ 2, 'desc' ] ],
		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : sAjaxSource,
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			// Append the grade to the default row class name
			// //alert(aaData.bjid);
			$('td:eq(0)', nRow).html(rownum);

			$('td:eq(4)', nRow).html(getState_ch(aaData[4]));

			rownum = rownum + 1;
			return nRow;
		},
		"aoColumns" : aoColumns
	});
}

function getQueryXsjbCardAjaxUrl(id, type) {

	if (type == 2) {
		// 老师
		return ctx + "/xtgl/card/ajax_query_xsjbcard?search_EQ_type=" + type
				+ "&search_EQ_stuid=" + id;
	} else if (type == 1) {
		// 学生
		return ctx + "/xtgl/card/ajax_query_xsjbcard?search_EQ_type=" + type
				+ "&search_EQ_teacherid=" + id;
	}
}

function selectOptions(id, type) {
	document.getElementById(id).checked=true;
	generate_card_table(id, type);

}

function generate_card_table(id, type) {
	GHBB.prompt("正在加载~");
	var rownum = 1;
	/* Initialize Datatables */
	var sAjaxSource = getQueryXsjbCardAjaxUrl(id, type);

	var aoColumns = [ {
		"sTitle" : "序号",
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sTitle" : "卡号",
		"sWidth" : "120px",
		"sClass" : "text-center",
		"mDataProp" : "kh"
	}, 
//	{
//		"sTitle" : "卡片状态",
//		"sWidth" : "100px",
//		"sClass" : "text-center",
//		"mDataProp" : "state"
//	}, 
	{
		"sTitle" : "管理",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}];
	var databelVal = "";
	if (type == 1) {
		databelVal = "teacherCardDetail-datatable";
	} else if (type == 2) {
		databelVal = "stuCardDetail-datatable";
	}
	$('#' + databelVal)
			.dataTable(
					{
						// "aoColumnDefs": [ { "bSortable": false, "aTargets": [
						// 1, 3] } ],
						"aaSorting" : [ [ 3, 'desc' ] ],
						"iDisplayLength" : 50,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"sAjaxSource" : sAjaxSource,
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							// Append the grade to the default row class name
							// //alert(aaData.bjid);
							$('td:eq(0)', nRow).html(rownum);

							var cardDelBtnHtml = '<a href="#"  onclick="delCard(\''
									+ aaData.id
									+ '\','
									+ id
									+ ',\''
									+ aaData.kh
									+ '\','
									+ type
									+ ');" data-toggle="tooltip" title="删除卡片">删除卡片</a>';
							//cardDelBtnHtml += "&nbsp;&nbsp;"
//							cardDelBtnHtml += '<a href="#"  onclick="loseCard(\''
//									+ aaData.id
//									+ '\','
//									+ id
//									+ ',\''
//									+ aaData.kh
//									+ '\','
//									+ type
//									+ ');" data-toggle="tooltip" title="卡片丢失">卡片丢失</a>';

							$('td:eq(2)', nRow).html(cardDelBtnHtml);
							//$('td:eq(2)', nRow).html(getState_ch(aaData.state));
							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns,
						"fnInitComplete": function(oSettings, json) {
							GHBB.hide();
					    }

					});
}
// 0:新增，1:修改，-1需要删除 2:丢失 3正常
function getState_ch(state) {
	if (state == 2 || state == 3) {
		return "正常使用";
	} else if (state == 0) {
		return "需导入考勤机";
	} else if (state == 1) {
		return "需在考勤机修改";
	} else if (state == -1) {
		return "需从考勤机删除";
	} else if (state == 4) {
		return "丢失";
	}
}

function getDelXsjbCardAjaxUrl(cardid, dataid) {
	return ctx + "/xtgl/card/ajax_query_delxsjbcard?search_EQ_cardid=" + cardid
			+ "&search_EQ_id=" + dataid;
}

/** 卡解除绑定* */
function delCard(cardid, dataid, kh, type) {
	if (confirm("是否确认继续操作?")) {
		GHBB.prompt("数据保存中~");
		var url = getDelXsjbCardAjaxUrl(cardid, dataid);
		$.get(url, {}, function(data) {
			GHBB.hide();
			var result = data.split(",")[0];
			checkedId = data.split(",")[1];
			if (type == 2) {
				generate_stuCard_table();
			} else {
				generate_teacherCard_table();
			}

			generate_card_table(dataid, type);
		});
		// return true;
	} else {
		return false;
	}
}

/** 卡解除绑定* */
function loseCard(cardid, dataid, kh, type) {
	if (confirm("是否确认继续操作?")) {
		var url = ctx+"/xtgl/card/ajax_losecard?search_EQ_cardid="
		+ cardid + "&search_EQ_id="
		+ dataid+"&search_EQ_type="+type;
		$.post(
			url,
			{},
			function(data) {
				var result = data.split(",")[0];
				checkedId = data.split(",")[1];
				if(type==2){
					generate_stuCard_table();
				}else{
					generate_teacherCard_table();
				}
				
				generate_card_table(dataid,type);
			});
		var url = ctx + "/xtgl/card/ajax_losecard?search_EQ_cardid=" + cardid
				+ "&search_EQ_id=" + dataid;
		$.post(url, {}, function(data) {
			var result = data.split(",")[0];
			checkedId = data.split(",")[1];
			if (type == 2) {
				generate_stuCard_table();
			} else {
				generate_teacherCard_table();
			}

			generate_card_table(dataid, type);
		});
	} else {
		return false;
	}

}

function getAddCardAjaxUrl(id, type) {
	if (type == 1) {
		return ctx + "/xtgl/card/ajax_query_addCard?search_EQ_type=" + type
				+ "&search_EQ_id=" + id + "&search_EQ_kh="
				+ $("#teacherCardForm").val() + "&search_EQ_campusid="
				+ $("#search_EQ_campusid1").val();
	} else if (type == 2) {
		return ctx + "/xtgl/card/ajax_query_addCard?search_EQ_type=" + type
				+ "&search_EQ_id=" + id + "&search_EQ_kh="
				+ $("#stuCardForm").val() + "&search_EQ_campusid="
				+ $("#search_EQ_campusid2").val();
	}
}

function addCard(type) {
	var val = "";
	if (type == 2) {
		var stuCardNum = $("#stuCardForm").val();
		val = $('input:radio[name="stuOptionsRadios"]:checked').val();
		if (val == null || val == "") {
			alert("请选择学生");
			return;
		} else if (stuCardNum.length < 10 || isNaN(stuCardNum)){
			alert("卡号必须10位数字");
			return;
		}

	} else if (type == 1) {
		var teacherCardNum = $("#teacherCardForm").val();
		val = $('input:radio[name="teacherOptionsRadios"]:checked').val();
		if (val == null || val == "") {
			alert("请选择老师");
			return;
		} else if (teacherCardNum.length < 10 || isNaN(teacherCardNum)){
			alert("卡号必须10位数字");
			return;
		}
	}
	GHBB.prompt("数据保存中~");
	var url = getAddCardAjaxUrl(val, type);
	$.get(url, {}, function(data) {
		GHBB.hide();
		var result = data.split(",")[0];
		checkedId = data.split(",")[1];
		if (result == "true") {
			if (type == 2) {
				generate_stuCard_table();
			} else {
				generate_teacherCard_table();
			}
			generate_card_table(val, type);
		} else {
			alert(data);
		}

	});
}

function getDelMachineAjaxUrl(id,macid) {
	return ctx + "/xtgl/card/ajax_delmachine?search_EQ_id=" + id
			+ "&search_EQ_campusid=" + $("#search_EQ_campusid4").val()+"&search_EQ_macid=" + macid;
}

/** 考勤机解除* */

function delMachine(id,macid) {
	if (confirm("是否删除该考勤机?")) {
		var url = getDelMachineAjaxUrl(id,macid);

		$.get(url, {}, function(data) {
			generate_macStatus_table();
		});
	}
	;

}

function getAjaxAddMachineUrl() {
	return ctx + "/xtgl/card/ajax_addmachine?search_EQ_macid="
			+ $("#macid-input-form").val() + "&search_EQ_campusid="
			+ $("#search_EQ_campusid4").val() + "&search_EQ_protocolversion="
			+ $("#search_EQ_protocolversion").val()+"&search_EQ_teacherAdmin="
				+ $("#search_EQ_teacherAdmin").val()+"&search_EQ_macname="
				+ $("#macname-input-form").val();;
}
function addMachine() {
	if ($("#macid-input-form").val() == null || $("#macid-input-form").val() == ""
			|| $("#macid-input-form").val().length < 7) {
		alert("考勤机号不能为空,且大于等于7位");
		return;
	}
	if($("#macid-input-form").val().length > 45){
		alert("考勤机号不能大于45位");
		return;
	}
	if($("#macname-input-form").val().length > 20){
		alert("考勤机名称不能大于20位");
		return;
	}
	if ($("#search_EQ_teacherAdmin").val() == null || $("#search_EQ_teacherAdmin").val() == "") {
		alert("请设置考勤机管理员,以便考勤机断线提醒");
		return;
	}
	GHBB.prompt("数据保存中~");
	var url = getAjaxAddMachineUrl();
	$.get(url, {}, function(data) {
		GHBB.hide();
		alert(data);
		generate_macStatus_table();
	});
}
/**
 * 导出学生、老师卡片配对模版
 * 
 * @param cardtype
 */
function expectImportCardDataTemplate() {
	var url = ctx + "/xtgl/card/expectImportCardDataTemplate";

	var submitData = {
		campusid : $("#expectImportCardDataTemplate_EQ_campusid").val()
	};
	$.post(url, submitData, function(data) {
		
		window.location.href = ctx + data;
	});
}


function cardImportPreview() {
	$('#fileinput-button').attr("disabled","disabled");
	var cardFileInput = "cardFile";
	var filepath = $("input[name='" + cardFileInput + "']").val();
	if (filepath == undefined || $.trim(filepath) == "") {
		alert("请选择上传文件！");
		$('#fileinput-button').removeAttr("disabled");
		return;
	} else {
		var fileArr = filepath.split("//");
		var fileTArr = fileArr[fileArr.length - 1].toLowerCase().split(".");
		var filetype = fileTArr[fileTArr.length - 1];
		if (filetype != "xls") {
			alert("上传文件必须为office 2003格式Excel文件,以xls结尾！");
			$('#fileinput-button').removeAttr("disabled");
			return;
		}
	}
	cardExcelUploadFile();
	// document.getElementById("cardImportNext").click();
	// $('#cardImportModel').modal('show');
	// $("#cardFileInput").val("");
}

/**
 * 上传学生或者老师与卡号关系对应，excel数据
 * 
 * @param cardtype
 */
function cardExcelUploadFile() {
	GHBB.prompt("数据正在导入中~");
	var cardFileInput = "cardFile";
	var campusid =$("#importCard_campusid").val();
	$.ajaxFileUpload({
				url : ctx + '/xtgl/card/cardInfoImport/'+ campusid,// 需要链接到服务器地址
				secureuri : false,
				fileElementId : cardFileInput,// 文件选择框的id属性
				dataType : 'json', // 服务器返回的格式，可以是json
				success : function(data, status) {
					GHBB.hide();
					var errstate_stu=data.stu.errstate;
					var errstate_teacher=data.teacher.errstate;
					var msg="";
					msg="学生配卡数据导入:成功:"+data.stu.importNum+"张；失败："+data.stu.errorNum+"张。\n";
				
					msg+="老师配卡数据导入:成功:"+data.teacher.importNum+"张；失败："+data.teacher.errorNum+"张。";
					
					var cardList = new Array();

					if(errstate_stu==true){
						var stuCardList= data.stu.cardImportList;
						if(stuCardList!=undefined){
							cardList = stuCardList;
						}
					}
					if(errstate_teacher==true){
						var teacherCardList =data.teacher.cardImportList;
						if(teacherCardList!=undefined){
							cardList = cardList.concat(teacherCardList);
						}
					}
					//提示
					alert(msg);
					if(cardList!=undefined && cardList.length>0){
						generate_importCardDataPreView_table(cardList);
						document.getElementById("cardImportNext").click();
					}
					$('#fileinput-button').removeAttr("disabled");

				},
				error : function(data, status) {
					GHBB.hide();
					alert(data);
					$('#fileinput-button').removeAttr("disabled");
				}
			});
}

/**
 * 导入卡片配对关系表，预览
 * 
 * @param aaDataJson
 */
function generate_importCardDataPreView_table(aaData) {
	var rownum = 1;
	/* Initialize Datatables */
	// var sAjaxSource = getQueryXsjbCardAjaxUrl(id,type);
	// alert("generate_importCardDataPreView_table"+eval(aaData));
	var aoColumns = [ {
			"sTitle" : "序号",
			"sWidth" : "70px",
			"sClass" : "text-center",
			"mDataProp" : "index"
		}, {
			"sTitle" : "姓名",
			"sWidth" : "120px",
			"sClass" : "text-center",
			"mDataProp" : "xm"
		}, {
			"sTitle" : "班级名称",
			"sWidth" : "120px",
			"sClass" : "text-center",
			"mDataProp" : "bjmc"
		}, {
			"sTitle" : "卡号",
			"sWidth" : "120px",
			"sClass" : "text-center",
			"mDataProp" : "kh"
		}, {
			"sTitle" : "导入流水号",
			"sWidth" : "120px",
			"sClass" : "text-center",
			"mDataProp" : "serialnumber"
		}, {
			"sTitle" : "错误提示",
			"sClass" : "text-center",
			"mDataProp" : "errormsg"
		} ];
	$('#importCardData-datatable').dataTable({
		// "aoColumnDefs": [ { "bSortable": false, "aTargets": [ 1, 3] } ],
		// "aaSorting":[ [3,'desc']],
		"iDisplayLength" : 500,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort" : false,
		// "sAjaxDataProp":"cardImportList",
		"aaData" : eval(aaData),
		// "sAjaxSource": sAjaxSource,
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			// Append the grade to the default row class name
			// //alert(aaData.bjid);
			// $('td:eq(0)', nRow).html(rownum);
			// rownum=rownum+1;
			return nRow;
		},
		"aoColumns" : aoColumns
	});
}

/**
 * 保存学生或者老师与卡片匹配关系预览数据
 */
$("#importCardDataBtn").click(function() {
	var url = ctx + "/xtgl/card/cardInfoAddBatch";
	if ($("#importCardData_serialnumber").val() == "") {
		alert("数据存在错误，无法保存！");
		return false;
	}
	if ($("#importCardData_errstate").val() == "true") {
		alert("数据存在错误，无法保存！");
		return false;
	}
	if (confirm("是否将预览卡片导入系统?")) {
		var submitData = {
			serialnumber : $("#importCardData_serialnumber").val()
		};
		$('#importCardDataBtn').attr('disabled', 'true');
		$.post(url, submitData, function(data) {
			alert(data);
			$('#importCardDataBtn').attr('disabled', 'false');
		});
	} else {
		return false;
	}
	return false;
});


function expectCard(cardtype) {
	var url = ctx + "/xtgl/card/expectCardList";
	var submitData = {
		campusid : $("#search_EQ_campusid5").val(),
		cardtype : cardtype
	};
	$.post(url, submitData, function(data) {
		// var download = document.getElementById("exportFile");

		window.location.href = ctx + data;

	});
}

function backStep() {
	var first = $("#first");
	var second = $("#second");
	var third = $("#third");
	$("#cardImportBack1").click();
	var cardImportBack = $("#cardImportBack");
	var cardImportNext = $("#cardImportNext");
	if (first.css("display") == "block") {
		cardImportBack.css("display", "none");
		cardImportNext.css("display", "block");
	} else if (second.css("display") == "block") {
		cardImportBack.css("display", "block");
		cardImportNext.css("display", "block");
	} else if (third.css("display") == "block") {
		cardImportBack.css("display", "block");
		cardImportNext.css("display", "none");
	}
}

function nextStep() {
	var first = $("#first");
	var second = $("#second");
	var third = $("#third");
	var cardImportBack = $("#cardImportBack");
	var cardImportNext = $("#cardImportNext");
	$("#cardImportNext1").click();
	if (first.css("display") == "block") {
		cardImportBack.css("display", "none");
		cardImportNext.css("display", "block");
	} else if (second.css("display") == "block") {
		cardImportBack.css("display", "block");
		cardImportNext.css("display", "block");
	} else if (third.css("display") == "block") {
		cardImportBack.css("display", "block");
		cardImportNext.css("display", "none");
	}
}

function resetCampusCardState(macid,linkstate) {
	var campus = $("#search_EQ_campusid4").find("option:selected").text();
	
    if(linkstate != 0){
    	alert("请确认考勤机处于【已联机】状态！");
    	return;
    }
	if (confirm("确认同步卡片数据至 ["+macid+"] 考勤机?")) {
		GHBB.prompt("数据保存中~");
		var url = ctx + '/xtgl/card/activeMacImportCard/';
		var submitData = {
			campusid : $("#search_EQ_campusid4").val(),
			macid:macid
		};
		$.post(url, submitData, function(data) {
			generate_macStatus_table();
		});
	} else {
		return false;
	}
}

function showImportDataDetailModal(machineid){
	generate_importDataDetail_table(machineid);
	$('#modal-importaDatadetail').modal('show');

}

function generate_importDataDetail_table(machineid) {
	/* Initialize Datatables */
	var sAjaxSource = ctx + "/xtgl/card/ajax_query_importDatadetail?macid="
			+ machineid;
	$('#importDataDetail-datatable')
			.dataTable(
					{
						"iDisplayLength" : 20,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"sAjaxSource" : sAjaxSource,
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							if (aaData[3] == "0") {//
								var linkStateHtml = '新增';
							} else if(aaData[3] == "-1") {//
								var linkStateHtml = '删除';
							}else{
								var linkStateHtml = '修改';
							}

							$('td:eq(2)', nRow).html(linkStateHtml);
						},
						"aoColumns" : [ {
							"sTitle" : "姓名",
							"mDataProp" : "2",
							"sClass" : "text-center"
						}, {
							"sTitle" : "卡号",
							"mDataProp" : "1",
							"sClass" : "text-center"
						}, {
							"sTitle" : "状态",
							"mDataProp" : "3",
							"sClass" : "text-center"
						}]
					});

}

/**
 * 导出学生卡片
 * param campusid
 */
function expCardExcel(){
	GHBB.prompt("数据导出中~");
	var campusid = $("#search_EQ_campusid2").val();
	var param = {
		campusid : campusid
	}
	var submitData = {
		api : SYS_MANAGE_CARD_EXPEXCEL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json === "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			window.location.href=ctx + result.data;
		}else{
			alert(result.ret.msg);
		}
	});
}

/**
 * 导出老师卡片
 * param campusid
 */
function expCardTeacherExcel(){
	GHBB.prompt("数据导出中~");
	var campusid = $("#search_EQ_campusid1").val();
	var param = {
		campusid : campusid
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_CARD_TEACHER_EXPEXCEL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json === "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			window.location.href=ctx + result.data;
		}else{
			alert(result.ret.msg);
		}
	});
}

/**
 * 获取云看视频列表
 * param campusid
 */
function queryCameraList(){
	GHBB.prompt("正在加载~");
	var campusid = $("#search_EQ_campusid5").val();
	var deviceid = $("#camera-input-form").val();
	var param = {
		campusid : campusid,
		deviceid : deviceid
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_QUERY_CAMERA_LIST_FOR_PC,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json === "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			queryBjsj();
			createCameraList(result.data.cameraList);
		}else{
			alert(result.ret.msg);
		}
	});
}

function createCameraList(datas){
	if(datas != null && datas.length > 0){
		var cameraBox = "";
		for (var i = 0; i < datas.length; i++) {
			var ifuse = "";
			if(datas[i].cameraenabled){
				ifuse = '<span style="color:green;">正在使用</span>';
			}else{
				ifuse = '<span style="color:red;">停止使用</span>';
			}
			var publishdate = "未知";
			if(datas[i].publishdate != null){
				publishdate = datas[i].publishdate.substring(0,10);
			}
			var serviceStu = "";
			if(datas[i].isbinded && datas[i].servicenum == 0){
				serviceStu = '<span style="color:red;">正在接入中</span>';
			}else{
				serviceStu = datas[i].servicenum + "位学生";
			}
			var ifShowNameSpan = "";
			var ifShowNameInput = "";
			if(datas[i].cameraname == null || datas[i].cameraname == ""){
				ifShowNameSpan = ' class="hide"';
			}else{
				ifShowNameInput = ' hide';
			}
			cameraBox += '<div class="cameraBox">'
				   	 +  '	<div class="cameraBox_l">'
				   	 +  '		<div class="img">'
				   	 +  '			<img alt="" src="http://static.weixiaotong.com.cn/e8500c3f7add22c53dcfc428e87507408eae8e64.png" />'
				   	 +  '		</div>'
				   	 +  '		<a href="javascript:delCamera(\''+datas[i].id+'\');">删除</a>'
				   	 +  '	</div>'
				   	 +  '	<div class="cameraBox_r">'
				   	 +  '		<div class="cameraName">'
				   	 +  '			<span onclick="editCameraName(this);"'+ifShowNameSpan+'>'+datas[i].cameraname+'</span>'
				   	 +  '			<input onblur="updateCameraName(this,\''+datas[i].id+'\');" name="camera-name" type="text"'
				   	 +  '				class="form-control'+ifShowNameInput+'" required="required"'
				   	 +  '				placeholder="请输入摄像头名称" value="'+datas[i].cameraname+'" />'
				   	 +  '		</div>'
				   	 +  '		<table>'
				   	 +  '			<tr>'
				   	 +  '				<td>摄像头编号：</td>'
				   	 +  '				<td>'+datas[i].deviceid+'</td>'
				   	 +  '			</tr>'
				   	 +  '			<tr>'
				   	 +  '				<td>添加日期：</td>'
				   	 +  '				<td>'+publishdate+'</td>'
				   	 +  '			</tr>'
				   	 +  '			<tr>'
				   	 +  '				<td>视频时段：</td>'
				   	 +  '				<td>'+datas[i].playstartime+'-'+datas[i].playendtime+'</td>'
				   	 +  '			</tr>'
				   	 +  '			<tr>'
				   	 +  '				<td>服务学生：</td>'
				   	 +  '				<td>'+serviceStu+'</td>'
				   	 +  '			</tr>'
				   	 +  '			<tr>'
				   	 +  '				<td colspan="2">'
				   	 +  '					<div class="cameraBtn">'
				   	 +  '						<button type="button" onclick="showCamera(\''+datas[i].id+'\');" class="btn btn-sm btn-info">设置规则</button>'
//				   	 +  '						<a href="http://www.baidu.com" class="btn btn-sm btn-info" target="view_window">测试视频</a>'
				   	 +  '					</div>'
				   	 +  '				</td>'
				   	 +  '			</tr>'
				   	 +  '			<tr>'
				   	 +  '				<td colspan="2">'+ifuse+'</td>'
				   	 +  '			</tr>'
				   	 +  '		</table>'
				   	 +  '	</div>'
				   	 +  '</div>';
		}
		$("#camera-datatable").html(cameraBox);
	}else{
		$("#camera-datatable").html('<div class="noData">未查到数据</div>');
	}
}

function addCamera(){
	
	var campusid = $("#search_EQ_campusid5").val();
	var deviceid = $("#search-camera").val();
	var reg = /^[0-9a-fA-F]{1,12}$/;
	if(deviceid == "" || deviceid == null){
		alert("请填写摄像头编号！");
		return;
	}
	
//	else if(deviceid.length != 12){
//		alert("编号格式错误：长度必须是12位！");
//		return;
//	}else if(!deviceid.match(reg)){
//		alert("编号格式错误：必须由0-9,a-f的字符组成！");
//		return;
//	}
	GHBB.prompt("数据保存中~");
	var param = {
		campusid : campusid,
		deviceid : deviceid
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_SAVE_CAMERA_INFO_FOR_PC,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json === "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			alert("设备添加成功！");
			queryCameraList();
		}else{
			alert(result.ret.msg);
		}
	});
}

function editCameraName(obj){
	$(obj).addClass("hide");
	$(obj).parent().find("input[name='camera-name']").removeClass("hide");
}

function updateCameraName(obj,id){
	var cameraname = $(obj).val();
	var param = {
		cameraname : cameraname,
		cameraId : id
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_UPDATE_CAMERA_NAME_FOR_PC,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json === "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			queryCameraList();
		}else{
			alert(result.ret.msg);
		}
	});
}

function delCamera(id){
	if (confirm("是否确定删除设备?")) {
		GHBB.prompt("数据保存中~");
		var param = {
			cameraId : id
		}
		var submitData = {
			api : ApiParamUtil.SYS_MANAGE_DEL_CAMERA_INFO_FOR_PC,
			param : JSON.stringify(param)
		};
		$.post(commonUrl_ajax, submitData, function(json) {
			GHBB.hide();
			var result = typeof json === "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				alert("删除成功！");
				queryCameraList();
			}else{
				alert(result.ret.msg);
			}
		});
	}
}

function showCamera(id){
	$('#modal-camera').modal('show');
	queryCameraInfo(id);
}

function closeCamera(){
	$("#cameraid").val("");
	$("#playstartime").val("");
	$("#playendtime").val("");
	$("#cameraenabled").removeAttr("checked");
	$('#modal-camera').modal('hide');
}

function queryCameraInfo(id){

	var param = {
		cameraId : id
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_QUERY_CAMERA_INFO_FOR_PC,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {

		var result = typeof json === "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#cameraid").val(id);
			$("#playstartime").val(result.data.playstartime);
			$("#playendtime").val(result.data.playendtime);
			if(result.data.cameraenabled){
				$("#cameraenabled")[0].checked=true;
			}else{
				$("#cameraenabled").removeAttr("checked");
			}
			setCheckedBj(result.data.bjids);
		}else{
			alert(result.ret.msg);
		}
	});
}

function setCheckedBj(bjids){
	$("#bjList").find(".searchBtnActive").removeClass("searchBtnActive");
	var allbjids = $("#bjList").find(".searchBtn");
	var bjidsArr = [];
	for (var i = 0; i < allbjids.length; i++) {
		bjidsArr.push(allbjids.eq(i).attr("id"));
	}
	if(bjids!=null && bjids.length>0){
		for (var i = 0; i < bjids.length; i++) {
			if($.inArray("bjsj_"+bjids[i], bjidsArr) != -1){
				$("#bjsj_"+bjids[i]).addClass("searchBtnActive");
			}
		}
	}else if($.inArray("bjsj_"+bjids, bjidsArr) != -1){
		$("#bjsj_"+bjids).addClass("searchBtnActive");
	}
}

function checkTime(id){
	var playstartime = $("#playstartime").val();
	var playendtime = $("#playendtime").val();
	var time1 = new Date(playstartime.replace("-", "/").replace("-", "/"));
	var time2 = new Date(playendtime.replace("-", "/").replace("-", "/"));
	if(id == "playstartime"){
		if(time1 > time2){
			$("#playendtime").val($("#playstartime").val());
		}
	}else{
		if(time2 > time1){
			$("#playstartime").val($("#playendtime").val());
		}
	}
}

function queryBjsj(){
	//GHBB.prompt("正在加载~");
	if($("#bjList").html().length == 0){
		var campusid = $("#search_EQ_campusid5").val();
		var param = {
			campusid : campusid,
			userid : main_userid
		}
		var submitData = {
			api : ApiParamUtil.COMMON_QUERY_CLASS_FOR_ALL,
			param : JSON.stringify(param)
		};
		$.post(commonUrl_ajax, submitData, function(json) {
			//GHBB.hide();
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				$("#bjList").children().remove();
				for (var i = 0; i < result.data.bjList.length; i++) {
					$("#bjList")
						.append('<li class="no_m_l"><div id="bjsj_'+ result.data.bjList[i].id 
								+'" class="searchBtn" onclick="changeAddChecked(this);">'
								+ result.data.bjList[i].bj
								+'</div></li>');
				}
			}
		});
	}
}

function changeAddChecked(obj){
	if($(obj).hasClass("searchBtnActive")){
		$(obj).removeClass("searchBtnActive");
	}else{
		$(obj).addClass("searchBtnActive");
	}
}

function getListids(id){
	var ids = "";
	var items = $("#"+id).find(".searchBtnActive");
	for (var i = 0; i < items.length; i++) {
		if(i > 0){
			ids += ",";
		}
		ids += items.eq(i).attr("id").split("_")[1];
	}
	return ids;
}

function setCameraInfo(){
	GHBB.prompt("数据保存中~");
	var bjids = getListids("bjList");
	var cameraenabled = $("#cameraenabled").is(':checked');
	var cameraid = $("#cameraid").val();
	var playstartime = $("#playstartime").val();
	var playendtime = $("#playendtime").val();
	var param = {
		bjids : bjids,
		cameraId : cameraid,
		cameraenabled : cameraenabled,
		playstartime : playstartime,
		playendtime : playendtime
	}
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_SET_CAMERA_INFO_FOR_PC,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json === "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			alert("设置规则成功！");
			queryCameraList();
			closeCamera();
		}else{
			alert(result.ret.msg);
		}
	});
}

/**
 * 获取是否配置一卡通通讯信息
 */
function findSmartCardKeyListCount(){
	var param = {
		campusid :$("#search_EQ_campusid2").val()
	};
	var params={params:param,readonly:true};
	var submitData = {
		apiparams : JSON.stringify(params)
		
	};
	$.post(ctx+"/securityapi/smartcard_listKeyCount", submitData, function(json) {
		var result = typeof json === "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			if(result.data>0){
				$("#stuAddCardDiv").css('display','none'); 
				$("#cardDataImport-li").css('display','none'); 
				$("#teacherAddCardDiv").css('display','none'); 
				
			}else{
				$("#stuAddCardDiv").css('display','block'); 
				$("#cardDataImport-li").css('display','block'); 
				$("#teacherAddCardDiv").css('display','block'); 
			}
		}else{
			alert(result.ret.msg);
		}
	});
}

/**
 * 查询教室列表
 * @param usertype
 * @param current_stuid
 */
function findMechineTypeList(){	
	var submitData={};
	submitData.type="MECHINE_TYPE";
	var resutl = CalApiUtil.callSecurityApi('dict_list',submitData);
	machineTypeList = resutl;
	createMechineTypeList(resutl);
	
}

function createMechineTypeList(datalist){
	if(datalist != null){
		
		$("#search_EQ_protocolversion option").remove();//user为要绑定的select，先清除数据   
        for(var i=0;i<datalist.length;i++){
        	$("#search_EQ_protocolversion").append("<option value=" + datalist[i].key+" >"
        			+ datalist[i].value + "</option>");
        };
        //$("#msglevel-listt").find("option[value='"+$("#classroomid1").val()+"']").attr("selected",'selected');
        $("#search_EQ_protocolversion").trigger("chosen:updated");
        
	}
}

function generate_classroomCondition_datatable(macid) {
	/* Initialize Datatables */
	var aoColumns = [{"sTitle": "pm2.5浓度","mDataProp": "pmwf","sClass": "text-center","sWidth":"100px"},
			            {"sTitle": "pm10浓度","mDataProp": "pmten","sClass": "text-center","sWidth":"100px"},
			            {"sTitle": "甲醛浓度","mDataProp": "voc","sClass": "text-center","sWidth":"100px"},
			            {"sTitle": "温度","mDataProp": "temperature","sClass": "text-center","sWidth":"100px"},
			            {"sTitle": "湿度","mDataProp": "humidity","sClass": "text-center","sWidth":"100px"}];
		$('#classroomCondition-datatable').dataTable({
			"aaSorting":[ [3,'desc']],
			"iDisplayLength" : 10,
			"bFilter" : false,
			"bLengthChange" : false,
			"bDestroy" : true,
			"bAutoWidth" : false,
			"bSort":false,
			"sAjaxSource" : commonUrl_ajax,
			"bServerSide" : true,// false为前端分页
			"fnServerParams": function (aoData) {
//				var param = {
//					campusid: $("#campusList").val(),
//					searchString : $("#searchString").val(),
//					iDisplayStart: 0,
//			        iDisplayLength: 10,
//			        sEcho: 1
//				};
//				aoData.push( { "name": "api", "value": ApiParamUtil.MESSAGE_QUERY_LIST_FOR_LEADER } );
//				aoData.push( { "name": "param", "value": JSON.stringify(param) } );
			},
			"fnServerData": function (sSource, aoData, fnCallback) {
//	            $.ajax( {
//	                "dataType": 'json',
//	                "type": "POST",
//	                "url": sSource,
//	                "data": aoData,
//	                "success": function(json) {
//	                	if (json.ret.code == 200) {
//	                		fnCallback(json.data);
//	                	} else {
//	                		PromptBox.alert(json.ret.msg);
//	                	}
//					}             
//	            } );
				var submitData={};
				submitData.sn=macid;
				submitData.campusid=$("#search_EQ_campusid4").val();
	        	var result = CalApiUtil.callSecurityApi('examroom_getClassConditionList',submitData);
	        	var classConditionList={};
	        	classConditionList.aaData = result;
	        	classConditionList.iTotalDisplayRecords=result.length;
	        	classConditionList.iTotalRecords=result.length;
	        	classConditionList.sEcho=1;
	        	fnCallback(classConditionList);
	        },
			"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
//	        	$(nRow).addClass("td-message");
				var content = aaData.temperature;
//				var photoList = "";
//				if(aaData.contenttype == "1"){
//					content = "[语音]";
//				}else if(aaData.photoList != null && aaData.photoList.length > 0){
//					content = "[图片]" + aaData.content;
//					for ( var i = 0; i < aaData.photoList.length; i++) {
//						photoList += aaData.photoList[i] + ",";
//					}
//					photoList = '<input type="hidden" id="photoList'+aaData.id+'" value="'+photoList.substring(0, photoList.length - 1)+'" />';
//				}
//				var title = '<a href="javascript:seeDetail('+aaData.id+',\'send\',\''+aaData.serialnumber+'\',\''+aaData.contenttype+'\');"><span style="color:rgb(30, 30, 30);">'+aaData.title+'</span> <span style="color:rgb(153, 153, 153)">'+content+'</span></a>';
//				$('td:eq(1)', nRow).html(title);
//	 			if(aaData.state == 1){
//	 				var detailHtml='<div style="text-align:center;">待发布</div>';
//	 	 			$('td:eq(3)', nRow).html(detailHtml);
//	 			}else{
//	 				var detailHtml='<div style="text-align:center;"><a href="javascript:seeTzyh('+aaData.id+',\''+aaData.serialnumber+'\')">发送'+aaData.receiveCount+'人，阅读'+aaData.readCount+'人，回复'+aaData.replaynum+'人</a></div>';
//	 	 			$('td:eq(3)', nRow).html(detailHtml);
//	 			}
				
			},
			"aoColumns" : aoColumns,
			"fnInitComplete": function(oSettings, json) {
				GHBB.hide();
		    }
		});

}