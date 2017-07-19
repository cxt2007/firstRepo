var ctx = $("#ctx").val();

$(document).ready(function() {
	App.datatables();
	getSearchDlsList();
	getSearchTypeList();
	generate_table_ghhd_dls();
	
	getGhhdList();
//	$('#modal-join-list').modal('show');
	
	$("#search_comment_btn").click(function() {
		generate_table_comment();
	});
	
	$("#search_btn").click(function() {
		generate_table_ghhd_dls();
	});
	$("#search_dlsid").change(function() {
		generate_table_ghhd_dls();
	});
	$("#search_state").change(function() {
		generate_table_ghhd_dls();
	});
	$("#join_campusid").change(function(){
		generate_table_join();
	});
});

function getGhhdList() {
	var submitData = {
		api : ApiParamUtil.APPID_GHHD_QUERY_ALL_LIST,
		param : JSON.stringify({
			userid:$("#main_userid").val()
		})
	};
	$.ajax({
		cache : false,
		type : "POST",
		url : commonUrl_ajax,
		data : submitData,
		success : function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code === "200") {
				assembleGhhdList(result.data.ghhdthemelist);
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

function assembleGhhdList(ghhdthemelist) {
	var ghhdListStr = "";
	for ( var i = 0; i < ghhdthemelist.length; i++) {
		var adObj = ghhdthemelist[i];
		
		ghhdListStr += '<div class="adBox">'
				  +  '	<div class="adBox_title">'
				  +  '		<span class="l">'+ghhdthemelist[i].title+'</span>'
				  +  '		<span class="r" id="rightTip_'+ghhdthemelist[i].id+'"></span>'
				  +  '	</div>'
				  +  '	<div class="adBox_url">'
				  +  '		<img alt="" src="'+ghhdthemelist[i].picpath+'" />'
				  +  '	</div>'
				  +  '	<div class="adBox_btnlist">'
				  +  '		<button type="button" class="btn btn-sm btn-info" id="editBtn_'+ghhdthemelist[i].id+'" onclick="toEdit('+ghhdthemelist[i].id+');">编&nbsp;&nbsp;辑</button>'
				  +  '		<button type="button" class="btn btn-sm btn-info" id="pushBtn_'+ghhdthemelist[i].id+'" dataid="'+ghhdthemelist[i].id+'" onclick="showPushConfig(this);">推送设置</button>'
				  +  '		<button type="button" class="btn btn-sm btn-info" id="joinBtn_'+ghhdthemelist[i].id+'" dataid="'+ghhdthemelist[i].id+'" onclick="showJoinList(this);">参赛情况</button>'
				  +  '		<button type="button" class="btn btn-sm btn-info" id="commentBtn_'+ghhdthemelist[i].id+'" dataid="'+ghhdthemelist[i].id+'" commentopen="'+ghhdthemelist[i].commentopen+'" launch="'+ghhdthemelist[i].launch+'" onclick="showCommentList(this);">评论管理</button>'
				  +  '	</div>'
				  +  '</div>';
	}
	ghhdListStr += '<div class="cl"></div>';
	$("#viewList").html(ghhdListStr);
	initImgCss();
}

function toAdd() {
	window.location.href = ctx + "/base/func/" + ApiParamUtil.APPID_GHHDZB_FORM_JUMP + "?appid=1115";
}

function toEdit(id){
	window.location.href = ctx + "/base/func/" + ApiParamUtil.APPID_GHHDZB_FORM_JUMP + "?appid=1115&dataId=" + id;
}

function toSubmit(id){
	PromptBox.confirm("您确定提交活动申请吗？提交之后无法再对内容进行编辑！", function(flag){
		if (flag) {
			var submitData = {
				api : ApiParamUtil.APPID_GHHD_THEME_COMMIT,
				param : JSON.stringify({
					id:id
				})
			};
			$.ajax({
				cache : false,
				type : "POST",
				url : commonUrl_ajax,
				data : submitData,
				success : function(datas) {
					var result = typeof datas === "object" ? datas : JSON.parse(datas);
					if (result.ret.code === "200") {
						PromptBox.alert("活动申请提交成功！");
						getGhhdList();
					} else {
						console.log(result.ret.code + ":" + result.ret.msg);
					}
				}
			});
		}
	})
}

function initImgCss() {
	var ad_img_box = $(".adBox_url");
	for (var i = 0; i < ad_img_box.length; i++) {
		var img_box = ad_img_box.eq(i);
		var img = img_box.find("img");
		if(img.height() > 0) {
			img.css("margin-top", -img.height() / 2);
		} else {
			img.css("top", 0);
			img.css("height", "100%");
		}
	}
}

/**
 * 显示推送设置模态窗口
 * @param obj
 */
function showPushConfig(obj) {
	var submitData = {
		api : ApiParamUtil.APPID_GHHD_THEME_CHILD_QUERY,
		param : JSON.stringify({
			id:$(obj).attr("dataid")
		})
	};
	$.ajax({
		cache : false,
		type : "POST",
		url : commonUrl_ajax,
		data : submitData,
		success : function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code === "200") {
				if (result.data.stage != 0) {
					if (result.data.stage == 1) {
						$("#push_tips").html("当前处于报名阶段，请设置推送内容");
					} else if (result.data.stage == 2) {
						$("#push_tips").html("当前处于投票阶段，请设置推送内容");
					}else if (result.data.stage == 3) {
						$("#push_tips").html("当前处于公布阶段，请设置推送内容");
					}
					$("#push_id").val($(obj).attr("dataid"));
					$("#push_stage").val(result.data.stage);
					$("#push_title").val(result.data.title);
					$("#push_content").text(result.data.content);
					
					$("#preview_push_title").html(result.data.title);
					$("#preview_push_picpath").attr("src", result.data.picpath);
					$("#preview_push_content").html(result.data.content);
					
					$('#modal-push-config').modal('show');
				} else {
					PromptBox.alert("当前不在活动时间内，无法进行推送！");
				}
			} else {
				PromptBox.alert(result.ret.msg);
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

/**
 * 显示参赛情况模态窗口
 * @param obj
 */
function showJoinList(obj) {
	$("#join_id").val($(obj).attr("dataid"));
	getJoinCampusList();
	generate_table_join();
	generate_table_vote();
	
	$('#modal-join-list').modal('show');
}

//根据活动id获取参赛学校列表
function getJoinCampusList(){
	var submitData = {
			api : ApiParamUtil.APPID_GHHD_THEME_JOIN_CAMPUS_QUERY,
			param : JSON.stringify({
				id:$("#join_id").val()
			})
		};
		$.ajax({
			cache : false,
			type : "POST",
			url : commonUrl_ajax,
			data : submitData,
			success : function(datas) {
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if (result.ret.code === "200") {
					var dataList = new Array();
					for(var i=0;i<result.data.campusList.length;i++){
						dataList.push('<option value="'+result.data.campusList[i].campusid+'">'
								+result.data.campusList[i].campusname+'</option>');
					}
					$("#join_campusid").html(dataList.join(""));
					$("#join_campusid").trigger("chosen:updated");
				} else {
					PromptBox.alert(result.ret.msg);
					console.log(result.ret.code + ":" + result.ret.msg);
				}
			}
		});
}

/**
 * 显示评论管理模态窗口
 * @param obj
 */
function showCommentList(obj) {
	$("#comment_id").val($(obj).attr("dataid"));
	if ($(obj).attr("commentopen") == 1) {
		$("#commentopen").prop("checked", true);
	} else if ($(obj).attr("commentopen") == 0) {
		$("#commentopen").prop("checked", false);
	}
	generate_table_comment();
	$('#modal-comment-list').modal('show');
}
function updateComment(){
	var id=$("#comment_id").val();
	var commentopen = $("#commentopen").is(":checked") ? 1 : 0;
	var param = {
			id : id,
			commentopen : commentopen
		};
	var submitData = {
		api : ApiParamUtil.APPID_GHHD_CLOSE_COMMENT_UPDATE,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			if (commentopen == 1) {
				$("#commentopen").prop("checked", true);
				$(commentbtn).attr("commentopen",1);
			} else if (commentopen == 0) {
				$("#commentopen").prop("checked", false);
				$(commentbtn).attr("commentopen",0);
			}
		} else {
			PromptBox.alert("设置失败！");
		}
	});
}

function updateTitle() {
	$("#preview_push_title").html($("#push_title").val());
}

function updateContent() {
	$("#preview_push_content").html($("#push_content").val());
}

function saveAndPush() {
	if ($("#push_title").val() == '') {
		PromptBox.alert("请输入推送标题！");
		return;
	}
	if ($("#push_content").val() == '') {
		PromptBox.alert("请输入推送内容！");
		return;
	}
	var usertype = "";
	if ($('#push_teacher').is(":checked")) {
		usertype += ",1"
	}
	if ($('#push_parent').is(":checked")) {
		usertype += ",2"
	}
	if (usertype == '') {
		PromptBox.alert("请选择推送对象！");
		return;
	}
	var submitData = {
		api : ApiParamUtil.APPID_GHHD_THEME_PUSH,
		param : JSON.stringify({
			id:$("#push_id").val(),
			stage:$("#push_stage").val(),
			title:$("#push_title").val(),
			content:$("#push_content").val(),
			usertype:usertype.substring(1)
		})
	};
	$.ajax({
		cache : false,
		type : "POST",
		url : commonUrl_ajax,
		data : submitData,
		success : function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code === "200") {
				PromptBox.alert("推送成功！");
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

function generate_table_ghhd_dls() {
	GHBB.prompt("正在加载~");
	var rownum = 1;
	var aoColumns = [ {
		"sTitle" : "活动名称",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "title"
	}, {
		"sTitle" : "代理商名称",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "dlsname"
	}, {
		"sTitle" : "提交时间",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "publishdate"
	}, {
		"sTitle" : "审核状态",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "statename"
	}, {
		"sTitle" : "状态",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	}];
	
	$('#datatable-ghhd-dls').dataTable({
		"iDisplayLength" : 50,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				dlsids: $('#search_dlsid').val(),
				states: $('#search_state').val(),
				title: $('#search_title').val()
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.APPID_GHHD_CHECK_LIST_QUERY } );
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
		"bSort" : false,
		"bServerSide" : true,// false为前端分页
		"aaSorting" : [[ 1, "asc" ]],
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			$('td:eq(0)',nRow).html('<a href="javascript:toEdit('+aaData.id+');">'+aaData.title+'</a>');
			if (aaData.state == 1) {
				$('td:eq(4)',nRow).html('<a style="cursor:pointer;" dataid="' + aaData.id + '" onclick="showJoinList(this);">查看报表</a>');
			} else {
				$('td:eq(4)',nRow).html('');
			}
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}

function updateCommentDisplay(id, obj) {
	var isdisplay = $(obj).is(":checked") ? 1 : 0;
	var param = {
		id : id,
		isdisplay : isdisplay
	};
	var submitData = {
		api : ApiParamUtil.APPID_GHHD_ONE_COMMENT_UPDATE,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			if (isdisplay == 1) {
				$(obj).prop("checked", true);
			} else if (isdisplay == 0) {
				$(obj).prop("checked", false);
			}
		} else {
			PromptBox.alert("设置失败！");
		}
	});
}

function generate_table_comment() {
	var rownum = 1;
	GHBB.prompt("正在加载~");
	var aoColumns = [ {
		"sTitle" : "姓名",
		"sClass" : "text-center",
		"mDataProp" : "name"
	}, {
		"sTitle" : "时间",
		"sClass" : "text-center",
		"mDataProp" : "publishdate"
	}, {
		"sTitle" : "内容",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "content"
	}, {
		"sTitle" : "是否显示",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "isdisplay"
	}];
	
	$('#datatable-comment').dataTable({
		"iDisplayLength" : 50,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				id:$("#comment_id").val(),
				startdate:$("#search_startdate").val(),
				enddate:$("#search_enddate").val(),
				content:$("#search_comment_content").val(),
				iDisplayStart: 0,
		        iDisplayLength: 50,
		        sEcho: 1
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.APPID_GHHD_ALL_COMMENT_QUERY } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
			aoData.push( { "name": "iDisplayStart", "value": 0 } );
			aoData.push( { "name": "iDisplayLength", "value": 50 } );
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
			var span = '<span title="'+aaData.content+'" style="display:block;width:400px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+aaData.content+'</span>'
        	$('td:eq(2)',nRow).html(span);
        	var checked = aaData.isdisplay == 1 ? "checked" : "";
        	var state = '<label class="switch switch-primary"><input type="checkbox" '+checked+' onclick="updateCommentDisplay(\''+aaData.id+'\', this);"><span></span></label>';
        	$('td:eq(3)',nRow).html(state);
		}, 
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});

}

function generate_table_join() {
	GHBB.prompt("正在加载~");
	var rownum = 1;
	var aoColumns = [ {
		"sTitle" : "参与学校",
		"sWidth" : "200px",
		"sClass" : "text-center",
		"mDataProp" : "campusname"
	}, {
		"sTitle" : "学生姓名",
		"sWidth" : "120px",
		"sClass" : "text-center",
		"mDataProp" : "stuname"
	},{
		"sTitle" : "班级",
		"sWidth" : "130px",
		"sClass" : "text-center",
		"mDataProp" : "bjname"
	}];
	
	$('#datatable-join').dataTable({
		"iDisplayLength" : 50,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				id:$("#join_id").val(),
				campusid:$("#join_campusid").val()
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.APPID_GHHD_JOIN_DETAIL_QUERY } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
			aoData.push( { "name": "sEcho", "value": 1 } );
			aoData.push( { "name": "iDisplayStart", "value": 0 } );
			aoData.push( { "name": "iDisplayLength", "value": 10 } );
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
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});

}

function generate_table_vote() {
	var rownum = 1;
	GHBB.prompt("正在加载~");
	var aoColumns = [ {
		"sTitle" : "学生名称",
		"sWidth" : "120px",
		"sClass" : "text-center",
		"mDataProp" : "stuname"
	}, {
		"sTitle" : "学校名称",
		"sWidth" : "200px",
		"sClass" : "text-center",
		"mDataProp" : "campusname"
	}, {
		"sTitle" : "班级名称",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "bjname"
	}, {
		"sTitle" : "票数",
		"sWidth" : "130px",
		"sClass" : "text-center",
		"mDataProp" : "count"
	}];
	
	$('#datatable-vote').dataTable({
		"iDisplayLength" : 50,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
				id:$("#join_id").val()
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.APPID_GHHD_VOTE_DETAIL_QUERY } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
			aoData.push( { "name": "sEcho", "value": 1 } );
			aoData.push( { "name": "iDisplayStart", "value": 0 } );
			aoData.push( { "name": "iDisplayLength", "value": 10 } );
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
		"aaSorting" : [[ 3, "asc" ]],
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});

}

/**
 * 导出活动投票情况
 * 
 */
function exportVoteTable() {
	GHBB.prompt("数据导出中~");
	var param = {
		id : $("#join_id").val()
	};
	var submitData = {
		api : ApiParamUtil.APPID_GHHD_VOTE_DETAIL_EXPORT,
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
	$("#search_dlsid").html('<option value="'+allValue.toString()+'">全部代理商</option>' + dataList.join(''));
	if(dataData!='' && dataData != null && dataData.length>0){
		$("#search_dlsid").val(allValue.toString());
	}
	$("#search_dlsid").trigger("chosen:updated");
}

/**
 * 获取活动状态查询条件
 * 
 */
function getSearchTypeList(){
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
				createSearchTypeList(result.data.dictList);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createSearchTypeList(dataData){
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


/**
 * 获取代理商列表
 */
function getDlsList(){
	var msg = "没有选项！";
	var param = {
		campusid: $("#main_campusid").val(),
		userid: $("#main_userid").val()
	}
	var submitData = {
		api: "6070016",
		param: JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		async:false,
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code === "200") {
				createDlsList(result.data.dlslist,msg,"#dls_list");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}
function loadCityList(){
	var citys = "";
	$("#dls_list").find("option:selected").each(function(){
		var city = $(this).attr("citys");
		citys = citys + city + ",";
	});
	if(citys && citys.length>0){
		citys = citys.substring(0,citys.length-1);
	}
	getCityList(citys);
}

function loadCampusList(){
	var citys = "";
	var dlsids = "";
	$("#dls_list").find("option:selected").each(function(){
		var dlsid = $(this).val();
		dlsids = dlsids + dlsid + ",";
	});
	if(dlsids && dlsids.length>0){
		dlsids = dlsids.substring(0,dlsids.length-1);
	}
	$("#city_list").find("option:selected").each(function(){
		var city = $(this).val();
		citys = citys + city + ",";
	});
	if(citys && citys.length>0){
		citys = citys.substring(0,citys.length-1);
	}
	getCampusList(dlsids,citys);
}

/**
 * 获取城市列表
 */
function getCampusList(dlsids,citys){
	var msg = "没有学校！";
	var param = {
		campusid: $("#main_campusid").val(),
		dlsids:dlsids,
		citys:citys,
		userid: $("#main_userid").val()
	}
	var submitData = {
		api: "6070018",
		param: JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		async:false,
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code === "200") {
				createCampusList(result.data.campusList,msg,"#campus_list");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}
function createCampusList(dataData,msg,node){
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].campusid+'">'+dataData[i].campusname+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.PromptBox.alert(msg);
	}else{
		multiselect(node);
	}
	$(node).multiselect("refresh");
}
/**
 * 获取城市列表
 */
function getCityList(citys){
	var msg = "没有城市！";
	var param = {
		campusid: $("#main_campusid").val(),
		citys:citys,
		userid: $("#main_userid").val()
	}
	var submitData = {
		api: "6070017",
		param: JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		async:false,
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code === "200") {
				createCityList(result.data.citylist,msg,"#city_list");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

/**
 * 创建代理商选项
 * @param dataData
 * @param msg
 * @param node
 */
function createCityList(dataData,msg,node){
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].citycode+'">'+dataData[i].cityname+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.PromptBox.alert(msg);
	}else{
		multiselect(node);
	}
	$(node).multiselect("refresh");
}
/**
 * 创建代理商选项
 * @param dataData
 * @param msg
 * @param node
 */
function createDlsList(dataData,msg,node){
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].dlsid+'" citys="'+dataData[i].dlscity+'">'+dataData[i].dlsname+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.PromptBox.alert(msg);
	}else{
		multiselect(node);
	}
	$(node).multiselect("refresh");
}

/**
 * 多选渲染
 */
function multiselect(node){
	var multiselectnode = $(node);
	for (var i = 0; i < multiselectnode.length; i++) {
		multiselectnode.eq(i).multiselect({
			selectedList : 2
		});
	}
}

function showCampusList(){
	var schoolHtml = '';
	var campusids = "";//themeCapusids
	$("#campus_list").find("option:selected").each(function(){
		var school = $(this).text();
		var campusid = $(this).val();
		schoolHtml = schoolHtml + '<li>'+school+'</li>';
		campusids = campusids + campusid +",";
	});
	if(campusids && campusids.length>0){
		campusids = campusids.substring(0,campusids.length);
	}
	$("#themeCapusids").val(campusids);
	$("#showCampusList").find('ul').html(schoolHtml);
	$("#showCampusList").find('li').css({"float":"left","margin-left":"20px",
		"list-style":"none","background-color":"#7abce7",
		"margin-top":"5px","border-radius":"5px","color":"white","padding":"5px 10px"});
}

