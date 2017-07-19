/*
 *  Document   : tzList.js
 *  Author     : hbz
 *  Description: 通知管理页面
 */
var ctx = "";
var configList = function() {
	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$(document).ready(function() {

	$("#sysConfigQueryBtn").click(function() {
		generate_sysConfig_table();
	});

	$("#proxyConfigQueryBtn").click(function() {
		generate_proxyServer_table();
	});

	$("#proxyConfigAddBtn").click(function() {
		addProxyConfig();
	});

	

	$("#pushMsgTestBtn").click(function() {
		pushMsgTestBtn();
	});

	
	$("#getWechatUserList").click(function() {
		getWechatUserList();
	});
	
	$("#setMobileMenuBtn").click(function(){
		setMobileMenu();
	});
	
	$("#sendCrmNewsTest").click(function(){
		sendCrmNewsTest();
	});
	
	$("#getCampusQRcodeUrl").click(function(){
		getCampusQRcodeUrl();
	});
	
	$("#getWechatTemplateList").click(function(){
		getWechatTemplateList();
	});
	
	
	
	
});

/**
 * 系统参数卡片列表
 */
function generate_sysConfig_table() {
	var rownum = 1;
	var sAjaxSource = ctx + "/xtgl/config/ajax_query_config?search_EQ_orgcode="
			+ $("#search_EQ_orgcode").val();

	var aoColumns = [ {
		"bVisible" : false,
		"mDataProp" : "id"
	}, {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "configcode"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "configname"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "configvalue"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "orgcode"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "remark"
	} ];

	var exoTable = $('#sysCongfig-datatable').dataTable({
		// bJQueryUI : true,
		// "bServerSide" : true,
		// "iDisplayLength" : 50,
		// "aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		// "bFilter" : false,
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
			rownum = rownum + 1;
			return nRow;
		},
		"aoColumns" : aoColumns
	});

	exoTable.makeEditable({
		sUpdateURL : ctx + "/xtgl/config/updateConfig?prescCode=" + rownum,
		"aoColumns" : [ {
			class : 'read_only'
		}, {
			class : 'read_only'
		}, {
			indicator : 'Saving...',
			loadtext : 'loading...',
			type : 'text',
			onblur : 'submit'
		}, {
			indicator : 'Saving...',
			loadtext : 'loading...',
			type : 'text',
			onblur : 'submit'
		}, {
			class : 'read_only'
		}, {
			indicator : 'Saving...',
			loadtext : 'loading...',
			type : 'text',
			onblur : 'submit'
		} ],
		sAddURL : "XXXX.action",
		sAddHttpMethod : "GET",
		sDeleteHttpMethod : "GET"

	});
}

/**
 * 代理服务器配置
 */
function generate_proxyServer_table() {
	var rownum = 1;
	var sAjaxSource = ctx + "/xtgl/config/ajax_query_proxyserver";

	var aoColumns = [ {
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "serverip"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "internalip"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "updatetime"
	} ];

	var proxyServerTable = $('#proxyServer-datatable').dataTable(
			{
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
					var selectCheckHtml = "<input type='radio' id='"
							+ aaData.id + "' name='proxyServerRadios' value='"
							+ aaData.id
							+ "' onclick='generate_proxyConfig_table("
							+ aaData.id + ")'>";
					$('td:eq(0)', nRow).html(selectCheckHtml);
					rownum = rownum + 1;
					return nRow;
				},
				"aoColumns" : aoColumns
			});

}

/**
 * 代理服务器关联配置
 */
function generate_proxyConfig_table(serverid) {
	var rownum = 1;
	var sAjaxSource = ctx + "/xtgl/config/ajax_query_proxyconfig?search_EQ_id="
			+ serverid;
	var aoColumns = [ {
		"sTitle" : "序号",
		"sWidth" : "60px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}, {
		"sTitle" : "学校代码",
		"sWidth" : "90px",
		"sClass" : "text-center",
		"mDataProp" : "orgcode"
	}, {
		"sTitle" : "slaveuser",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "slaveuser"
	}, {
		"sTitle" : "管理",
		"sClass" : "text-center",
		"mDataProp" : "slaveuser"
	} ];

	var proxyConfigTable = $('#proxyConfig-datatable')
			.dataTable(
					{
						"aaSorting" : [ [ 1, 'asc' ] ],
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
							var DelBtnHtml = '<div class="btn-group btn-group-xs"><a href="#"  onclick="delProxyConfig(\''
									+ aaData.id
									+ '\','
									+ serverid
									+ ');" data-toggle="tooltip" title="删除" class="btn btn-default"><i class="fa fa-times"></i></a></div>';
							$('td:eq(3)', nRow).html(DelBtnHtml);
							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns
					});

}

function getDelProxyConfigAjaxUrl(proxyConfigId) {
	return "${ctx}/xtgl/config/ajax_query_delproxyconfig?search_EQ_id="
			+ proxyConfigId;
}

/** 删除学校与代理服务器关系* */

function delProxyConfig(proxyConfigId, serverid) {
	var url = ctx + "/xtgl/config/ajax_query_delproxyconfig?search_EQ_id="
			+ proxyConfigId;
	if (confirm("是否删除?")) {
		$.get(url, {}, function(data) {
			generate_proxyConfig_table(serverid);
		});
	}

}

function addProxyConfig() {
	var proxyServerid = $("input:radio[name='proxyServerRadios']:checked")
			.val();
	var proxyConfig_slaveuserForm = $("#proxyConfig-slaveuserForm").val();
	if (proxyConfig_slaveuserForm == "") {
		alert("slaveuserForm不能为空");
	} else {
		var url = ctx + "/xtgl/config/ajax_query_addproxyconfig?search_EQ_id="
				+ proxyServerid + "&search_EQ_slaveuser="
				+ proxyConfig_slaveuserForm;
		$.get(url, {}, function(data) {
			if (data == "true") {
				generate_proxyConfig_table(proxyServerid);
			} else {
				alert(data);
			}
			;

		});
	}
}




/**
 * 模拟发送消息
 */
function pushMsgTestBtn() {
	var url = ctx + "/xtgl/verifyUser/push_msg_test?orgcode="
			+ $("#search_EQ_orgcode").val();
	$.get(url, {}, function(data) {
		alert(data);
	});
}




function setMobileMenu(){
	var url = ctx + "/xtgl/config/set_mobile_menu?search_EQ_orgcode="
			+ $("#search_EQ_orgcode").val();
	$.get(url, {}, function(data) {
		alert(data);
	});
}



function getWechatUserList(){
	var url = ctx + "/xtgl/verifyUser/getWechatUserList?orgcode="
			+ $("#search_EQ_orgcode").val();;
	$.get(url, {}, function(data) {
		alert(data);
	});
}

function sendCrmNewsTest(){
	var url = ctx + "/xtgl/verifyUser/sendCrmNewsTest?orgcode="
			+ $("#search_EQ_orgcode").val();;
	$.get(url, {}, function(data) {
		alert(data);
	});
}

function getCampusQRcodeUrl(){
	var url = ctx + "/xtgl/verifyUser/getCampusQRcodeUrl?orgcode="
	+ $("#search_EQ_orgcode").val();;
	$.get(url, {}, function(data) {
		alert(data);
	});
}

function getWechatTemplateList(){
	var url = ctx + "/xtgl/config/getWechatTemplateList?search_EQ_orgcode="
	+ $("#search_EQ_orgcode").val();
	$.post(url, {}, function(data) {
		alert(data);
	});
}

