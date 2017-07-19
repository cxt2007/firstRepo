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
var intervalTimer;
var editor;
var ifautosave = false;

$(document).ready(
		function() {
			generate_table();
			$("#state-chosen").change(function() {
				generate_table();
			});
			$("#ifpush-chosen").change(function() {
				generate_table();
			});
			$("#guidetype-chosen").change(function() {
				generate_table();
			});
			$("#receiver-chosen").change(function() {
				generate_table();
			});
			$("#bj-chosen").change(function() {
				generate_table();
			});

			$("#type-chosen").change(function() {
				generate_table();
			});

			$("#publishdate").change(function() {
				generate_table();
			});

			$("#ifSelected").click(function() {
				changeCheckBoxValue();
			});

			$('#sendNewsByCampushids').click(function() {
				if ($('#send_campushids').val() == null) {
					PromptBox.alert("请选择校区！");
					return;
				}
				pushWx($('#send_newsid').val());
			});

			$("#school-chosen").change(
					function() {
						var url = ctx + "/yqdt/yqdt/ajax_change_bj";
						var submitData = {
							campusid : $("#school-chosen").val()
						};
						$.post(url, submitData,
								function(data) {
									var datas = eval(data);
									$("#bj-chosen option").remove();// user为要绑定的select，先清除数据
									for ( var i = 0; i < datas.length; i++) {
										$("#bj-chosen").append(
												"<option value=" + datas[i][0]
														+ ">" + datas[i][1]
														+ "</option>");
									}
									;
									$("#bj-chosen option").eq(0).attr(
											"selected", true);
									$("#bj-chosen").trigger("chosen:updated");
									generate_table();
									return false;
								});
					});
			$("#school-chosen-add1").change(
					function() {
						var url = ctx + "/yqdt/yqdt/ajax_change_add_bj";
						var submitData = {
							campusid : $("#school-chosen-add1").val()
						};
						$.post(url, submitData, function(data) {
							var datas = eval(data);
							$("#bj-chosen-add option").remove();// user为要绑定的select，先清除数据
							for ( var i = 0; i < datas.length; i++) {
								$("#bj-chosen-add").append(
										"<option value=" + datas[i].id + ">"
												+ datas[i].bj + "</option>");
							}
							;
							$("#bj-chosen-add option").eq(0).attr("selected",
									true);
							$("#bj-chosen-add").trigger("chosen:updated");
							return false;
						});
					});
			$("#search-btn").click(function() {
				generate_table();
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
						$('#info-state').val("1");
						$('#info-count').val("0");
						$('#title-add').val("");
						$('#createtime').val(time);
						$('#topstate').val(0);
						$('#topTime').val(null);
						if (yqdtType == "3") {

							$("#school-chosen-add").find("option:selected")
									.attr("selected", false);// 清除多选框选中的值
							$('#school-chosen-add option').eq(0).attr(
									"selected", true);
							$("#school-chosen-add").multiselect('refresh');
						} else {
							$('#school-chosen-add1 option').eq(0).attr(
									"selected", true);
							$('#school-chosen-add1').trigger("chosen:updated");
						}
						if (yqdtType == "2" || yqdtType == "3"
								|| yqdtType == "7") {
							$("#ifpush").val("0");
						}
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
		uploadJson : ctx + '/filehandel/kindEditorUpload/' + folder
				+ '/image?campusid='
				+ $("#school-chosen-add1").val().toString(),
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
		afterChange : function() {
			this.sync();
		},
		afterFocus : function() {
			this.sync();
			ifautosave = true;
			var alaws = function() {
				automaticSave();
			};
			intervalTimer = setInterval(alaws, 30000);
		},
		afterBlur : function() {
			this.sync();
			ifautosave = false;
		}
	});
	// prettyPrint();
});

function delConfirm(num) {
	if (confirm("确认删除?")) {
		var url = ctx + "/yqdt/yqdt/ajax_del_xxjj";
		var campusid = $("#school-chosen").val();
		if (yqdtType == "10") {
			campusid = 0;
		}
		var submitData = {
			id : num,
			campusid : campusid,
			type : yqdtType
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				PromptBox.alert("删除成功!");
				generate_table();
			} else {
				PromptBox.alert("删除失败!");
			}
			return false;
		});
	}
}

