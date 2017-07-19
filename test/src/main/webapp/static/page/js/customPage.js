
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
		queryCustomType();
	});
	
	$("#type-chosen").change(function() {
		queryMonthTime();
	});
	
	$("#publishdate").change(function() {
		generate_table();
	});
	
	$("#ifpush-chosen").change(function() {
		generate_table();
	});
	
	$("#search-btn").click(function() {
		generate_table();
	});
	
	$("#addPageBtn").click(function() {
		newPageShow();
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
	$("#campus-chosen-add").change(function() {
		queryCustomTypeForForm("");
	});
	
});

KindEditor.ready(function(K) {
	var folder = "custom";
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
			queryCustomType();
		}
	});
}

function queryCustomType() {
	var customdatatype=$("#customdatatype").val();

	if(customdatatype!=undefined && customdatatype!=null && customdatatype!='' && customdatatype!='0'){
		queryMonthTime();
	}else{
		var param = {
				campusid : $("#campus-chosen").val()
			};
			var submitData = {
				api : ApiParamUtil.SYS_MANAGE_QUERY_SECOND_FUNCTION_LIST,
				param : JSON.stringify(param)
			};
			$.post(commonUrl_ajax, submitData, function(json) {
				var result = typeof json == "object" ? json : JSON.parse(json);
				if (result.ret.code == 200) {
					$("#type-chosen option").remove();
					for ( var i = 0; i < result.data.length; i++) {
						$("#type-chosen").append(
								"<option value=" + result.data[i].datatype + ">"
										+ result.data[i].name + "</option>");
					}
					$("#type-chosen option").eq(0).attr("selected", true);
					$("#type-chosen").trigger("chosen:updated");
					queryMonthTime();
				}
			});
	}
	
}
/**
 * 获取自定义表单
 * @returns
 */
function getCustomDatatype(){
	var customdatatype=$("#customdatatype").val();
	if(customdatatype!=undefined && customdatatype!=null && customdatatype!='' && customdatatype!='0'){
		return customdatatype;
	}else{
		return $("#type-chosen").val();
	}
}

/**
 * 获取自定义表单增加
 * @returns
 */
function getCustomAddDatatype(){
	var customdatatype=$("#customdatatype").val();
	if(customdatatype!=undefined && customdatatype!=null && customdatatype!='' && customdatatype!='0'){
		return customdatatype;
	}else{
		return $("#datatype-chosen-add").val();
	}
}

function queryMonthTime() {
	var param = {
		campusid : $("#campus-chosen").val(),
//		type : $("#type-chosen").val()
		type:getCustomDatatype()
	};
	var submitData = {
		api : ApiParamUtil.MYSHCOOL_DATEFORMAT_YYYYMM,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if (result.ret.code == 200) {
			$("#publishdate option").remove();
			$("#publishdate").append("<option value=\"\">全部日期</option>");
			for ( var i = 0; i < result.data.monthTime.length; i++) {
				$("#publishdate").append(
						"<option value=" + result.data.monthTime[i] + ">"
								+ result.data.monthTime[i] + "</option>");
			}
			$("#publishdate option").eq(0).attr("selected", true);
			$("#publishdate").trigger("chosen:updated");

			generate_table();
		}
	});
}

