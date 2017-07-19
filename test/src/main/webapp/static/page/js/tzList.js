/*
x *  Description: 通知管理页面
 */
var ctx = $("#ctx").val();
var tztype = 2;
var currentTzid = 0;
var currentSerialnumber = "";
var tzstate = 1;// 通知状态 1草稿 2 正式发布
var bjsjIds = "";
var campusids = "";
var loading = false;
var tabType = $("#tabType").val();
var userid = $("#userid").val();
var currentTime = new Date();
var viewMessage = {
		id:$("#viewMessageId").val() ? $("#viewMessageId").val():null,
		serialNumber:$("#viewMessageSerialNumber").val()? $("#viewMessageSerialNumber").val():null,
		contentType:$("#viewMessageContentType").val()? $("#viewMessageContentType").val():null
};


$(document).ready(function() {
			
	$("#jquery_jplayer_hd").jPlayer({
		ready: function (event) {
            $(this).jPlayer("setMedia", {
            });
        },
		supplied: "mp3",
		wmode: "window",
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		keyEnabled: true,
		remainingDuration: true,
		toggleDuration: true,
		preload: "auto",
		ended: function(ret) {
			$("#audiourl_"+$(ret.target).attr("playid")).prev().attr("onclick", "playAudioHdxx(this)").find("i").removeClass("voice_play");
		}
	});
	$('#publishdate').datetimepicker({
			lang:'ch',
			step:10, 
			yearStart:currentTime.getFullYear(),
			yearEnd:currentTime.getFullYear()+1,
			todayButton:false});
			
	if(tabType==="receivedMsg"){
		$("#receivedMsg-tab").addClass("active");
		$("#receivedMsg-tab-page").addClass("active");
	}else{
		$("#newMsg-tab-page").addClass("active");
		$("#newMsg-tab").addClass("active");
	}
	if(viewMessage !== null && viewMessage.id!== null &&  viewMessage.serialNumber!== null){
		seeDetail(viewMessage.id,"receive",viewMessage.serialNumber,viewMessage.contentType);
	}
	queryCampus();
	queryStuTreeData("campus");
	generate_receive_table();	
	generate_send_table();
	$("#tzForm_title").focus();
	
	$("#searchClassBtn").click(function(){
		queryClassStuList($("#searchClass").val());
	});

	$("#searchTeacherBtn").click(function(){
		queryTeacherList($("#searchTeacher").val());
	});
	
	$("#searchDeptBtn").click(function(){
		queryStuDeptList($("#searchDept").val());
	});
	
	$("#ajaxSaveTzCg").click(function(){
		saveTz(1);
	});
	
	$(".btnAuth_button").click(function(){
		isExitsFunction("changeMessageUrl") && changeMessageUrl();
	});
	
	$("#ajaxSaveTzZs").click(function(){
		saveTz(2);
	});
	
	$("#receive_ids").click(function(){
		$("input[name='receive_ids']").prop("checked", $("#receive_ids").prop("checked"));
	});
	
	$("#delReceiveMsgBtn").click(function (){
		delChecked();
	});
	
	$("#receivedMsgQueryBtn").click(function(){
		generate_receive_table();	
	});
	
	$("#send_ids").click(function(){
		$("input[name='send_ids']").prop("checked", $("#send_ids").prop("checked"));
	});
	
	$("#delSendedMsgBtn").click(function (){
		delTzByPublisherid();
	});
	
	$("#sendedMsgQueryBtn").click(function(){
		generate_send_table();
	});
	
	$("#tzyhSearchBtn").click(function(){
		generate_tzyh_table(currentTzid);
	});
	
	$("#btnAuth_span_view").click(function(){
		$("#tz_content").html("");
		generate_receive_table();
	});
	
	$("#btnAuth_span_reply").click(function(){
		replyMessage();
	});
	
	$("#replyNextPage").click(function(){
		changeReplyPage(1);
	});
	$("#replyPreviousPage").click(function(){
		changeReplyPage(2);
	});
	
	$("#teacherMsgQueryBtn").click(function(){
		queryLeaderMsgList();
	});
	$("#campusList").change(function(){
		queryLeaderMsgList();
	});
	
	$("#presetDate").click(function(){
		changeCheckBoxValue();
	});
	
	$("#confirmMsg").click(function(){
		showMsgList();
	});
	
	$.extend($.fn.tree.methods, {
		getCheckedExt : function(jq) {//扩展getChecked方法,使其能实心节点也一起返回
			var checked = $(jq).tree("getChecked");
			var checkbox2 = $(jq).find("span.tree-checkbox2").parent();
			$.each(checkbox2, function() {
				var node = $.extend({}, $.data(this, "tree-node"), {
					target : this
				});
				checked.push(node);
			});
			return checked;
		},
		getSolidExt : function(jq) {//扩展一个能返回实心节点的方法
			var checked = [];
			var checkbox2 = $(jq).find("span.tree-checkbox2").parent();
			$.each(checkbox2, function() {
				var node = $.extend({}, $.data(this, "tree-node"), {
					target : this
				});
				checked.push(node);
			});
			return checked;
		}
	});
	
	findMessageLevelList();

});

