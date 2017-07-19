/**
 * 在线资源
 */
var ctx=$("#ctx").val();
var editor;
var slaveuser = $("#slaveuser").val();
var COMMON_WX_PUSH = $("#COMMON_WX_PUSH").val();
var MY_CLASS_CLASSROOM_QUERY_COMMENT_LIST_FOR_PC = $("#MY_CLASS_CLASSROOM_QUERY_COMMENT_LIST_FOR_PC").val();
var MY_CLASS_CLASSROOM_COMMENT_SELECT = $("#MY_CLASS_CLASSROOM_COMMENT_SELECT").val();
var commonUrl_ajax = $("#commonUrl_ajax").val();
var ifpreview = 0;
var intervalTimer;
var commentReplyPage = 0;

var ifautosave = false;

$(document).ready(function() {
	generate_table();
	$("#wlzyQueryBtn").click(function() {
		generate_table();
	});
	
	$("#replyNextPage").click(function(){
		changeReplyPage(1);
	});
	$("#replyPreviousPage").click(function(){
		changeReplyPage(2);
	});
	
	$("#btnAuth_span_reply").click(function(){
		replyMessage();
	});

	$("#wlzyAddBtn").click(function() {
		$('#addOrEdit').html("新增");
		
		$('#addwlzy-form')[0].reset();
		$('#id').val('');
		$('#state').val('1');
		$('#klxx-count').val('0');
		$("#bj-chosen-add-value").val("0");
		$('#ifpush').val('0');
		$('#school-chosen-add option').eq(0).attr("selected",true);
		$('#school-chosen-add').trigger("chosen:updated");
		$('#school-chosen-add').change();

		if($("#xxtype").val()!=3 && $("#wlzytype")!=8 && $("#wlzytype")!=10){
			$('#lable-tags option').eq(0).attr("selected",true);
			$('#lable-tags option').eq(1).attr("selected",true);
			$('#lable-tags').trigger("chosen:updated");
			query_add_courseList();
		}		
		editor.html('');
		$('#modal-addwlzy').modal('show');
	});
	
	$("#ifSelected").click(function(){
		changeCheckBoxValue();
	});
	
	$("#sendSubmit").click(function() {
		validateForm(2);
		
	});
	$("#saveSubmit").click(function() {
		validateForm(1);
	});
	$("#preview").click(function() {
		validateForm(3);
	});
	
	$("#wlzy-camups-chosen").change(function() {
//		query_courseList();
		getSerchFormBjsjList();
	});
	
	$("#wlzy-period-chosen").change(function() {
		generate_table();
	});
	
	$("#wlzy-bjid-chosen").change(function() {
		generate_table();
	});
	
	$("#wlzy-state-chosen").change(function() {
		generate_table();
	});
	
	$("#school-chosen-add").change(function() {
		getBjsjByCampusid();
	});
	
	$("#monthTime").change(function() {
		generate_table();
	});
	
	
});

var state = 0;