function generate_table() {
	App.datatables();
	GHBB.prompt("正在加载~");
	var aoColumns = [ {
		"sTitle" : "序号",
		"mDataProp" : "rowno",
		"sClass" : "text-center"
	}, {
		"sTitle" : "标题",
		"mDataProp" : "title",
		"sClass" : "text-center"
	}, {
		"sTitle" : "发布人",
		"mDataProp" : "publisher",
		"sClass" : "text-center"
	}, {
		"sTitle" : "发布日期",
		"mDataProp" : "publishdate",
		"sClass" : "text-center"
	}, {
		"sTitle" : "所属栏目",
		"mDataProp" : "type",
		"sClass" : "text-center"
	}, {
		"sTitle" : "管理",
		"mDataProp" : "operation",
		"sClass" : "text-center"
	} ];
	$('#menu-datatable').dataTable({
		"aaSorting" : [ [ 3, 'desc' ] ],
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
			var type = getCustomDatatype();
			if(type == undefined || type == null || type == ""){
				type = "-1";
			}
			
			var param = {
				campusid : $("#campus-chosen").val(),
				type : type,
				publishdate : $("#publishdate").val(),
				ifpush : $("#ifpush-chosen").val(),
				title : $("#title").val(),
				"iDisplayStart" : 0,
				"iDisplayLength" : 50,
				"sEcho" : 1
			};
			aoData.push({
				"name" : "api",
				"value" : ApiParamUtil.APPID_CUSTOMMENU_LIST_QUERY
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
			var publishdate=removeTimeInPublishdate(aaData.publishdate);			
			$('td:eq(3)', nRow).html(publishdate);
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}

function removeTimeInPublishdate(publishdate){
	if(publishdate!=null && publishdate!=""&&publishdate.split(" ").length==2&&publishdate.indexOf("未发布")==-1){
		publishdate=publishdate.split(" ")[0];		
	}
	return publishdate;
}

function newPageShow(){
	isedit = 0;
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
	queryCampusListForForm("","");
	$('#modal-addconfig').modal('show');
}

function queryCampusListForForm(_campusid,_type) {
	var param = {};
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_CAMPUS,
		param : JSON.stringify(param)
	};

	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if (result.ret.code == 200) {
			$("#campus-chosen-add option").remove();
			for ( var i = 0; i < result.data.campusList.length; i++) {
				$("#campus-chosen-add")
						.append(
								"<option value=" + result.data.campusList[i].id
										+ ">" + result.data.campusList[i].value
										+ "</option>");
			}
			if(isedit = 1){
				$('#campus-chosen-add').find("option[value='" + _campusid + "']")
				.attr("selected", true);
				$('#campus-chosen-add').trigger("chosen:updated");
			}else{
				$("#campus-chosen-add option").eq(0).attr("selected", true);
				$("#campus-chosen-add").trigger("chosen:updated");
			}
			
			queryCustomTypeForForm(_type);
		}
	});
}

function queryCustomTypeForForm(_type) {
	var customdatatype=$("#customdatatype").val();
	if(customdatatype!=undefined && customdatatype!=null && customdatatype!='' && customdatatype!='0'){
		
	}else{
		var param = {
				campusid : $("#campus-chosen-add").val()
			};
			var submitData = {
				api : ApiParamUtil.SYS_MANAGE_QUERY_SECOND_FUNCTION_LIST,
				param : JSON.stringify(param)
			};
			$.post(commonUrl_ajax, submitData, function(json) {
				var result = typeof json == "object" ? json : JSON.parse(json);
				if (result.ret.code == 200) {
					$("#datatype-chosen-add option").remove();
					for ( var i = 0; i < result.data.length; i++) {
						$("#datatype-chosen-add").append(
								"<option value=" + result.data[i].datatype + ">"
										+ result.data[i].name + "</option>");
					}
					
					if(isedit = 1){
						$('#datatype-chosen-add').find("option[value='" + _type + "']")
						.attr("selected", true);
						$('#datatype-chosen-add').trigger("chosen:updated");
					}else{
						$("#datatype-chosen-add option").eq(0).attr("selected", true);
						$("#datatype-chosen-add").trigger("chosen:updated");
					}
				}
			});
	}
	
}

/**
 * 
 * @param state
 *            1保存草稿 2:正式发布 3:预览
 * @returns {Boolean}
 */
function btnClick(state) {
	if (state == 3 && (slaveuser == null || slaveuser == "")) {
		PromptBox.alert("您登录的账号未绑定无法预览，请通过手机端进行绑定");
		return;
	}
	
	var title = $("#title-add").val().replace(/\t/g, "");
	var campusid = $("#campus-chosen-add").val();
	var type = getCustomAddDatatype();
	var createtime = $("#createtime").val();
	var ifpush = 0;
	
	if ($("#title-add").val() == "" || $("#title-add").val() == null) {
		return;
	} else if (campusid == "" || campusid == null) {
		PromptBox.alert("校区必选！");
		return;
	} else if (type == "" || type == null) {
		PromptBox.alert("类型必选！");
		return;
	}
	
	if(createtime == null || createtime == ""){
		PromptBox.alert("请选择发布时间！");
		return;
	}
	
	if (confirm("是否确定继续操作?")) {
		GHBB.prompt("数据保存中~");
		var bjid = "";
		var bjmc = "";
		var guidetype = "";
		var receiver = "";
		var orgcodes = "";

		var url = ctx + "/yqdt/yqdt/ajax_add_news/" + type;
		var submitData = {
			id : $("#info-id").val(),
			title : title,
			campusid : campusid,
			publishdate : $("#createtime").val(),
			jtnr : $("#jtnr").val(),
			state : state,
			guidetype : guidetype,
			bjid : bjid,
			bjmc : bjmc,
			receiver : receiver,
			orgcodes : orgcodes,
			ifpush : ifpush,
			count : $("#info-count").val(),
			appid:ApiParamUtil.APPID_CUSTOMMENU_LIST_JUMP,
			xx_type : xxType,
			type : type
		};
		$.post(url, submitData, function(data) {
			if (data == "error" && state == "2") {
				PromptBox.alert("该类型已存在,不能新增");
				GHBB.hide();
				return false;
			} else {
				$("#info-id").val(data);
			}
			if (state != "3") {
				$('#modal-addconfig').modal('hide');
			} else {
				ifpreview = 1;
				pushWx($("#info-id").val());
			}
			GHBB.hide();
			generate_table();
			return false;
		});
	} else {
		return false;
	}
}


function toEdit(num) {
	isedit = 1;
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
		$('#createtime').val(removeTimeInPublishdate(datas.publishdate));
		queryCampusListForForm(datas.campusid,datas.type);
		editor.html(datas.jtnr);
		$('#jtnr').val(datas.jtnr);
		$('#modal-addconfig').modal('show');
		return false;
	});
}