function showIndividual(){
	var ul = $("#individualList");
	var lis = ul.find("li");
	if(lis.length > 0){
		clearnIndividual();
	}else{
		createIndividualList();
	}
}

/**
 * 更新语音阅读状态
 */
function updateVoiceReadState(hdxxid){
	var param = {
			hdxxid:hdxxid
		}
	var submitData = {
		appid: ApiParamUtil.MSG_REPLY_UPDATE_READ_STATE,
		api: ApiParamUtil.MSG_REPLY_UPDATE_READ_STATE,
		param : JSON.stringify(param)
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
				$('li[name="'+hdxxid+'"]').find('.state').remove();
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});

}

function getNowFormatDate(date) {
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHour = date.getHours();
    var strMin = date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHour >= 0 && strHour <= 9) {
    	strHour = "0" + strHour;
    }
    if (strMin >= 0 && strMin <= 9) {
    	strMin = "0" + strMin;
    }
    
    var seperator1 = "-";
    var seperator2 = ":";
	return date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + strHour + seperator2 + strMin;
}

function changeCheckBoxValue(){
	var presetDate = $("#presetDate").is(':checked');
	if(presetDate){
		$("#publishdateDiv").show();
	}else{
		$("#publishdate").val('');
		$("#publishdateDiv").hide();
	}
}

/**
 * 
 * @param type 1下一页 2上一页
 */
function changeReplyPage(type){
	if(type===1){
		$('#tz_nowPage').val(parseInt($('#tz_nowPage').val())+1);
	}else{
		$('#tz_nowPage').val(parseInt($('#tz_nowPage').val())-1);
	}
	var msgtype = "";
	if($("#sendedMsg-tab-page").hasClass("active")){
		msgtype = "send";
	}else if ($("#receivedMsg-tab-page").hasClass("active")){
		msgtype = "receive";
	}
	getMessageReplyList(msgtype);
}



function getCheckCellValue(treeName) {
	var arrIds = [];
	var arrNames = [];
	var arrCampusIds = [];
	var arrBjsjIds = [];
	var parantid = '';
	var i;
	var checkeds = $(treeName).tree('getChecked');
	for (i=0; i < checkeds.length; i++) {
		var node;
		if(i==0 && checkeds[0].text=="全部"){
			node = $(treeName).tree('getNode', checkeds[i].target);
		}else{
			node = $(treeName).tree('getParent', checkeds[i].target);
		}
		// 若为叶子节点，存入节点集合
		var leaf = $(treeName).tree('isLeaf', checkeds[i].target);
		if (leaf) {
			arrIds.push(checkeds[i].id);
			arrNames.push(checkeds[i].text);
		}
		// 父节点为全部的不存入节点集合
		if (node.id != 0 && node.id != 1 && parantid != node.id) {
			if(node.attributes.layer == 'campus' || node.attributes.layer == 'campus_xs'){
				arrCampusIds.push(node.id);
			}
			if(node.attributes.layer == 'bjsj'){
				arrBjsjIds.push(node.id);
				var parentNode = $(treeName).tree('getParent', node.target);
				arrCampusIds.push(parentNode.id);
				
			}
			parantid = node.id;
		}
	}
	
	if (arrIds.length >= 0) {
		receiverIds = arrIds.join(',');
	}
	if(arrNames.length >= 0){
		receiverNames = arrNames.join(';');
	}
	
	arrCampusIds = getNoRepeat(arrCampusIds);
	if(arrCampusIds.length >= 0){
		campusids = arrCampusIds.join(',');
	}
	
	if(arrBjsjIds.length >= 0){
		bjsjIds = arrBjsjIds.join(',');
	}
	if(receiverNames == ""){
		receiverNames = "请点击右侧勾选接收人！";
	}
	$("#tzForm_receiverids").val(receiverIds);
	$("#tzForm_receiver").html(receiverNames);
}

/**
 * 
 * @param state
 *            1保存草稿 2:正式发布
 * @returns {Boolean}
 */
