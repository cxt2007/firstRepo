/*
 *  Document   : yqdtPage.js
 *  Author     : yxw
 *  Description: 园区动态管理页面
 */

var ctx = $("#ctx").val();
var yqdtType = $("#yqdtType").val();
var slaveuser = $("#slaveuser").val();
var COMMON_WX_PUSH = $("#COMMON_WX_PUSH").val();
var commonUrl_ajax = $("#commonUrl_ajax").val();
var ifpreview = 0;
var editor;

$(document).ready(
		function() {
			generate_sysmsg_table();
			$("#state-chosen").change(function() {
				generate_sysmsg_table();
			});
			$("#ifpush-chosen").change(function() {
				generate_sysmsg_table();
			});
//			$("#receiver-chosen").change(function() {
//				generate_sysmsg_table();
//			});
//			
			
			$("#search-btn").click(function() {
				generate_sysmsg_table();
			});
			$("#addPageBtn").click(
					function() {
						if (yqdtType == "3") {
							$("#school-chosen-add1").parent().parent().css(
									"display", "none");
							$("#school-chosen-add").parent().parent().css(
									"display", "block");
						}
						$('#addOrEdit').html("新增");
						var year = new Date().getFullYear();
						var mounth = new Date().getMonth() + 1;
						if (mounth < 10) {
							mounth = "0" + mounth;
						}
						var day = new Date().getDate();
						if (day < 10) {
							day = "0" + day;
						}
						var time = year + "-" + mounth + "-" + day;
						$('#info-id').val("");
						$('#info-count').val("0");
						$('#title-add').val("");
						$('#createtime').val(time);
						
						editor.html("");
						$('#jtnr').val("");
						$('#modal-addconfig').modal('show');
					});
			$("#sendSubmit").click(function() {
				btnClick(2);
			});
			$("#saveSubmit").click(function() {
				btnClick(1);
			});
			$("#preview").click(function() {
				btnClick(3);
			});
		});
KindEditor.ready(function(K) {
	var folder = "yqdt";
	editor = K.create('textarea[name="jtnr"]', {
		cssPath : ctx + '/static/kindeditor/plugins/code/prettify.css',
		uploadJson : ctx + '/filehandel/kindEditorUpload/' + folder + '/image',
		fileManagerJson : ctx + '/filehandel/kindEditorFileManager',
		allowFileManager : true,
		afterCreate : function() {
			var self = this;
			K.ctrl(document, 13, function() {
				self.sync();
				document.forms['inputForm'].submit();
			});
			K.ctrl(self.edit.doc, 13, function() {
				self.sync();
				document.forms['inputForm'].submit();
			});
		},
		afterBlur : function() {
			this.sync();
		}
	});
	// prettyPrint();
});

function delConfirm(num) {
	if (confirm("确认删除?")) {
		var url = ctx + "/yqdt/yqdt/ajax_del_news";
		var submitData = {
			id : num
		};
		$.post(url, submitData, function(data) {
			PromptBox.alert("删除成功!");
			generate_sysmsg_table();
			return false;
		});
	}
}

function toEdit(num) {
	
	$('#addOrEdit').html("修改");
	var url = ctx + "/yqdt/yqdt/ajax_edit_news";
	var submitData = {
		id : num
	};
	$.post(url, submitData, function(data) {
		var datas = eval("(" + data + ")");
		$('#info-id').val(datas.id);
		$('#title-add').val(datas.title);
		$('#info-count').val(datas.count);
		$('#createtime').val(datas.publishdate);
		$('#school-chosen-add1').find("option[value='" + datas.campusid + "']")
				.attr("selected", true);
		$('#school-chosen-add1').trigger("chosen:updated");
		
		editor.html(datas.jtnr);
		$('#jtnr').val(datas.jtnr);
		$('#modal-addconfig').modal('show');
		return false;
	});
}