function validateForm(_state){
	state = _state;
	if(state == 3 && (slaveuser == null || slaveuser == "")){
		PromptBox.alert("您登录的账号未绑定无法预览，请通过手机端进行绑定");
		return;
	}
	if($("#wlzytype").val()!=10){
		if($('#bj-chosen-add').val()===null || $('#bj-chosen-add').val()===''){
			PromptBox.alert('班级必填！');
			return;
		}
	}
	
	if($("#wlzytype").val()!=10 && $("#wlzytype").val()!=8 && $("#xxtype").val()!=3 && $("#wlzytype").val()!=1){
		if($('#courseAddList').val()===null || $("#courseAddList").val()===''){
			PromptBox.alert('课程必填！');
			return;
		}
	}
	
	if($("#title").val() == null || $("#title").val() == ""){
		PromptBox.alert('标题必填！');
		return;
	}
	if($("#publishdate").val() == null || $("#publishdate").val() == ""){
		PromptBox.alert('请选择发布时间！');
		return;
	}
	if($("#wlzytype").val()==10){
		if($("#deadline").val() == null || $("#deadline").val() == ""){
			PromptBox.alert('请选择截止时间！');
			return;
		}
		if($("#period").val() == null || $("#period").val() == ""){
			PromptBox.alert('请填写期次！');
			return;
		}
		var re = /^[0-9]*[1-9][0-9]*$/;
		if(!re.test($("#period").val())){
			PromptBox.alert('期次应为正整数！');
			return;
		}
	}
	if($("#content").val() == null || $("#content").val() == ""){
		PromptBox.alert('内容必填！');
		return;
	}
	if(confirm("是否确定继续操作?")){
		clearInterval(intervalTimer);
		GHBB.prompt("数据保存中~");
		var url=ctx+"/resource/ajax_save?appid="+$("#appid").val();
		
		var submitData = {
			id			: $("#id").val(),
			publisher	: $("#publisher").val(),
			publishdate	: $("#publishdate").val(),
			deadline	: $("#deadline").val(),
			period		: $("#period").val(),
			publisherid	: $("#publisherid").val(),
			title		: $("#title").val(),
			campusid	: $("#school-chosen-add").val(),
			content		: $("#content").val(),
			wlzytype	: $("#wlzytype").val(),		//资源类型： 1：课堂动态；8：中科院主题活动
			state		: state,
			bjid		: $("#bj-chosen-add").val(),
			bjid_ch		: $("#bj-chosen-add").find("option:selected").text(),
			count		:$('#klxx-count').val(),
			ifpush		:$('#ifpush').val()
		};
		if($("#wlzytype").val()!=8 && $("#xxtype").val()!=3){
			submitData.courseid=$("#courseAddList").val();
			var labletags=$("#lable-tags").val();
			if(labletags!="" && labletags!=null){
				labletags=$("#lable-tags").val().toString();
			}
			submitData.label=labletags;
		}
		if(state==1){
			$('#saveSubmit').attr('disabled','disabled');
		}else if(state==3){
			$('#preview').attr('disabled','disabled');
		}else{
			$('#sendSubmit').attr('disabled','disabled');
		}
		$.post(url,
			submitData,
	      	function(data){
				var datas = eval("(" + data + ")");
			
				if(!isNaN(parseInt(datas.id))){
					$("#id").val(datas.id);
				}
				
				$("#publisher").val(datas.publisher);
				//$("#publishdate").val(datas.publishdate);
				$("#publisherid").val(datas.publisherid);
				
				if(state==1){
					$('#saveSubmit').removeAttr('disabled');
				}else if(state==3){
					$('#preview').removeAttr('disabled');
				}else{
					$('#sendSubmit').removeAttr('disabled');
				}
				GHBB.hide();
				if(state != "3"){
					$('#modal-addwlzy').modal('hide');
				}else{
					ifpreview = 1;
					pushWx($("#id").val());
				}
				generate_table();
	      });
	}
}

function refreshAndClear(){
	generate_table();
	clearInterval(intervalTimer);
}