function saveTz(state) {
	
//	var campusid = $("#tzForm_camupsid").val() + "";
	var title = $("#tzForm_title").val();
	var content = $("#tzForm_content").val();

	if (title == null || title == "") {
		alert("请填写标题！");
		return;
	}
	
	if (content == null || content == "") {
		alert("请填写通知内容！");
		return;
	}
	
	if (content.length > 5000) {
		alert("请限制通知内容字数在5000字以内");
		return;
	}
	
	if (receiverIds == null || receiverIds == "") {
		alert("请在右侧选择接收人！");
		return;
	}
	
	var presetDate = $("#presetDate").is(':checked');
	var publishDateValue = $("#publishdate").val();
	var publishDateStr = "";
	if(presetDate){
		if(publishDateValue == ''){
			alert("请设置发布时间");
			return ;
		}
		publishDateStr = getNowFormatDate(new Date(publishDateValue));
		var publishDate = new Date(publishDateStr);
		var currentDate = new Date(getNowFormatDate(new Date()));
		if(publishDate.getTime()<=currentDate.getTime()){
			alert("预约发布时间需要大于当前时间！");
			$("#publishdate").val(getNowFormatDate());
			return;
		}
		state = 1;
	}
	publishDateStr = publishDateStr +":00";
//	var state_ch = tzstate == 1 ? "保存草稿" : "发布正式";
	if (confirm("是否确定发布正式通知?")) {
		GHBB.prompt("数据保存中~");
		fillIndividual();
		$("#ajaxSaveTzZs").attr("disabled","disabled");
		var url = ctx + "/jyhd/tz/ajax_save?appid="+$("#appid").val();
		var submitData = {};
		var resendsms=false;
		if($("#resendsms")!=undefined && $("#resendsms")!=null){
			resendsms=$("#resendsms").is(':checked');
		}
		if (tztype == 2) {
			submitData = {
//				id : $("#tzForm_id").val(),
				title : title,
				content : transferString(content),
//				campusid : campusids,
//				bjids : bjsjIds,
//				stuids : receiverIds,
				state : state,
				tztype : tztype,
				sendList : $("#sendList").val(),
				ispresetdate : presetDate,
				publishdate:publishDateStr,
				position:$("input[name='position']:checked").val(),
				resendsms:resendsms,
				level:$("#msglevel-list").val()
 
			};
		} else if (tztype == 4) {
			submitData = {
				title : title,
				content : transferString(content),
//				campusid : campusids,
//				teacherids : receiverIds,
				state : state,
				tztype : tztype,
				sendList : $("#sendList").val(),
				ispresetdate : presetDate,
				publishdate:publishDateStr,
				position:$("input[name='position']:checked").val(),
				resendsms:resendsms,
				level:$("#msglevel-list").val(),
			};
		} else {
			$("#ajaxSaveTzZs").removeAttr("disabled");
			return ;
		}
		
		$.post(url, submitData, function(data) {
			if(data=="保存成功"){
				GHBB.hide();
				// 初始化树
				if(tztype==4){
					resetTree('#teacherData');
				}else{
					resetTree('#xsjbData');
					resetTree('#stuDeptData');
				}
				
				$("#newMsg-tab-page").attr("class","");
				$("#receivedMsg-tab-page").attr("class","");
				$("#sendedMsg-tab-page").attr("class","active");
				
				$("#newMsg-tab").removeClass("active");
				$("#receivedMsg-tab").removeClass("active");
				$("#sendedMsg-tab").removeClass("active");
				$("#sendedMsg-tab").addClass("active");
				
				$("#tzForm_receiverids").val('');
				$("#tzForm_receiver").html('');
				$("#tzForm_title").val('');
				$("#tzForm_content").val('');
				
				generate_send_table();
				resetReceivers();
				clearnIndividual();
			}else{
				alert(data);
			}
			$("#ajaxSaveTzZs").removeAttr("disabled");
		});
		$("#ajaxSaveTzZs").removeAttr("disabled");
//		isExitsFunction("createUnreadMessageBox") && createUnreadMessageBox();
		return false;
	} else {
		return false;
	}
}