function previewInThePhone(id) {
	var userid = $("#userid").val();
	var campusid = $("#campus-chosen").val();
	var orgcode = $("#main_orgcode").val();
	var appid = "50331";
	var url = ctx + "/mobile/loading_page?orgcode=" + orgcode + "&campusid="
			+ campusid + "&appid=" + appid +"&datatype="+getCustomDatatype()+ "&dataid=" + id + "&userid="
			+ userid + "&fromusername="+$("#slaveuser").val()+"&preview=1";
	window.open(url, 'newwindow',
			'height=580,width=360,top=20,left=330,scrollbars=yes,location=no');
}

function pushWx(dataId) {
	if (ifpreview == 1) {
		// 预览
		dataType = getCustomAddDatatype();
		sendMsgToWx(dataId);
	} else {
		if (confirm("确认推送给全校老师和家长?")) {
			dataType = getCustomDatatype();
			sendMsgToWx(dataId);
		}
	}
}

function delConfirm(num) {
	if (confirm("确认删除?")) {
		var url = ctx + "/yqdt/yqdt/ajax_del_news";
		var submitData = {
			id : num,
			campusid : $("#campus-chosen").val()
		};
		$.post(url, submitData, function(data) {
			PromptBox.alert("删除成功!");
			generate_table();
			return false;
		});
	}
}

function showCommentBox(dataid) {
	$("#dataid").val(dataid);
	$('#modal-comment-select').modal('show');
	generate_table_comment();
}

function closeCommentBox() {
	$("#dataid").val("");
	$("#modal-comment-select").modal('hide');
	generate_table();
}

function sendMsgToWx(dataId) {
	var campusid;
	var type;

	if(ifpreview == 1){
		campusid = $("#campus-chosen-add").val();
		type = getCustomAddDatatype();
	}else{
		campusid = $("#campus-chosen").val();
		type = getCustomDatatype();
	}
	
	var param = {
		id : dataId,
		type : type,
		campusid : campusid,
		ifpreview : ifpreview,
		moduletype : "custom",
		datatype : dataType
	};
	var submitData = {
		api : ApiParamUtil.COMMON_WX_PUSH,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		ifpreview = 0;
		if (result.ret.code == 200) {
			generate_table();
			if ($('#modal-news-send').is(':visible')) {
				$('#modal-news-send').modal('hide');
			}
			PromptBox.alert("微信消息推送成功！");
		} else {
			PromptBox.alert("推送失败！");
		}
	});
}

function changeCheckBoxValue() {
	$("#ifSelected").val($("#ifSelected").is(':checked') ? "1" : "0,1");
	generate_table_comment();
}