function automaticSave(){
	var title = $("#title").val();
	if($('#bj-chosen-add').val()===null || $('#bj-chosen-add').val()===''){
		return;
	}
	if($("#wlzytype").val()!=8 && $("#xxtype").val()!=3 && $("#wlzytype").val()!=1){
		if($('#courseAddList').val()===null || $("#courseAddList").val()===''){
			return;
		}
	}
	
	if(title == null || title == ""){
		title = "未命名";
	}
	if($("#publishdate").val() == null || $("#publishdate").val() == ""){
		return;
	}
	if($("#content").val() == null || $("#content").val() == ""){
		return;
	}
	var url=ctx+"/resource/ajax_save?appid="+$("#appid").val();
	
	var submitData = {
		id			: $("#id").val(),
		publisher	: $("#publisher").val(),
		publishdate	: $("#publishdate").val(),
		publisherid	: $("#publisherid").val(),
		title		: title,
		deadline	: $("#deadline").val(),
		period		: $("#period").val(),
		campusid	: $("#school-chosen-add").val(),
		content		: $("#content").val(),
		wlzytype	: $("#wlzytype").val(),		//资源类型： 1：课堂动态；8：中科院主题活动
		state		: $("#state").val(),
		bjid		: $("#bj-chosen-add").val(),
		bjid_ch		: $("#bj-chosen-add").find("option:selected").text(),
		count		:$('#klxx-count').val(),
		ifpush		:$('#ifpush').val()
	};
	if($("#wlzytype").val()!=8 && $("#xxtype").val()!=3){
		submitData.courseid=$("#courseAddList").val();
		var labletags=$("#lable-tags").val();
		if(labletags!="" && labletags!=null){
			labletags=$("#lable-tags").val().toString();
		}
		submitData.label=labletags;
	}
	$.post(url,
		submitData,
      	function(data){
			var datas = eval("(" + data + ")");
			if(!isNaN(parseInt(datas.id))){
				$("#id").val(datas.id);
			}else{
				clearInterval(intervalTimer);
			}
			$("#publisher").val(datas.publisher);
			$("#publisherid").val(datas.publisherid);
			$("#saveTips").css("display","block");
			setTimeout(function(){$("#saveTips").css("display","none");},2000);
			if(!ifautosave){
				clearInterval(intervalTimer);
			}
      });
}

function getSerchFormBjsjList(){
	var url=ctx+"/base/findBjsjByCampusid";
	var submitData = {
		campusid: $("#wlzy-camups-chosen").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#wlzy-bjid-chosen option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	
	        	$("#wlzy-bjid-chosen").append("<option value=" + datas[i][0]+" >"
	        			+ datas[i][1] + "</option>");
	        };
	        $("#wlzy-bjid-chosen").find("option[index='0']").attr("selected",'selected');
	        $("#wlzy-bjid-chosen").trigger("chosen:updated");
			generate_table();
    });
}	

function getBjsjByCampusid(){
	var url=ctx+"/xtgl/bjsj/findBjsjByCampusId";
	var submitData = {
		search_LIKE_campusid: $("#school-chosen-add").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#bj-chosen-add option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	$("#bj-chosen-add").append("<option value=" + datas[i].id+" >"
	        			+ datas[i].bj + "</option>");
	        };
	        $("#bj-chosen-add").find("option[value='"+$("#bj-chosen-add-value").val()+"']").attr("selected",'selected');
	        $("#bj-chosen-add").trigger("chosen:updated");
    });
}	