function generate_receive_table(){
	GHBB.prompt("正在加载~");
	var rownum=1;
	App.datatables();
	/* Initialize Datatables */
	var sAjaxSource=ctx+"/jyhd/tz/ajax_queryReceivedMsg";
    var param="content="+$("#search_LIKE_receivedMsg").val();
    sAjaxSource=sAjaxSource+"?"+param;//调用后台携带参数路径
	var aoColumns= [
						{ "sWidth": "70px", "sClass": "text-center","mDataProp": "id"},
						{ "sWidth": "70px", "sClass": "text-center","mDataProp": "publisher"},
    					{ "sWidth": "230px", "sClass": "", "mDataProp": "title"},
//    					{ "sWidth": "150px", "mDataProp": "content"},
    					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "publishdate"}
    	           ];
	
    $('#receivedMsg-datatable').dataTable({
    	"aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 ] }],
        "iDisplayLength": 50,
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "bAutoWidth":false,
        "sAjaxSource": sAjaxSource,
        "bSort" : false,
        "bServerSide":true,//服务器端必须设置为true
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
        	
        	var checkBox = '<input name="receive_ids" type="checkbox" value="'+aaData.id+'" />';
        	
        	if(aaData.isread == 2){
        		$('td:eq(1)', nRow).css("color","rgb(30, 30, 30)");
        		$('td:eq(1)', nRow).css("font-weight","bold");
        		$('td:eq(3)', nRow).css("color","rgb(30, 30, 30)");
        		$('td:eq(3)', nRow).css("font-weight","bold");
        	}
        	
        	$(nRow).addClass("td-message");
        	$('td:eq(0)', nRow).html(checkBox);
 			$('td:eq(2)', nRow).html(assemble(aaData,"receive"));
			rownum=rownum+1;
			return nRow;
		},
        "aoColumns":aoColumns,
        "fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
    });
}

function assemble(aaData,type){
	var dataArray = new Array();
	var noReadStyle = "" ;
	if(aaData.isread == 2){
		noReadStyle = ' style="font-weight:bold;"';
	}
	dataArray.push('<div ><a href="javascript:seeDetail('+aaData.id+',\''+type+'\',\''+aaData.serialnumber+'\',\''+aaData.contenttype+'\');" '+noReadStyle+'><span style="color:rgb(30, 30, 30);">'+aaData.title+'</span>');
	if(aaData.contenttype=="1"){
		dataArray.push(' <span style="color:rgb(153, 153, 153)">［语音］</span>');
	}else if(aaData.content !== null || aaData.content !== ''){
		dataArray.push(' <span style="color:rgb(153, 153, 153)">'+aaData.content.substr(0,20)+'</span>');
	}
	dataArray.push('</a></div>');
	return dataArray.join('');
}

function delChecked(){
	
	var chk_value =[];
    $('input[name="receive_ids"]:checked').each(function(){
    	chk_value.push($(this).val());
    });
    if(chk_value.length == 0){
    	alert("未选中消息！");
    	return;
    }
	if(confirm("确定删除所选消息?")){
		var url=ctx+"/jyhd/tz/delChecked";
		var submitData = {
				receive_ids	: chk_value
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data=="success"){
					alert("删除成功!");
					$("#receive_ids").prop("checked", false);
					generate_receive_table();
					return false;
				}else{
					alert(data);
				}
	      });
	}		
}

function generate_send_table(){
	GHBB.prompt("正在加载~");
	var rownum=1;
	App.datatables();
	/* Initialize Datatables */
	var sAjaxSource=ctx+"/jyhd/tz/ajax_querySendMsg";
    var param="content="+$("#search_LIKE_sendedMsg").val();
    sAjaxSource=sAjaxSource+"?"+param;//调用后台携带参数路径
	var aoColumns= [
						{ "sWidth": "70px", "sClass": "text-center","mDataProp": "id"},
						{ "sWidth": "100px", "sClass": "text-center","mDataProp": "receiver"},
    					{ "sWidth": "200px", "sClass": "td-message", "mDataProp": "title"},
//    					{ "sWidth": "150px", "mDataProp": "content"},
    					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "publishdate"},
//    					{ "sWidth": "100px", "sClass": "text-center","mDataProp": "replaynum"},
    					{ "sWidth": "200px", "sClass": "text-center","mDataProp": "receiveCount"}
    	           ];
	
    $('#sendedMsg-datatable').dataTable({
    	"aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 ] }],
        "iDisplayLength": 50,
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "bAutoWidth":false,
        "sAjaxSource": sAjaxSource,
        "bSort" : false,
        "bServerSide":true,//服务器端必须设置为true
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
        	
        	var checkBox = '<input name="send_ids" type="checkbox" value="'+aaData.id+'" />';
        	$('td:eq(0)', nRow).html(checkBox);
 			
 			$('td:eq(2)', nRow).html(assemble(aaData,"send"));
 			
// 			var replyHtml='<div style="text-align:center;"><a href="javascript:seeReply('+aaData.id+',\''+aaData.serialnumber+'\');">'+aaData.replaynum+'人回复</a></div>';
// 			$('td:eq(4)', nRow).html(replyHtml);
 			if(aaData.state == 1){
 	 			$('td:eq(4)', nRow).html('<div style="text-align:center;">待发布</div>');
 			}else{
 	 			var detailHtml='<div style="text-align:center;"><a href="javascript:seeTzyh('+aaData.id+',\''+aaData.serialnumber+'\')">发送'+aaData.receiveCount+'人，阅读'+aaData.readCount+'人，回复'+aaData.replaynum+'人</a></div>';
 	 			$('td:eq(4)', nRow).html(detailHtml);
 			}
 			
			rownum=rownum+1;
			return nRow;
		}, 
        "aoColumns":aoColumns,
        "fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
    });
}