function toEdit(num) {
	if (yqdtType == "3") {
		$("#school-chosen-add1").parent().parent().css("display", "block");
		$("#school-chosen-add").parent().parent().css("display", "none");
	}
	$('#addOrEdit').html("修改");
	var url = ctx + "/yqdt/yqdt/ajax_edit_news";
	var submitData = {
		id : num
	};
	$.post(url, submitData, function(data) {
		var datas = eval("(" + data + ")");
		$('#info-id').val(datas.id);
		$('#info-state').val(datas.state);
		$('#title-add').val(datas.title);
		$('#info-count').val(datas.count);
		$('#topstate').val(datas.topstate);
		$('#topTime').val(datas.topTime);

		$('#createtime').val(removeTimeInPublishdate(datas.publishdate));
		$('#school-chosen-add1').find("option[value='" + datas.campusid + "']")
				.attr("selected", true);
		$('#school-chosen-add1').trigger("chosen:updated");

		if (yqdtType == "3" && $('#synchro') != undefined) {
			$('#synchro').find("option[value='" + datas.synchro + "']").attr(
					"selected", true);
			$('#synchro').trigger("chosen:updated");
		}

		if (yqdtType == "4") {
			$('#bj-chosen-add').find("option[value='" + datas.bjid + "']")
					.attr("selected", true);
			$('#bj-chosen-add').trigger("chosen:updated");
		}
		if (yqdtType == "21") {
			$('#guidetypes-chosen').find(
					"option[value='" + datas.guidetype + "']").attr("selected",
					true);
			$('#guidetypes-chosen').trigger("chosen:updated");
		}
		if (yqdtType == "30") {
			$('#type-chosen-add').find("option[value='" + datas.type + "']")
					.attr("selected", true);
			$('#type-chosen-add').trigger("chosen:updated");
		}
		if ((yqdtType == "2" || yqdtType == "3" || yqdtType == "7")
				&& datas.ifpush == "1") {
			$("#ifpush").val("1");
		}
		editor.html(datas.jtnr);
		$('#jtnr').val(datas.jtnr);
		$('#modal-addconfig').modal('show');
		return false;
	});
}