function generate_sysmsg_table() {
	App.datatables();
	var bjid = "";
	var guidetype = 0;
	var receiver = 0;
	var type = yqdtType;
	var publishdate = "";
	var ifpush = $("#ifpush-chosen").val();
	var state = $("#state-chosen").val();
	//receiver = $("#receiver-chosen").val();
	var campusid=0;
	/* Initialize Datatables */
	var sAjaxSource = ctx + "/yqdt/yqdt/ajax_query_yqdt/" + type
			+ "?campusid=" +campusid + "&title="
			+ $("#title").val() + "&state=" + state + "&ifpush=" + ifpush
			+ "&bjid=" + bjid + "&guidetype=" + guidetype + "&receiver="
			+ receiver + "&publishdate=" + publishdate;
	var columns = [ {
			"sTitle" : "序号",
			"mDataProp" : "rowno",
			"sClass" : "text-center"
		}, {
			"sTitle" : "标题",
			"mDataProp" : "title",
			"sClass" : "text-center"
		}, 
		//{
//			"sTitle" : "用户类型",
//			"mDataProp" : "receiver",
//			"sClass" : "text-center"
//		},
		{
			"sTitle" : "发布日期",
			"mDataProp" : "publishdate",
			"sClass" : "text-center"
		}, {
			"sTitle" : "推送状态",
			"mDataProp" : "ifpush",
			"sClass" : "text-center"
		}, {
			"sTitle" : "管理",
			"mDataProp" : "operation",
			"sClass" : "text-center"
		} ];
	$('#sysmsg-datatable').dataTable({
		"iDisplayLength" : 50,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"sAjaxSource" : sAjaxSource,
		"aoColumns" : columns,
		"bAutoWidth" : false,
		"bServerSide" : true,// 服务器端必须设置为true
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			//推送状态
			if(aaData.ifpush==1){
				$('td:eq(3)', nRow).html("已推送");
			}else{
				$('td:eq(3)', nRow).html("未推送");
			}
			// 删除
			var operationHtml="";
			var pushMsgTeacherHtml='<a style="margin:0 8px;" href="javascript:sendInfoToWx(\''+aaData.id+'\',1);">推送老师</a>';
			var pushMsgParentHtml='<a style="margin:0 8px;" href="javascript:sendInfoToWx(\''+aaData.id+'\',2);">推送家长</a>';
			var pushMsgSubHtml='<a style="margin:0 8px;" href="javascript:sendInfoToWx(\''+aaData.id+'\',3);">推送关注者(未绑定)</a>';
			var delhtml = '<a style="margin:0 8px;" href="javascript:delConfirm(\''+aaData.id+'\');">删除</a>';
			$('td:eq(4)', nRow).html(pushMsgTeacherHtml+pushMsgParentHtml+pushMsgSubHtml+delhtml);
		},
	});
}



/**
 * 
 * @param state
 *            1保存草稿 2:正式发布 3:预览
 * @returns {Boolean}
 */
function btnClick(state) {
	if(state == 3 && (slaveuser == null || slaveuser == "")){
		PromptBox.alert("您登录的账号未绑定无法预览，请通过手机端进行绑定");
		return;
	}
	var info = $("#info-id").val();
	var title = $("#title-add").val().replace(/\t/g, "");
	var synchro = $("#synchro").val();
	var campusid =0;
	var ifpush = 0;
	var type = yqdtType;
	
	var select_xxlx= $("#select-xxlx").val();
	if (confirm("是否确定继续操作?")) {
		var bjid = "";
		var bjmc = "";
		var guidetype = "";
		var receiver = "";
		var orgcodes = "";
		//receiver = $("#receiver-chosen1").val();
		//orgcodes = $("#orgcode-chosen").val().toString();
		var url = ctx + "/yqdt/yqdt/ajax_add_news/" + type;
		var submitData = {
			id : $("#info-id").val(),
			title : title,
			campusid : campusid,
			publishdate : $("#createtime").val(),
			jtnr : $("#jtnr").val(),
			state : state,
			receiver : receiver,
			orgcodes : "",
			synchro:synchro,
			ifpush:ifpush,
			count:$("#info-count").val(),
			appid:$("#appid").val(),
			xx_type:select_xxlx
		};
		$.post(url, submitData, function(data) {
			if (data == "error" && state == "2") {
				PromptBox.alert("该类型已存在,不能新增");
				return false;
			}else{
				$("#info-id").val(data);
			}
			if(state != "3"){
				$('#modal-addconfig').modal('hide');
			}else{
				ifpreview = 1;
			}
			generate_sysmsg_table();
			return false;
		});
	} else{
		return false;
	}
}


/**
 * 消息推送 按用户类型
 * @param sendInfoId
 * @param receiver_type
 */
function sendInfoToWx(sendInfoId,receiver_type){
	var userrole = $("#userrole-chosen1").val();
	var userid = $("#userid").val();
	var msg = "";
	if(receiver_type == 1){
		msg = "确认推送给老师吗？";
	}else if(receiver_type ==2){
		msg = "确认只推送给家长吗？";
	}else if(receiver_type ==3){
		msg = "确认只推送给关注者吗？";
	}
	if(confirm(msg)) {
		//var isSelectZKY = $("#isSelectZKY").is(':checked') == true ? 1 : 0;
		var param = {
			id 	: sendInfoId,
			userid:userid,
			type : 22,
			receiver_type : receiver_type,
			isSelectZKY:1//暂时不给中科院推送
		}
		var submitData = {
			api : COMMON_WX_PUSH,
			param : JSON.stringify(param)
		};
		$.post(commonUrl_ajax, submitData, function(json) {
			var result = typeof json == "object" ? json : JSON.parse(json);
			ifpreview = 0;
			if(result.ret.code == 200){
				generate_sysmsg_table();
				PromptBox.alert("微信消息推送成功！");
			}else{
				PromptBox.alert("推送失败！");
			}
		});
		$("#modal-news-send").modal('hide');
	}
}