function delTzByPublisherid(){
	
	var chk_value =[];
    $('input[name="send_ids"]:checked').each(function(){
    	chk_value.push($(this).val());
    });
    if(chk_value.length == 0){
    	alert("未选中消息！");
    	return;
    }
	if(confirm("确定删除所选消息?")){
		var url=ctx+"/jyhd/tz/delTzByPublisherid";
		var submitData = {
				send_ids	: chk_value
		}; 
		$.post(url,
			submitData,
	      	function(data){
				if(data=="success"){
					alert("删除成功!");
					$("#send_ids").prop("checked", false);
					generate_send_table();
					return false;
				}else{
					alert(data);
				}
	      });
	}		
}

function seeReply(tzid,serialnumber) {
	currentTzid = tzid;
	currentSerialnumber = serialnumber;
	$("#seeTzModel").modal("show");
	$("#peopleName").val("");
	generate_tzReply_table(tzid,serialnumber);
}

function seeDetail(tzid,type,serialnumber,contenttype) {
	var url=ctx+"/jyhd/tz/findTzDetail";
	var submitData = {
			tzid	: tzid,
			type	: type
	}; 
	$.get(url,
		submitData,
      	function(data){
			var datas = eval('('+data+')');
			$('#btnAuth_span_reply').hide();
			$('#replyContent').hide();
			$('#replyName').hide();
			$('#tz_title').html(datas.title);
			$('#tz_publisher').html(datas.publisher);
			$('#tz_publishdate').html(datas.publishdate);
//			$('#tz_content').html(datas.content);
			assembleContent(contenttype,datas);
			$('#tz_nowPage').val(1);
			$('#tz_parentid').val(tzid);
			$('#tz_senderid').val(datas.publisherid);
			$('#tz_serialnumber').val(serialnumber);
			$('.messageReplyFooter').hide();
			$('#messageReplyBox').html('');
			$('#replyContent').val('');
			getMessageReplyList(type);
			if(type=="receive"){
				$('#replyContent').show();
				$('#btnAuth_span_reply').show();
			}else{
				$('#btnAuth_span_reply').hide();
				$('#replyContent').hide();
			}
      });
	$('#seeTzDetailModel').modal('show');
}

function assembleContent(contenttype,datas){
	if(contenttype == "1" || datas.contenttype == "1"){
		var content = "";
		content  += '<span class="sj"></span>';
		content  += '<span class="text voicetext" onclick="playAudioHdxx(this);" voiceid="'+datas.id+'" style="min-width:20%;width:'+widthByDuration(parseInt(datas.duration))+'%;">' ;
		content += '<i class="voice_play_icon"></i>' ;
		content += '</span>' ;
		content += '</span>' ;
		content += '<input id="audiourl_'+datas.id+'" type="hidden" value="'+datas.content+'">' ;
		content +=  '<span class="tips">'+datas.duration+'"</span>' ;
		if(datas.isread==0){
			content += '<span class="state"></span>' ;
		}
		$('#tz_content').html(content);
	}else if(datas.photoList != null && datas.photoList.length > 0){
		var photo = "";
		for ( var i = 0; i < datas.photoList.length; i++) {
			photo += '<div class="content-img"><img alt="" src="'+datas.photoList[i]+'" /></div>';
		}
		var content = '<div class="content-font">'+datas.content+'</div>';
		$('#tz_content').html(content+photo);
	}else{
		var content = '<div class="content-font">'+datas.content+'</div>';
		$('#tz_content').html(content);
	}
}

/**
 * 播放语音
 * 
 * @param obj
 */
function playAudioHdxx(obj) {
	$("#jquery_jplayer_hd").jPlayer("stop");
	$('.voice_play').parent().attr("onclick", "playAudioHdxx(this)");
	$('.voice_play').removeClass("voice_play");
	if($(obj).parents('.textInfo').find('.state').length>0){
		updateVoiceReadState($(obj).attr('voiceid'));
	}
	var replyVoice = $("#jquery_jplayer_hd");
	replyVoice.attr("playid",$(obj).attr('voiceid'));
	replyVoice.jPlayer( "clearMedia" );
	replyVoice.jPlayer( "setMedia", {
		mp3: $('#audiourl_'+$(obj).attr('voiceid')).val()
	});
	$(obj).find("i").addClass("voice_play");
	$(obj).attr("onclick", "stopAudioHdxx(this)");
	replyVoice.jPlayer("play", 0);
}