function generate_table() {
	GHBB.prompt("正在加载~");
	App.datatables();
	var bjid = "";
	var guidetype = 0;
	var receiver = 0;
	var type = yqdtType;
	var publishdate = "";
	var ifpush = "1,0";
	var state = "1,2";
	if (yqdtType == "4") {
		bjid = $("#bj-chosen").val();
	} else if (yqdtType == "21") {
		guidetype = $("#guidetype-chosen").val();
	} else if (yqdtType == "22") {
		receiver = $("#receiver-chosen").val();
	} else if (yqdtType == "30") {
		type = $("#type-chosen").val();
	} else if (yqdtType == "2" || yqdtType == "3") {
		publishdate = $("#publishdate").val();
	}
	if (yqdtType == "2" || yqdtType == "3") {
		ifpush = $("#ifpush-chosen").val();
	} else {
		state = $("#state-chosen").val();
	}
	/* Initialize Datatables */
	var sAjaxSource = ctx + "/yqdt/yqdt/ajax_query_yqdt/" + type + "?campusid="
			+ $("#school-chosen").val() + "&title=" + $("#title").val()
			+ "&state=" + state + "&ifpush=" + ifpush + "&bjid=" + bjid
			+ "&guidetype=" + guidetype + "&receiver=" + receiver
			+ "&publishdate=" + publishdate;
	var columns;
	if (yqdtType == "4") {
		columns = [ {
			"sTitle" : "序号",
			"mDataProp" : "rowno",
			"sClass" : "text-center"
		}, {
			"sTitle" : "班级",
			"mDataProp" : "bjmc",
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
			"sTitle" : "管理",
			"mDataProp" : "operation",
			"sClass" : "text-center"
		} ];
	} else if (yqdtType == "21") {
		columns = [ {
			"sTitle" : "序号",
			"mDataProp" : "rowno",
			"sClass" : "text-center"
		}, {
			"sTitle" : "标题",
			"mDataProp" : "title",
			"sClass" : "text-center"
		}, {
			"sTitle" : "指南类型",
			"mDataProp" : "guidetype",
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
			"sTitle" : "管理",
			"mDataProp" : "operation",
			"sClass" : "text-center"
		} ];
	} else if (yqdtType == "22") {
		columns = [ {
			"sTitle" : "序号",
			"mDataProp" : "rowno",
			"sClass" : "text-center"
		}, {
			"sTitle" : "标题",
			"mDataProp" : "title",
			"sClass" : "text-center"
		}, {
			"sTitle" : "公众号关注用户",
			"mDataProp" : "receiver",
			"sClass" : "text-center"
		}, {
			"sTitle" : "发布日期",
			"mDataProp" : "publishdate",
			"sClass" : "text-center"
		}, {
			"sTitle" : "管理",
			"mDataProp" : "operation",
			"sClass" : "text-center"
		} ];
	}
	// else if () {
	// columns = [ {
	// "sTitle" : "标题",
	// "mDataProp" : "title",
	// "sClass" : "text-center"
	// }, {
	// "sTitle" : "发布日期",
	// "mDataProp" : "publishdate",
	// "sClass" : "text-center"
	// }, {
	// "sTitle" : "是否推送",
	// "mDataProp" : "ifpush",
	// "sClass" : "text-center"
	// }, {
	// "sTitle" : "发布人",
	// "mDataProp" : "publisher",
	// "sClass" : "text-center"
	// }, {
	// "sTitle" : "管理",
	// "mDataProp" : "operation",
	// "sClass" : "text-center"
	// } ];
	// }
	else if (yqdtType == "7" || yqdtType == "2" || yqdtType == "3") {
		columns = [ {
			"sTitle" : "标题",
			"mDataProp" : "title",
			"sClass" : "text-center"
		}, {
			"sTitle" : "发布日期",
			"mDataProp" : "publishdate",
			"sClass" : "text-center"
		}, {
			"sTitle" : "是否推送",
			"mDataProp" : "ifpush",
			"sClass" : "text-center"
		}, {
			"sTitle" : "发布人",
			"mDataProp" : "publisher",
			"sClass" : "text-center"
		}, {
			"sTitle" : "评论",
			"mDataProp" : "publisher",
			"sClass" : "text-center"
		}, {
			"sTitle" : "管理",
			"mDataProp" : "operation",
			"sClass" : "text-center"
		} ];
	} else {
		columns = [ {
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
			"sTitle" : "管理",
			"mDataProp" : "operation",
			"sClass" : "text-center"
		} ];
	}
	$('#yqdt-datatable')
			.dataTable(
					{
						"iDisplayLength" : 50,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"sAjaxSource" : sAjaxSource,
						"aoColumns" : columns,
						"bAutoWidth" : false,
						"bServerSide" : true,// 服务器端必须设置为true
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							// if(){
							// if(aaData.ifpush == "1"){
							// $('td:eq(2)', nRow).html("推送");
							// }else{
							// $('td:eq(2)', nRow).html("不推送");
							// }
							// }else
							if (yqdtType == "7" || yqdtType == "2"
									|| yqdtType == "3") {
								if (aaData.ifpush == "1") {
									$('td:eq(2)', nRow).html("推送");
								} else {
									$('td:eq(2)', nRow).html("不推送");
								}
								var editHtml = '<a href="javascript:void(0);" onclick="showCommentBox(\''
										+ aaData.id
										+ '\');">评论'
										+ aaData.commentCount
										+ ' 精选'
										+ aaData.commentSelectCount + '</a>';
								$('td:eq(4)', nRow).html(editHtml);
							}
							if (yqdtType == "3"
									&& $("#school-chosen option").length > 1) {
								var topstate = aaData.topstate;
								var topHtml = "";
								if (topstate > 0) {
									topHtml = "取消置顶";
								} else {
									topHtml = "置顶";
								}

								$('td:eq(5)', nRow)
										.html(
												"<a style='margin:0 5px;' href='javascript:showCampushidsPushWx("
														+ aaData.id
														+ ");'>微信推送</a><a style='margin:0 5px;' href='javascript:toEdit("
														+ aaData.id
														+ ");'>编辑</a><a style='margin:0 5px;' href='javascript:setTop("
														+ aaData.id
														+ ","
														+ topstate
														+ ");'>"
														+ topHtml
														+ "</a><a style='margin:0 5px;' href='javascript:delConfirm("
														+ aaData.id
														+ ");'>删除</a>");
							}
							// 日期显示时去掉时间（时分秒）
							var publishdate = removeTimeInPublishdate(aaData.publishdate);
							if (yqdtType == 4 || yqdtType == 21) {
								$('td:eq(4)', nRow).html(publishdate);
							} else if (yqdtType == 2 || yqdtType == 3
									|| yqdtType == 7) {
								$('td:eq(1)', nRow).html(publishdate);
							} else {
								$('td:eq(3)', nRow).html(publishdate);
							}
						},
						"fnInitComplete" : function(oSettings, json) {
							GHBB.hide();
						}
					});
}

