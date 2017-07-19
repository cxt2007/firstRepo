var ctx=$("#ctx").val();
var campusid = $("#campusid").val();
var commonUrl_loadingData = $("#commonUrl_loadingData").val();
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
	generate_table();
	
	$("#search_EQ_state").change(function() {
		generate_table();
	});
	$("#search-btn").click(function() {
		generate_table();
	});
});

function generate_table(){
	 var rownum = 1;
	 App.datatables();
	 GHBB.prompt("正在加载~");
     var sAjaxSource=ctx+"/yqdt/lyjy/ajax_query_lyjy";
     var param = "campusid="+$("#campusid-chosen").val();
     param = param + "&startrq=" + getBeginTime($("#startrq").val());
     param = param + "&endrq=" + getEndTime($("#endrq").val());
     param = param + "&state=" + $("#search_EQ_state").val();
     param = param + "&content=" + $("#content").val();
 	 sAjaxSource = sAjaxSource + "?" + param;
 	 var aoColumns = [ {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	 }, {
		"sWidth" : "150px",
		"mDataProp" : "userid_ch"
	 }, {
		"sWidth" : "150px",
		"mDataProp" : "bbxms"
	 }, {
		"sWidth" : "250px",
		"mDataProp" : "content"
	 }, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "lysj"
	 }, {
		"sWidth" : "100px",
		"sClass" : "text-center",
		"mDataProp" : "state"
	 }, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "id"
	 } ];
 	 
 	 
	 $('#lyjy-datatable')
			.dataTable(
					{
						"aaSorting" : [ [ 3, 'desc' ] ],
						"iDisplayLength" : 50,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"bSort" : false,
						"sAjaxSource" : sAjaxSource,
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							// 序号
							$('td:eq(0)', nRow).html(rownum);
							// 是否已回复
							var isreply = "";
							if(aaData.state == 1){
								isreply = "<span style='color:red;'>未回复</span>";
							} else if(aaData.state == 2){
								isreply = "已回复";
							}
							$('td:eq(5)', nRow).html(isreply);
							
							// 操作
							var html = '<div class="btn-group btn-group-xs">'
								+'<a href="javascript:findReply(\''+aaData.id+'\',\''+aaData.content+'\',\''+aaData.lysj+'\',\''+aaData.fromusername+'\',\''+aaData.serialnumber+'\',\''+aaData.userid_ch+'\');"  data-toggle="tooltip">查看回复</a>&nbsp;&nbsp;'
								//+'<a href="javascript:toReply(\''+aaData.id+'\',\''+aaData.title+'\');"  data-toggle="tooltip">回复</a>&nbsp;&nbsp;'
 								+'<a href="javascript:deleteConform(\''+aaData.id+'\');"  data-toggle="tooltip">删除</a>'
 								+ '</div>';
							$('td:eq(6)', nRow).html(html);
							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns,
						"fnInitComplete": function(oSettings, json) {
							GHBB.hide();
					    }
					});
     
	 $("#set-btn").click(function(){
		 var param = {campusid:$("#campusid-chosen").val()}
	     var submitData = {
			api : ApiParamUtil.MAIL_INTRODUCTORY_INFO,
			param : JSON.stringify(param)
	 	 };
		 $.post(commonUrl_ajax,submitData,function(data){
			 var datas = typeof data == "object" ? data : JSON.parse(data);
			 $("#setremail").html(datas.data.mailintroductory);
		 });
			$('#modal-addconfig').modal('show');
	});
	 $("#saveSubmit").click(function (){
		 saveMailCotents(); 
	 });
}

function getBeginTime(startrq)
{
	return startrq+" 00:00:00";
}

function getEndTime(endrq)
{
	return endrq + " 23:59:59";
}

function findReply(id,content,user_date,fromusername,serialnumber,user_ch){
	$("#reModel").modal("show");
	
	initReModelData(id,content,user_date,fromusername,serialnumber,user_ch);

	var rownum=1;
	App.datatables();
    /* Initialize Datatables */
	var sAjaxSource=ctx+"/yqdt/lyjy/ajax_findReplyById/"+id+"/"+serialnumber;
    var aoColumns= [
    	            {"sWidth": "150px", "sClass": "text-left", "mDataProp": "id"}
    	       ];
    $('#reply-datatable').dataTable({
    	"aaSorting":[ [1,'desc']],
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "iDisplayLength": 5,
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "bSort":false,
        "bInfo": false,//页脚信息
        "bAutoWidth":false,
        "sAjaxSource": sAjaxSource,
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
        	var replyBox = '<div id=ly'+ aaData.id +' style="width:100%;height:auto;text-align:left;margin:0 auto;">' +
								'<span style="float:left;line-height:20px;"><a style="color:blue">'+ isNullOrEmpty(aaData.sender_ch)
								+'回复'+ isNullOrEmpty(aaData.receive_ch) +'</a>：'+ createReplyBox(aaData); +'</span><br/>' +
		        			'</div>';
//        	var replyBox = createReplyBox(aaData);
     		$('td:eq(0)', nRow).html(replyBox);
			rownum=rownum+1;
			return nRow;
		}, 
        "aoColumns":aoColumns
    });
    
}