function widthByDuration(duration){
	var width
	if(duration<5){
		width = 20;
	}else if(duration < 10){
		width = 20 + duration;
	}else if(duration<20){
		width = 25 + duration/2;
	}else if(duration<30){
		width = 35 + duration/3;
	}else if(duration<60){
		width = 45 + duration/4;
	}else if(duration==60){
		width = 60;
	}else{
		width = 20;
	}
	return width;
}


/**
 * 消息回复
 */
function replyMessage(){
	var replyContent = $('#replyContent').val();
	if(replyContent===null||replyContent===''){
		PromptBox.alert('消息回复不能为空！');
		return false;
	}
	var submitData = {
			api:ApiParamUtil.APPID_SERVICE_MESSAGE_REPLY_SAVE,
			param:JSON.stringify({
				parentid:$('#tz_parentid').val(),
				content:replyContent,
				serialnumber:$('#tz_serialnumber').val(),
				receiverid:$('#tz_senderid').val(),
				senderid:main_userid,
				usertype:1
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			generate_receive_table();
			$('#seeTzDetailModel').modal('hide');
			$('#replyContent').val('');
//			var result = typeof datas === "object" ? datas : JSON.parse(datas);
//			if(result.ret.code==="200"){
//				
//			}else{
//				console.log(result.ret.code+":"+result.ret.msg);
//			}
		}
	});
}

/**
 * 获取消息回复详情列表
 */