function removeTimeInPublishdate(publishdate) {
	if (publishdate != null && publishdate != ""
			&& publishdate.split(" ").length == 2
			&& publishdate.indexOf("未发布") == -1) {
		publishdate = publishdate.split(" ")[0];
	}
	return publishdate;
}

/**
 * 显示选择推送学校
 */
function showCampushidsPushWx(dataid) {
	getDictCampushidList(ApiParamUtil.COMMON_QUERY_CAMPUS, '#send_campushids');
	$('#send_newsid').val(dataid);
	$('#modal-news-send').modal('show');
}

/**
 * 获取园所下拉框选项
 */
function getDictCampushidList(api, node) {
	var msg = "没有选项！";
	var url = commonUrl_ajax;
	var submitData = {
		api : api,
		param : JSON.stringify({
			userid : $('#main_userid').val(),
			campusid : $('#main_campusid').val()
		})
	};
	$.ajax({
		cache : false,
		type : "POST",
		url : url,
		data : submitData,
		success : function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code === "200") {
				createCampushidList(result.data.campusList, msg, node);
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

/**
 * 创建园所选项
 * 
 * @param dataData
 * @param msg
 * @param node
 */
function createCampushidList(dataData, msg, node) {
	var dataList = new Array();
	for ( var i = 0; i < dataData.length; i++) {
		dataList.push('<option value="' + dataData[i].id + '">'
				+ dataData[i].value + '</option>');
	}
	$(node).html(dataList.join(''));
	if (dataData == '' || dataData == null || dataData.length === 0) {
		PromptBox.alert(msg);
	} else {
		multiselect(node);
	}
	$("#send_campushids").multiselect("refresh");
}

/**
 * 多选渲染
 */
function multiselect(node) {
	var multiselectnode = $(node);
	for ( var i = 0; i < multiselectnode.length; i++) {
		multiselectnode.eq(i).multiselect({
			selectedList : 1
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

function generate_table_comment() {
	var aoColumns = [ {
		"sTitle" : "精选评论",
		"mDataProp" : "id",
		"sClass" : "text-center"
	}, {
		"sTitle" : "评论人",
		"mDataProp" : "publisher",
		"sClass" : "text-center"
	}, {
		"sTitle" : "评论时间",
		"mDataProp" : "commentTime",
		"sClass" : "text-center"
	}, {
		"sTitle" : "内容",
		"mDataProp" : "content",
		"sClass" : "text-center",
		"sWidth" : "400px"
	} ];

	$('#yezs-comment-datatable')
			.dataTable(
					{
						"aaSorting" : [ [ 3, 'desc' ] ],
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"bSort" : false,
						"sAjaxSource" : commonUrl_ajax,
						"bServerSide" : true,// 服务器端必须设置为true
						"fnServerParams" : function(aoData) {
							var param = {
								campusid : $("#school-chosen").val(),
								dataid : $("#dataid").val(),
								selectedState : $("#ifSelected").val(),
								"iDisplayStart" : 0,
								"iDisplayLength" : 10,
								"sEcho" : 1,
								xxjjtype : yqdtType

							};
							aoData
									.push({
										"name" : "api",
										"value" : ApiParamUtil.DAILY_MANAGE_KNOWLEDGE_QUERY_COMMENT_LIST_FOR_PC
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
									if (json.ret.code == 200) {
										fnCallback(json.data);
									} else {
										PromptBox.alert(json.ret.msg);
									}
								}
							});
						},
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							var checked = aaData.isSelected == "1" ? "checked"
									: "";
							var state = '<label class="switch switch-primary"><input type="checkbox" '
									+ checked
									+ ' onclick="selectComment(\''
									+ aaData.serialnumber
									+ '\',this);"><span></span></label>';
							$('td:eq(0)', nRow).html(state);
							var span = '<span title="'
									+ aaData.content
									+ '" style="display:block;width:400px;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'
									+ aaData.content + '</span>'
							$('td:eq(3)', nRow).html(span);
						},
						"aoColumns" : aoColumns
					});
}

function selectComment(serialnumber, obj) {
	var param = {
		campusid : $("#school-chosen").val(),
		serialnumber : serialnumber
	};
	var submitData = {
		api : ApiParamUtil.NEWS_QUERY_COMMENT_SELECT,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if (result.ret.code == 200) {
			if (result.ret.msg == "1") {
				$(obj).attr("checked", true);
			} else if (result.ret.msg == "0") {
				$(obj).attr("checked", false);
			} else {
				PromptBox.alert("设置精选评论失败！");
			}
		}
	});
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
	var info = $("#info-id").val();
	var title = $("#title-add").val().replace(/\t/g, "");
	var synchro = $("#synchro").val();
	var campusid = "";
	var ifpush = 0;
	var type = yqdtType;
	if (info == "" && yqdtType == "3" && $("#school-chosen-add") != null) {
		if ($("#school-chosen-add").val() != null) {
			campusid = $("#school-chosen-add").val().toString();
		}
	} else {
		campusid = $("#school-chosen-add1").val() + "";
	}
	if ($("#title-add").val() == "" || $("#title-add").val() == null) {
		return;
	} else if (campusid == "" || campusid == null) {
		PromptBox.alert("校区必选！");
		return;
	} else if (yqdtType == 4
			&& ($("#bj-chosen-add").val() == "" || $("#bj-chosen-add").val() == null)) {
		PromptBox.alert("班级必选！");
		return;
	}
	if (yqdtType == "21" || yqdtType == "30") {
		campusid = "";
	}
	if (yqdtType == "30") {
		type = $("#type-chosen-add").val();
	}
	var select_xxlx = "";
	if (yqdtType == "10") {
		if ($("#select-xxlx").val() == "" || $("#select-xxlx").val() == null) {
			PromptBox.alert("学校类型必选！");
			return;
		} else {
			select_xxlx = $("#select-xxlx").val();
		}
	}
	var createtime = $("#createtime").val();
	if (createtime == null || createtime == "") {
		PromptBox.alert("请选择发布时间！");
		return;
	}
	if (confirm("是否确定继续操作?")) {
		clearInterval(intervalTimer);
		GHBB.prompt("数据保存中~");
		var bjid = "";
		var bjmc = "";
		var guidetype = "";
		var receiver = "";
		var orgcodes = "";
		if (yqdtType == "4") {
			bjid = $("#bj-chosen-add").val();
			bjmc = $("#bj-chosen-add").find("option:selected").text();
		}
		if ((yqdtType == "2" || yqdtType == "3" || yqdtType == "7")
				&& $("#ifpush").prop("checked")) {
			ifpush = $("#ifpush").val();
		}
		if (yqdtType == "21") {
			guidetype = $("#guidetypes-chosen").val();
		}
		if (yqdtType == "22") {
			receiver = $("#receiver-chosen1").val();
			orgcodes = $("#orgcode-chosen").val().toString();
		}
		var url = ctx + "/yqdt/yqdt/ajax_add_news/" + type;
		var submitData = {
			id : $("#info-id").val(),
			title : title,
			campusid : campusid,
			publishdate : $("#createtime").val(),
			jtnr : trimTab($("#jtnr").val()),
			state : state,
			guidetype : guidetype,
			bjid : bjid,
			bjmc : bjmc,
			receiver : receiver,
			orgcodes : orgcodes,
			synchro : synchro,
			ifpush : ifpush,
			count : $("#info-count").val(),
			appid : $("#appid").val(),
			xx_type : select_xxlx,
			topstate : $("#topstate").val()
		};
		$.post(url, submitData, function(data) {
			if (data == "error" && state == "2") {
				PromptBox.alert("该类型已存在,不能新增");
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
			generate_table();
			GHBB.hide();
			return false;
		});
	} else {
		return false;
	}
}

function refreshAndClear() {
	generate_table();
	clearInterval(intervalTimer);
}

function automaticSave() {
	var jtnr = $("#jtnr").val();
	var info = $("#info-id").val();
	var title = $("#title-add").val().replace(/\t/g, "");
	var synchro = $("#synchro").val();
	var campusid = "";
	var ifpush = 0;
	var type = yqdtType;
	if (jtnr == null || jtnr == "") {
		return;
	}
	if (info == "" && yqdtType == "3" && $("#school-chosen-add") != null) {
		if ($("#school-chosen-add").val() != null) {
			campusid = $("#school-chosen-add").val().toString();
		}
	} else {
		campusid = $("#school-chosen-add1").val() + "";
	}
	if ($("#title-add").val() == "" || $("#title-add").val() == null) {
		title = "未命名";
	} else if (campusid == "" || campusid == null) {
		return;
	} else if (yqdtType == 4
			&& ($("#bj-chosen-add").val() == "" || $("#bj-chosen-add").val() == null)) {
		return;
	}
	if (yqdtType == "21" || yqdtType == "30") {
		campusid = "";
	}
	if (yqdtType == "30") {
		type = $("#type-chosen-add").val();
	}
	var select_xxlx = "";
	if (yqdtType == "10") {
		if ($("#select-xxlx").val() == "" || $("#select-xxlx").val() == null) {
			return;
		} else {
			select_xxlx = $("#select-xxlx").val();
		}
	}
	var createtime = $("#createtime").val();
	if (createtime == null || createtime == "") {
		return;
	}
	var bjid = "";
	var bjmc = "";
	var guidetype = "";
	var receiver = "";
	var orgcodes = "";
	if (yqdtType == "4") {
		bjid = $("#bj-chosen-add").val();
		bjmc = $("#bj-chosen-add").find("option:selected").text();
	}
	if ((yqdtType == "2" || yqdtType == "3" || yqdtType == "7")
			&& $("#ifpush").prop("checked")) {
		ifpush = $("#ifpush").val();
	}
	if (yqdtType == "21") {
		guidetype = $("#guidetypes-chosen").val();
	}
	if (yqdtType == "22") {
		receiver = $("#receiver-chosen1").val();
		orgcodes = $("#orgcode-chosen").val().toString();
	}
	var url = ctx + "/yqdt/yqdt/ajax_add_news/" + type;
	var submitData = {
		id : $("#info-id").val(),
		title : title,
		campusid : campusid,
		publishdate : $("#createtime").val(),
		jtnr : $("#jtnr").val(),
		state : $("#info-state").val(),
		guidetype : guidetype,
		bjid : bjid,
		bjmc : bjmc,
		receiver : receiver,
		orgcodes : orgcodes,
		synchro : synchro,
		ifpush : ifpush,
		count : $("#info-count").val(),
		appid : $("#appid").val(),
		xx_type : select_xxlx
	};
	$.post(url, submitData, function(data) {
		$("#info-id").val(data);
		$("#saveTips").css("display", "block");
		setTimeout(function() {
			$("#saveTips").css("display", "none");
		}, 2000);
		if (!ifautosave) {
			clearInterval(intervalTimer);
		}
	});
}

function previewInThePhone(id) {
	var userid = $("#userid").val();
	var campusid = $("#school-chosen").val();
	var orgcode = $("#orgcode").val();
	var appid = "";
	if (yqdtType == "2") {
		appid = "1071022";
	} else if (yqdtType == "3") {
		appid = "1071032";
	} else if (yqdtType == "7") {
		appid = "1071042";
	} else if (yqdtType == "9") {
		appid = "107116";
	} else if (yqdtType == "6") {
		appid = "207112";
	} else {
		PromptBox.alert("该模块不支持预览手机端页面功能！");
		return;
	}
	var url = ctx + "/mobile/loading_page?orgcode=" + orgcode + "&campusid="
			+ campusid + "&appid=" + appid + "&dataid=" + id + "&userid="
			+ userid + "&preview=1";
	window.open(url, 'newwindow',
			'height=580,width=360,top=20,left=330,scrollbars=yes,location=no');
}

function pushWx(dataId) {
	if (ifpreview == 1) {
		// 预览
		sendMsgToWx(dataId);
	} else {
		if (confirm("确认推送给老师和家长？")) {
			sendMsgToWx(dataId);
		}
	}
}

function sendMsgToWx(dataId) {
	var campusid;
	if ((yqdtType == "3" || yqdtType == "2")
			&& $("#school-chosen option").length > 1) {
		campusid = $('#send_campushids').val() !== null ? $('#send_campushids')
				.val().join(',') : $('#send_campushids').val();
	}
	// else{
	// campusid = $("#school-chosen").val();
	// }

	// campusid = $("#school-chosen").val();

	var param = {
		id : dataId,
		type : yqdtType,
		campusid : campusid,
		ifpreview : ifpreview
	}
	var submitData = {
		api : COMMON_WX_PUSH,
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

function setTop(id, topstate) {
	var confirmTitle = "置顶";
	if (topstate > 0) {
		confirmTitle = "取消置顶";
	}

	if (confirm("确认" + confirmTitle + "？")) {
		var submitData = {};
		submitData.campusid = $("#school-chosen").val();
		submitData.id = id;
		submitData.type = yqdtType;
		var resutl = CalApiUtil.callSecurityApi('xxjj_setTop', submitData,
				false);

		generate_table();
	}
}