KindEditor.ready(function(K) {
	var folder="wlzy";
	editor = K.create('textarea[name="content"]', {
		cssPath : ctx+'/static/kindeditor/plugins/code/prettify.css',
		uploadJson : ctx+'/filehandel/kindEditorUpload/'+folder+'/image?campusid='+ $("#wlzy-camups-chosen").val().toString(),
		fileManagerJson : ctx+'/filehandel/kindEditorFileManager',
		allowFileManager : true,
		afterCreate : function() {
			var self = this;
			K.ctrl(document, 13, function() {
				self.sync();
				document.forms['addwlzy-form'].submit();
			});
			K.ctrl(self.edit.doc, 13, function() {
				self.sync();
				document.forms['addwlzy-form'].submit();
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
			intervalTimer = setInterval(alaws,30000);
		},
		afterBlur: function(){
			this.sync();
			ifautosave = false;
		}
	});
});

function toEdit(num){

	$('#addOrEdit').html("修改");
	query_add_courseList();
	var url=ctx+"/resource/ajax_update";
	var submitData = {
			id	: num
	}; 
	$.post(url,
		submitData,
     	function(data){
		var datas = eval("(" + data + ")");
		$('#id').val(datas.id);
		$('#state').val(datas.state);
		$('#ifpush').val(datas.ifpush);
		$('#publisher').val(datas.publisher);
		$('#publishdate').val(datas.publishdate);
		$('#publisherid').val(datas.publisherid);
		$('#title').val(datas.title);
		$('#period').val(datas.period);
		$("#bj-chosen-add-value").val(datas.bjid);
		$('#school-chosen-add option').removeAttr("selected");
		$('#school-chosen-add').find("option[value='"+datas.campusid+"']").attr("selected",true);
		$('#school-chosen-add').trigger("chosen:updated");		
		$('#school-chosen-add').change();
		

		if($("#xxtype").val()!=3 && $("#wlzytype").val()!=8){
			$('#courseAddList').find("option[value='"+datas.courseid+"']").attr("selected",true);
			$('#courseAddList').trigger("chosen:updated");
			
			if(datas.label=="" || datas.label==null || datas.label=="undefined"){
				$('#lable-tags option').eq(0).attr("selected",false);
				$('#lable-tags option').eq(1).attr("selected",false);
			}else{
				var tags = (datas.label).split(",");
				for(var i=0;i<tags.length;i++){
					$('#lable-tags').find("option[value='"+tags[i]+"']").attr("selected",true);
				}
			}
			$('#lable-tags').trigger("chosen:updated");
		}		
		
		editor.html(datas.content);
		$('#content').val(datas.content);
		$('#klxx-count').val(datas.count);
		$('#modal-addwlzy').modal('show');
   		return false;
    });
}

function delConfirm(id){
	if(confirm("确认删除?")){
		GHBB.prompt("数据保存中~");
		var url=ctx+"/resource/ajax_del";
		var submitData = {
				id	: id
		}; 
		$.post(url,
			submitData,
	      	function(data){
			GHBB.hide();
			alert("删除成功!");
				generate_table();				
	    		return false;
	      });
	}
}

function generate_table() {
	App.datatables();
	GHBB.prompt("正在加载~");
	var aoColumns = makeTableTile($("#xxtype").val());
	$('#klxx-datatable').dataTable({
		"aaSorting":[ [3,'desc']],
		"iDisplayLength" : 50,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort":false,
		"sAjaxSource" : commonUrl_ajax,
		//"sAjaxDataProp":'dataLsit',
		"bServerSide" : true,// false为前端分页
		"fnServerParams": function (aoData) {
			var param = {
				campusid: $("#wlzy-camups-chosen").val(),
				bjid:  $("#wlzy-bjid-chosen").val(),
				state: $("#wlzy-state-chosen").val(),
				title: $("#wlzy-title").val(),
				period: $("#wlzy-period-chosen").val(),
				monthTime: $("#monthTime").val(),
				wlzytype:$("#wlzytype").val(),
				iDisplayStart: 0,
		        iDisplayLength: 10,
		        sEcho: 1
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.CLASSROOM_LIST_QUERY } );
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
		//"aaSorting" : [[ 0, "asc" ], [ 5, "desc" ], [ 8, "desc" ]],
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			var editHtml = '<a href="javascript:void(0);" onclick="showCommentBox(\''+aaData.id+'\');">评论'+aaData.commentCount+' 精选'+aaData.commentSelectCount+'</a>';
        	if($("#xxtype").val()==3 || $("#wlzytype").val()==8){
        		$('td:eq(5)', nRow).html(editHtml);
        		var ifpush = "未推送";
        		if(aaData.ifpush == "1"){
        			ifpush = "已推送";
        		}
        		$('td:eq(4)', nRow).html(ifpush);
        		if(aaData.state == "2" && aaData.publishdate!=null){
        			$('td:eq(3)', nRow).html(aaData.publishdate.substring(0,10));
        		}
        	} else if($("#wlzytype").val()==10){
        		$('td:eq(3)', nRow).html(aaData.deadline);
        		$('td:eq(4)', nRow).html(aaData.votes);
        	} else {
        		$('td:eq(6)', nRow).html(editHtml);
        		var ifpush = "未推送";
        		if(aaData.ifpush == "1"){
        			ifpush = "已推送";
        		}
        		$('td:eq(5)', nRow).html(ifpush);
        		if(aaData.state == "2" && aaData.publishdate!=null){
        			$('td:eq(4)', nRow).html(aaData.publishdate.substring(0,10));
        		}
        	}
		},
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});
}

function makeTableTile(xxtype){
	var columns;
	if(xxtype==3 || $("#wlzytype").val()==8){
		columns = [
			        {"sTitle": "标题","mDataProp": "title","sClass": "text-center"},
		            {"sTitle": "班级","mDataProp": "bjid_ch","sClass": "text-center"},
		            {"sTitle": "发布人","mDataProp": "publisher","sClass": "text-center"},
		            {"sTitle": "发布日期","mDataProp": "publishdate","sClass": "text-center"},
		            {"sTitle": "是否推送","mDataProp": "ifpush","sClass": "text-center"},
		            {"sTitle": "评论","mDataProp": "publishdate","sClass": "text-center"},
		        	{"sTitle": "管理","mDataProp": "operation","sClass": "text-center"}
		       ];
	} else if($("#wlzytype").val()==10){
		columns = [
			        {"sTitle": "标题","mDataProp": "title","sClass": "text-center"},
		            {"sTitle": "发布人","mDataProp": "publisher","sClass": "text-center"},
		            {"sTitle": "发布日期","mDataProp": "publishdate","sClass": "text-center"},
		            {"sTitle": "截止日期","mDataProp": "deadline","sClass": "text-center"},
		            {"sTitle": "票数","mDataProp": "votes","sClass": "text-center"},
		        	{"sTitle": "管理","mDataProp": "operation","sClass": "text-center"}
		       ];
	} else {
		columns = [
			        {"sTitle": "标题","mDataProp": "title","sClass": "text-center"},
		            {"sTitle": "班级","mDataProp": "bjid_ch","sClass": "text-center"},
		            {"sTitle": "课程","mDataProp": "coursename","sClass": "text-center"},
		            {"sTitle": "发布人","mDataProp": "publisher","sClass": "text-center"},
		            {"sTitle": "发布日期","mDataProp": "publishdate","sClass": "text-center"},
		            {"sTitle": "是否推送","mDataProp": "ifpush","sClass": "text-center"},
		            {"sTitle": "评论","mDataProp": "publishdate","sClass": "text-center"},
		        	{"sTitle": "管理","mDataProp": "operation","sClass": "text-center"}
		       ];
	}
	return columns;
}

function showCommentBox(dataid){
	$("#dataid").val(dataid);
	$('#modal-comment-select').modal('show');
	generate_table_comment();
}

function closeCommentBox(){
	$("#dataid").val("");
	$("#modal-comment-select").modal('hide');
	generate_table();
}

function generate_table_comment(){
	GHBB.prompt("正在加载~");
	var aoColumns = [ {
		"sTitle" : "精选评论",
		"mDataProp" : "id",
		"sClass" : "text-center"
	},{
		"sTitle" : "评论人",
		"mDataProp" : "publisher",
		"sClass" : "text-center"
	},{
		"sTitle" : "评论时间",
		"mDataProp" : "commentTime",
		"sClass" : "text-center"
	},{
		"sTitle" : "内容",
		"mDataProp" : "content",
		"sClass" : "text-center",
		"sWidth" : "400px"
	} ];
    
    
    $('#klxx-comment-datatable').dataTable({
    	"aaSorting":[ [3,'desc']],
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "bAutoWidth":false,
        "bSort":false,
        "sAjaxSource": commonUrl_ajax,
        "bServerSide":true,//服务器端必须设置为true
        "fnServerParams": function (aoData) {
			var param = {
				campusid : $("#wlzy-camups-chosen").val(),
				dataid : $("#dataid").val(),
				selectedState : $("#ifSelected").val(),
				"iDisplayStart" : 0,
		        "iDisplayLength": 10,
		        "sEcho" : 1
				
			};
			aoData.push( { "name": "api", "value": MY_CLASS_CLASSROOM_QUERY_COMMENT_LIST_FOR_PC } );
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
                		alert(json.ret.msg);
                	}
				}             
            } );
        },
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
        	var checked = aaData.isSelected == "1" ? "checked" : "";
        	var state='<label class="switch switch-primary"><input type="checkbox" '+checked+' onclick="selectComment(\''+aaData.serialnumber+'\',this);"><span></span></label>';
        	$('td:eq(0)',nRow).html(state);
        	var span = '<a title="'+aaData.content+'" style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;cursor: pointer;" '
        			 + 'onclick="showCommentReply(\''+aaData.publisherid+'\',\''+aaData.publishdate+'\',\''+aaData.publisher+'\',\''+aaData.serialnumber+'\',this);">'+aaData.content+'</a>';
        	$('td:eq(3)',nRow).html(span);
		}, 
        "aoColumns":aoColumns,
        "fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
    });
}