function getMessageReplyList(type){
	var submitData = {
			api:ApiParamUtil.MAIL_CENTER_REPLY_LIST_QUERY,
			param:JSON.stringify({
				serialnumber:$('#tz_serialnumber').val(),
				nowPage:$('#tz_nowPage').val(),
				pageSize:2
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
					if(result.data.pageTotal!==0){
						createLeaveReplyContent(result.data.replyrList,type);
						if(result.data.pageTotal>2)
							$('.messageReplyFooter').show();
						if($('#tz_nowPage').val()==1){
							$('#replyPreviousPage').attr("disabled","");
						}else{
							$('#replyPreviousPage').removeAttr("disabled");
						}
						if((parseInt($('#tz_nowPage').val())-1)*2+result.data.replyrList.length==result.data.pageTotal){
							$('#replyNextPage').attr("disabled","");
						}else{
							$('#replyNextPage').removeAttr("disabled");
						}
					}
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function sendReplyMessage(sendid,name){
	$('#tz_senderid').val(sendid);
	$('#replyContent').show();
	$('#replyContent').val('');
	$('#replyName').show();
	$('#replyName').text('@'+name);
	$('#btnAuth_span_reply').show();
}

function createLeaveReplyContent(dataList,type){
	var dataArray = new Array();
	for(var i=0;i<dataList.length;i++){
		dataArray.push('<div class="message-reply-box">');
		dataArray.push('<div>');
		dataArray.push('<span class="name">'+dataList[i].name+'</span>');
		dataArray.push('<span class="time">'+dataList[i].time+'</span>');
		if(type==="send" && $(".nav-tabs[data-toggle='tabs']").find(".active").attr("id") != "leader-tab-page")
			dataArray.push('<button class="btn btn-sm btn-default send-reply" onclick="sendReplyMessage('+dataList[i].senderid+',\''+dataList[i].name+'\');">回复</button>');
		dataArray.push('</div>');
		var content="";
		var datas = dataList[i];
		if(datas.contenttype == "1"){
			content  += '<span class="sj"></span>';
			content  += '<span class="text voicetext" onclick="playAudioHdxx(this);" voiceid="'+datas.id+'" style="min-width:20%;width:'+widthByDuration(parseInt(datas.duration))+'%;">' ;
			content += '<i class="voice_play_icon"></i>' ;
			content += '</span>' ;
			content += '</span>' ;
			content += '<input id="audiourl_'+datas.id+'" type="hidden" value="'+datas.content+'">' ;
			content +=  '<span class="tips">'+datas.duration+'"</span>' ;
			if(datas.isread==0){
				content += '<span class="state"></span>' ;
			}
		}else if(datas.fileList != null && datas.fileList.length > 0){
			var photo = "";
			for ( var j = 0; j < datas.fileList.length; j++) {
				photo += '<div class="content-img"><img alt="" src="'+datas.fileList[j]+'" /></div>';
			}
			content = '<div class="message-reply-content">'+datas.content+'</div>' +photo;
		}else{
			content = '<div class="message-reply-content">'+datas.content+'</div>';
		}
		dataArray.push(content);
		dataArray.push('<div style="clear:both;"></div>');
		dataArray.push('</div>');
	}
	$('#messageReplyBox').html(dataArray.join(''));
}

/**
 * 停止播放语音
 * 
 * @param obj
 */
function stopAudioHdxx(obj) {
	$("#jquery_jplayer_hd").jPlayer("stop");
	$(obj).find("i").removeClass("voice_play");
	$(obj).attr("onclick", "playAudioHdxx(this)");
}

function generate_tzReply_table(tzid,serialnumber) {
	GHBB.prompt("正在加载~");
	var rownum = 1;
	App.datatables();
	var sAjaxSource = ctx + "/jyhd/tz/ajax_seeReply/" + tzid + "/"+serialnumber+"?name=";
	var aoColumns = [ {
			"sTitle" : "姓名",
			"sWidth" : "100px",
			"sClass" : "text-center",
			"mDataProp" : "sender_ch"
		}, {
			"sTitle" : "回复内容",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "content"
		}, {
			"sTitle" : "时间",
			"sWidth" : "100px",
			"sClass" : "text-center",
			"mDataProp" : "sendtime"
		}];
	$('#hdxx-datatable').dataTable({
		"aaSorting" : [ [ 1, 'desc' ] ],
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"iDisplayLength" : 10,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bSort" : false,
		"bAutoWidth" : false,
		"sAjaxSource" : sAjaxSource,
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			rownum = rownum + 1;
			return nRow;
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}

function seeTzyh(tzid,serialnumber) {
	currentTzid = tzid;
	$("#seeTzyhModel").modal("show");
	$("#xm").val("");
	generate_tzyh_table(tzid,serialnumber);
}

function generate_tzyh_table(tzid,serialnumber) {
	var rownum = 1;
	App.datatables();
	GHBB.prompt("正在加载~");
	var sAjaxSource = ctx + "/jyhd/tz/ajax_seeTzyh/" + tzid +"?serialnumber="+serialnumber+"&name="
			+ $("#xm").val();
	var aoColumns = [{
			"sTitle" : "姓名",
			"sWidth" : "100px",
			"sClass" : "text-center",
			"mDataProp" : "4"
		}, {
			"sTitle" : "阅读",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "2"
		}, {
			"sTitle" : "回复",
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "3"
		}];
	$('#tzyh-datatable').dataTable({
		"aaSorting" : [ [ 1, 'desc' ] ],
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"iDisplayLength" : 10,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bSort" : false,
		"bAutoWidth" : false,
		"sAjaxSource" : sAjaxSource,
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			if (aaData[2] == 1) {
				$('td:eq(1)', nRow).html('<div style="color:#00FF00;font-size:18px;">√</div>');
			} else {
				$('td:eq(1)', nRow).html('<div style="font-size:18px;">-</div>');
			}
			if (aaData[3] == 1) {
				$('td:eq(2)', nRow).html('<div style="color:#00FF00;font-size:18px;">√</div>');
			} else {
				$('td:eq(2)', nRow).html('<div style="font-size:18px;">-</div>');
			}
			rownum = rownum + 1;
			return nRow;
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}

function showAllReceiver(){
	if($("#tzForm_receiver").css("overflow") == "hidden" && $("#tzForm_receiver").html() != "请点击右侧勾选接收人！"){
		$("#tzForm_receiver").css("overflow","visible");
		$("#tzForm_receiver").css("white-space","normal");
		$("#tzForm_receiver").css("height","auto");
	}else{
		$("#tzForm_receiver").css("overflow","hidden");
		$("#tzForm_receiver").css("white-space","nowrap");
		$("#tzForm_receiver").css("height","34px");
	}
}

function changeMessageUrl(){
	var href = window.location.href;
	if(href.indexOf('&viewMessageId')>0){
		window.location.href = href.substring(0,href.indexOf('&viewMessageId'));
	}else{
//		isExitsFunction("createUnreadMessageBox") && createUnreadMessageBox();
	}
}

function queryCampus(){
	var param = {};
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_CAMPUS,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#campusList option").remove();// user为要绑定的select，先清除数据
			for (var i = 0; i < result.data.campusList.length; i++) {
				$("#campusList")
					.append("<option value=" + result.data.campusList[i].id + ">" + result.data.campusList[i].value + "</option>");
			}
			$("#campusList option").eq(0).attr("selected", true);
			$("#campusList").trigger("chosen:updated");
			queryLeaderMsgList();
		}
	});
}

function queryLeaderMsgList() {
	GHBB.prompt("正在加载~");
	App.datatables();
	var aoColumns = [{"sTitle": "发送人","mDataProp": "publisher","sClass": "text-center","sWidth":"200px"},
		            {"sTitle": "消息标题","mDataProp": "title"},
		            {"sTitle": "时间","mDataProp": "publishdate","sClass": "text-center","sWidth":"200px"},
		            {"sTitle": "状态","mDataProp": "content","sClass": "text-center","sWidth":"300px"}];
	$('#leader-datatable').dataTable({
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
			var param = {
				campusid: $("#campusList").val(),
				searchString : $("#searchString").val(),
				iDisplayStart: 0,
		        iDisplayLength: 10,
		        sEcho: 1
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.MESSAGE_QUERY_LIST_FOR_LEADER } );
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
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
        	$(nRow).addClass("td-message");
			var content = aaData.content;
			var photoList = "";
			if(aaData.contenttype == "1"){
				content = "[语音]";
			}else if(aaData.photoList != null && aaData.photoList.length > 0){
				content = "[图片]" + aaData.content;
				for ( var i = 0; i < aaData.photoList.length; i++) {
					photoList += aaData.photoList[i] + ",";
				}
				photoList = '<input type="hidden" id="photoList'+aaData.id+'" value="'+photoList.substring(0, photoList.length - 1)+'" />';
			}
			var title = '<a href="javascript:seeDetail('+aaData.id+',\'send\',\''+aaData.serialnumber+'\',\''+aaData.contenttype+'\');"><span style="color:rgb(30, 30, 30);">'+aaData.title+'</span> <span style="color:rgb(153, 153, 153)">'+content+'</span></a>';
			$('td:eq(1)', nRow).html(title);
 			if(aaData.state == 1){
 				var detailHtml='<div style="text-align:center;">待发布</div>';
 	 			$('td:eq(3)', nRow).html(detailHtml);
 			}else{
 				var detailHtml='<div style="text-align:center;"><a href="javascript:seeTzyh('+aaData.id+',\''+aaData.serialnumber+'\')">发送'+aaData.receiveCount+'人，阅读'+aaData.readCount+'人，回复'+aaData.replaynum+'人</a></div>';
 	 			$('td:eq(3)', nRow).html(detailHtml);
 			}
			
			
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}


function showMsgList(){
	if($("#individualList").parent().hasClass("hide")){
		alert("请先添加个性化内容！");
		return;
	}
	$('#msgList-datatable_wrapper').remove();
	$("#msgList-datatable-div").prepend('<table id="msgList-datatable" class="table table-vcenter table-condensed table-bordered"><thead><tr><th class="text-center">接收人</th><th class="text-center">消息内容</th></tr></thead><tbody></tbody></table>');
    var ids = receiverIds.split(",");
    var names = receiverNames.split(";");
    if(ids.length != names.length){
    	alert("接收人数据有误！");
    	return;
    }
    var tr = "";
    var contentList = $("#individualList").find("input[name='content']");
    for ( var i = 0; i < ids.length; i++) {
    	var name = names[i];
    	var content = contentList.eq(i).val();
    	if(content == undefined || content == null){
    		content = "";
    	}
    	var contentAll = $("#tzForm_content").val() + '<span style="color:red;">'+content+'</span>';
    	if($("input[name='position']:checked").val() == "1"){
    		contentAll = '<span style="color:red;">'+content+'</span>' + $("#tzForm_content").val();
    	}
    	tr += '<tr>'
	       +  '   <td class="text-center" style="width:120px;">'+name+'</td>'
	       +  '   <td class="text-center" style="word-break:break-all;">'+contentAll+'</td>'
	       +  '</tr>';
	}
	$("#msgList-datatable").find("tbody").html(tr);
    /* Initialize Datatables */
    $('#msgList-datatable').dataTable({
    	"aaSorting" : [ [ 1, 'desc' ] ],
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"iDisplayLength" : 10,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bSort" : false,
		"bAutoWidth" : false
    });
	$("#msgList").modal("show");
}

function checkChildren(obj){
	$(obj).parent().find("input[type='radio']").removeAttr("checked");
	$(obj).find("input[type='radio']").prop("checked",true);
}

/**
 * 查询教室列表
 * @param usertype
 * @param current_stuid
 */
function findMessageLevelList(){	
	var submitData={};
	submitData.type="MESSAGE_LEVEL";
	var resutl = CalApiUtil.callSecurityApi('dict_list',submitData);
	createMessageLevelList(resutl);
	
}

function createMessageLevelList(datalist){
	if(datalist != null){
		
		$("#msglevel-list option").remove();//user为要绑定的select，先清除数据   
        for(var i=0;i<datalist.length;i++){
        	$("#msglevel-list").append("<option value=" + datalist[i].key+" >"
        			+ datalist[i].value + "</option>");
        };
        //$("#msglevel-listt").find("option[value='"+$("#classroomid1").val()+"']").attr("selected",'selected');
        $("#msglevel-list").trigger("chosen:updated");
        
	}
}