function createReplyBox(datas){
	var replyBox = new Array();
	if(datas.contenttype == "1"){
		replyBox.push('<div class="textbox">');
		replyBox.push('<span class="sj"></span>');
		replyBox.push('<span class="text voicetext" onclick="playAudioHdxx(this);" voiceid="'+datas.id+'" style="min-width:20%;width:'+widthByDuration(parseInt(datas.duration))+'%;">') ;
		replyBox.push('<i class="voice_play_icon"></i>') ;
		replyBox.push('</span>') ;
		replyBox.push('</span>') ;
		replyBox.push('<input id="audiourl_'+datas.id+'" type="hidden" value="'+datas.content+'">') ;
		replyBox.push('<span class="tips">'+datas.duration+'"</span>') ;
		if(datas.isread==0){
			replyBox.push('<span class="state"></span>') ;
		}
		replyBox.push('</div>');
	}else if(datas.fileList != null && datas.fileList.length > 0){
		var photo = "";
		for ( var i = 0; i < datas.fileList.length; i++) {
			photo += '<div class="content-img"><img alt="" src="'+datas.fileList[i]+'" /></div>';
		}
		replyBox.push('<div class="message-reply-content">'+datas.content+'</div>' +photo);
	}else{
		replyBox.push('<div class="message-reply-content">'+datas.content+'</div>');
	}
	return replyBox.join('');
}

function toReply(){
	var reContent = $("#reply_content").val();
	if(reContent == ""){
		alert("请填写回复信息！");
		return;
	}
	var url = ctx + "/yqdt/lyjy/ajax_toReply";
	var submitData = {
		id : $("#lyjy_id").val(),
		content:reContent,
		fromusername:$("#lyjy_fromusername").val(),
		serialnumber:$("#lyjy_serialnumber").val(),
		parentid:$("#lyjy_parentid").val()
	};
	$.post(url, submitData, function(data) {
		if (data == "success") {
			alert("回复成功!");
			$("#reModel").modal("hide");
			generate_table();
		} else {
			alert(data);
		}
		return false;
	});
}

function deleteConform(id){
	if (confirm("确认删除?\n注：删除该信息会删除该信息下所有回复信息！")) {
		var url = ctx + "/yqdt/lyjy/ajax_delLyjy";
		var submitData = {
			id : id
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				alert("删除成功!");
				generate_table();
			} else {
				alert(data);
			}
			return false;
		});
	}
}

function initReModelData(id,content,user_date,fromusername,serialnumber,user_ch){
	$("#lyjy_content").html(content);
	$("#lyjy_date").html( user_ch+"&nbsp;&nbsp;&nbsp;"+user_date);
	$("#lyjy_id").val(id);
	$("#lyjy_fromusername").val(fromusername);
	$("#reply_content").val('');
	$("#lyjy_serialnumber").val(serialnumber);
}

function isNullOrEmpty(value){
	if(value==null || value==undefined || value=="null" || value=="undefined"){
		return "";
	}
	return value;
}

function saveMailCotents(){
	GHBB.prompt("数据保存中~");
	 var mailintroductory = $("#setremail").val();
	 var param = {mailintroductory:mailintroductory,campusid:$("#campusid-chosen").val()}
     var submitData = {
		api : ApiParamUtil.MAIL_INTRODUCTORY_SAVE,
		param : JSON.stringify(param)
 	 };
	 $.post(commonUrl_ajax,submitData,function(data){
		 GHBB.hide();
		 var datas = eval("("+data+")");
		 $("textarea").html(datas.data.mailintroductory);
	 });
	 $('#modal-addconfig').modal('hide');
} 
//function expectFile(){	
//	var url=ctx + "/yqdt/lyjy/expectFile";
//	
//	var submitData = {
//			content: $("#content").val(),
//			startrq: $("#startrq").val(),
//			endrq: $("#endrq").val(),
//			campusid: $("#school-chosen").val(),
//			bjid: $("#bj-chosen").val(),
//			qjlx: $("#qjlx").val()
//	}; 
//	$.post(url,
//		submitData,
//      	function(data){
//			location.href=ctx + data;
//    });
//}


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