function showCommentReply(publisherid,publishdate,publisher,serialnumber,obj){
	$("#c_publisher").html(publisher);
	$("#c_publishdate").html(publishdate);
	$("#c_content").html($(obj).html());
	$("#c_serialnumber").val(serialnumber);
	$("#c_receiveid").val(publisherid);
	$("#c_receiver").val(publisher);
	commentReplyPage = 0;
	$('#messageReplyBox').html('');
	$('.messageReplyFooter').hide();
	$('#replyContent').val('');
	getReplyList();
	$("#modal-comment-reply").modal('show');
}

function getReplyList(){
	var pageLength = 2;
	var pageStart = commentReplyPage * pageLength;
	var submitData = {
		api : ApiParamUtil.DAILY_MANAGE_MZCP_COMMENT_RECEIVE_LIST,
		param : JSON.stringify({
			serialnumber: $("#c_serialnumber").val(),
			pageStart:pageStart,
			pageLength:pageLength
		})
	};
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code == 200) {
				createLeaveReplyContent(result.data.dataList);
				if(result.data.pageTotal>2)
					$('.messageReplyFooter').show();
				if(commentReplyPage==0){
					$('#replyPreviousPage').attr("disabled","");
				}else{
					$('#replyPreviousPage').removeAttr("disabled");
				}
				if(commentReplyPage+1 >= Math.ceil(result.data.pageTotal/pageLength)){
					$('#replyNextPage').attr("disabled","");
				}else{
					$('#replyNextPage').removeAttr("disabled");
				}
			} else {
				PromptBox.alert(result.ret.msg);
			}
			$("#modal-comment-reply").modal('show');
		}
	});
}

function createLeaveReplyContent(dataList){
	var dataArray = new Array();
	for(var i=0;i<dataList.length;i++){
		dataArray.push('<div class="message-reply-box">');
		dataArray.push('<div>');
		dataArray.push('<span class="name">'+dataList[i].publisher+'</span>');
		dataArray.push('<span class="time">'+dataList[i].publishdate+'</span>');
//		if(type==="send" && $(".nav-tabs[data-toggle='tabs']").find(".active").attr("id") != "leader-tab-page")
//			dataArray.push('<button class="btn btn-sm btn-default send-reply" onclick="sendReplyMessage('+dataList[i].senderid+',\''+dataList[i].name+'\');">回复</button>');
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
 * 
 * @param type 1下一页 2上一页
 */
function changeReplyPage(type){
	if(type===1){
		commentReplyPage++;
	}else{
		commentReplyPage--;
	}
	getReplyList();
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
			api:ApiParamUtil.MY_CLASS_CLASSROOM_SAVE_COMMENT_INFO,
			param:JSON.stringify({
				dataid:$('#dataid').val(),
				parentid:$('#c_serialnumber').val(),
				content:replyContent,
				receiveid:$('#c_receiveid').val(),
				receiver:$('#c_receiver').val(),
				usertype:1,
				userid:main_userid,
				orgcode:main_orgcode,
				campusid:$("#wlzy-camups-chosen").val()
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			PromptBox.alert('回复成功！');
			getReplyList();
			$('#replyContent').val('');
		}
	});
}

function selectComment(serialnumber,obj){
	var param = {
		campusid : $("#wlzy-camups-chosen").val(),
		serialnumber : serialnumber
	};
	var submitData = {
		api : MY_CLASS_CLASSROOM_COMMENT_SELECT,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			if(result.ret.msg == "1"){
				$(obj).attr("checked",true);
			}else if(result.ret.msg == "0"){
				$(obj).attr("checked",false);
			}else{
				alert("设置精选评论失败！");
			}
		}
	});
}

function previewInThePhone(id){
	var campusid = $("#wlzy-camups-chosen").val();
	var orgcode = $("#orgcode").val();
	var userid = $("#userid").val();
	var url = ctx+"/mobile/loading_page?orgcode="+orgcode+"&campusid="+campusid+"&appid=2071031&datatype="+$("#wlzytype").val()+"&dataid="+id+"&preview=1&userid="+userid;
	window.open (url,'newwindow','height=580,width=360,top=20,left=330,scrollbars=yes,location=no');
}

function pushWx(id){
	if(ifpreview==1){
		//预览
		sendMsgToWx(id);
	}else{
		if(confirm("确认推送给该班级老师和家长?")) {
			sendMsgToWx(id);
		}
	}
	
}
/**
 * 推送消息，课堂动态1、中科院主题活动8
 * @param id
 */
function sendMsgToWx(id){
	var campusid = $("#wlzy-camups-chosen").val();
	var param = {
		id 	: id,
		type : $("#wlzytype").val(),
		campusid : campusid,
		ifpreview : ifpreview,
		datatype:$("#wlzytype").val()
	};
	var submitData = {
		api : ApiParamUtil.COMMON_WX_PUSH,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		ifpreview = 0;
		if(result.ret.code == 200){
			generate_table();
			alert("消息推送成功！");
		}else{
			alert("消息推送失败！");
		}
	});
}

function changeCheckBoxValue(){
	$("#ifSelected").val($("#ifSelected").is(':checked') ? "1" : "0,1");
	generate_table_comment();
}

//function query_courseList(){
//	var param = {
//		campusid : $("#wlzy-camups-chosen").val(),
//		userid : main_userid
//	};
//	var submitData = {
//		api : ApiParamUtil.SYS_MANAGE_SCHOOL_COURSE_LIST,
//		param : JSON.stringify(param)
//	}
//	$.ajax({
//		cache:false,
//		type: "POST",
//		async:false,
//		url: ctx + ApiParamUtil.COMMON_URL_AJAX,
//		data: submitData,
//		success: function(json){
//			var result = typeof json == "object" ? json : JSON.parse(json);
//			if(result.ret.code == 200){
//				$("#courseList option").remove();
//				var allCourse = "";
//				for (var i = 0; i < result.data.courseList.length; i++) {
//					if(i == 0){
//						allCourse += result.data.courseList[i].courseid;
//					}else{
//						allCourse += "," + result.data.courseList[i].courseid;
//					}
//					$("#courseList")
//						.append("<option value=" + result.data.courseList[i].courseid + ">" + result.data.courseList[i].coursename + "</option>");
//				}
//				$("#courseList").prepend("<option value=" + allCourse + ">全部课程</option>");
//				$("#courseList option").eq(0).attr("selected", true);
//				$("#courseList").trigger("chosen:updated");
//				generate_table();
//			}
//		}
//	});
//}

function query_add_courseList(){
	var param = {
		campusid : $("#school-chosen-add").val(),
		userid : main_userid
	};
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_SCHOOL_COURSE_LIST,
		param : JSON.stringify(param)
	}
	$.ajax({
		cache:false,
		type: "POST",
		async:false,
		url: ctx + ApiParamUtil.COMMON_URL_AJAX,
		data: submitData,
		success: function(json){
			var result = typeof json == "object" ? json : JSON.parse(json);
			if(result.ret.code == 200){
				$("#courseAddList option").remove();
				for (var i = 0; i < result.data.courseList.length; i++) {
					$("#courseAddList")
						.append("<option value=" + result.data.courseList[i].courseid + ">" + result.data.courseList[i].coursename + "</option>");
				}
				$("#courseAddList option").eq(0).attr("selected", true);
				$("#courseAddList").trigger("chosen:updated");
			}
		}
	});
}