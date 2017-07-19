var commonUrl_ajax = "/weixt/base/ajax_query_data";
var dataid = $("#dataid").val();
var campusid = $("#campusid").val();
var orgcode = $("#orgcode").val();
var userid = $("#userid").val();
var nowPage = 0;
var pageLength = 3;
$(document).ready(function() {
	queryWeikeInfo();
	queryCommentList();
	refreshReadCount();
});

function queryWeikeInfo(){
	var submitData = {
		api:ApiParamUtil.APPID_WEIKE_VIEW,
		param:JSON.stringify({
			dataid : dataid,
			campusid : campusid
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
				setDetailInfo(result.data.weike);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function setDetailInfo(data){
	if(data != null){
		$("#playBox").attr("src",data.filepath);
		$("#tvTitle").html(data.title);
		$("#detail-publisher").html(data.publisher);
		$("#detail-coursename").html(data.coursename);
		$("#detail-grade").html(data.grade);
		$("#detail-publishdate").html(data.publishdate);
		$("#detail-knowledgename").html(data.knowledgename);
		$("#detail-content").html(data.content);
		$("#detail-publisher").html(data.publisher);
		$("#filepath").attr("href",data.filepath);
		$("#ispraise").val(data.ispraise);
		$("#iscollection").val(data.iscollection);
		$("#id").val(data.id);
		$("#praisenum").html(data.praisenum);
		$("#serialnumber").val(data.serialnumber);
		createEnclosureList(data.enclosure);
		if(data.state != "4"){
			$(".hotDiscuss").addClass("hide");
			$(".mainBox").addClass("p_b_50");
			$(".btnBox").addClass("hide");
		}
	}
}

function createEnclosureList(enclosureList){
	if(enclosureList != null && enclosureList.length > 0){
		var a = "";
		for ( var i = 0; i < enclosureList.length; i++) {
			a += '<a href="'+enclosureList[i].url+'">'+enclosureList[i].name+'</a>';
		}
		$("#detail-listBox").html(a);
	}else{
		$("#detail-listBox").html("");
	}
}

function refreshReadCount(){
	var submitData = {
		api:ApiParamUtil.APPID_WEIKE_READ,
		param:JSON.stringify({
			dataid : dataid
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
				
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function praise(){
	var ispraise = $("#ispraise").val();
	if(ispraise == "false"){
		var submitData = {
			api:ApiParamUtil.APPID_WEIKE_PRAISE,
			param:JSON.stringify({
				dataid : dataid,
				userid : userid
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
					var nowPraiseNum = parseInt($("#praisenum").html());
					if(result.ret.msg == "praised"){
						$("#ispraise").val("true");
						nowPraiseNum = nowPraiseNum + 1;
					}else{
						$("#ispraise").val("false");
						nowPraiseNum = nowPraiseNum - 1;
					}
					$("#praisenum").html(nowPraiseNum);
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
	}else{
		alert("无需重复点赞！");
	}
}

function store(){
	var iscollection = $("#iscollection").val();
	if(iscollection == "false"){
		var submitData = {
			api:ApiParamUtil.APPID_WEIKE_COLLECTION,
			param:JSON.stringify({
				dataid : dataid,
				userid : userid
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
					if(result.ret.msg == "store"){
						alert("收藏成功！");
						$("#iscollection").val("true");
					}else{
						alert("取消收藏！");
						$("#iscollection").val("false");
					}
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
	}else{
		alert("您已收藏过该微课！");
	}
}

function queryCommentList(){
	var pageStart = nowPage * pageLength;
	var submitData = {
		api:ApiParamUtil.APPID_WEIKE_COMMENT_LIST_QUERY,
		param:JSON.stringify({
			dataid : dataid,
			pageLength : pageLength,
			pageStart : pageStart,
			orgcode : orgcode,
			campusid : campusid
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
				$("#commentCount").html("共"+result.data.total+"条");
				createCommentList(result.data.commentList);
				createPageList(result.data.total);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createCommentList(commentList){
	if(commentList != null && commentList.length > 0){
		var li = "";
		for ( var i = 0; i < commentList.length; i++) {
			var iconpath = "";
			if(commentList[i].iconpath != null && commentList[i].iconpath != ""){
				iconpath = commentList[i].iconpath;
			}else if(commentList[i].publisher_sex == "1"){
				iconpath = "http://jeff-ye-1978.qiniudn.com/boyteacher.jpg";
			}else if(commentList[i].publisher_sex == "2"){
				iconpath = "http://jeff-ye-1978.qiniudn.com/girlteacher.jpg";
			}
			li += '<li>'
			   +  '		<div class="commentBox">'
			   +  '			<div class="headerImg"><img alt="" src="'+iconpath+'" /></div>'
			   +  '			<div class="commentInfo">'
			   +  '				<div class="nameAndTime">'
			   +  '					<span class="name">'+commentList[i].publisher+'</span>'
			   +  '					<span class="time">'+commentList[i].commentTime+'</span>'
			   +  '				</div>'
			   +  '				<div class="commentContent">'+commentList[i].content+'</div>'
			   +  '			</div>'
			   +  '		</div>'
			   +  '	</li>';
		}
		$("#commentList").html(li);
	}else{
		$("#commentList").html('<li class="noData">暂无评论</li>');
	}
}

function createPageList(total){
	if(total > 0){
		var li = '<li><a href="javascript:pageQuery(0);">第一页</a></li><li><a href="javascript:previousQuery(0);">上一页</a></li>';
		var pageCount = Math.ceil(total/pageLength);
		for ( var i = 0; i < pageCount; i++) {
			var active = '';
			if(nowPage == i){
				li += '<li><a class="active">'+(i+1)+'</a></li>';
			}else{
				li += '<li><a href="javascript:pageQuery('+i+');">'+(i+1)+'</a></li>';
			}
		}
		li += '<li><a href="javascript:nextQuery('+pageCount+');">下一页</a></li><li><a href="javascript:pageQuery('+(pageCount-1)+');">最后一页</a></li>';
		$("#pageList").html(li);
	}else{
		$("#pageList").html("");
	}
}

function previousQuery(){
	if(nowPage > 0){
		nowPage --;
		queryCommentList();
	}
}

function nextQuery(pageCount){
	if(nowPage<pageCount-1){
		nowPage ++;
		queryCommentList();
	}
}

function pageQuery(pageNum){
	nowPage = pageNum;
	queryCommentList();
}

function hideRight(obj){
	if($("#introduction").hasClass("hide")){
		$("#playVideo").css("margin-right","352px");
		$(obj).attr("class","arrowRight");
		$("#introduction").removeClass("hide");
	}else{
		$("#playVideo").css("margin-right","16px");
		$(obj).attr("class","arrowLeft");
		$("#introduction").addClass("hide");
	}
}

function showSendBox(){
	$("#sendBox").removeClass("hide");
	$("#sendBox").find("textarea").val("");
}

function saveComment(){
	var textarea = $("#sendBox").find("textarea").val();
	if(textarea == null || textarea == ""){
		return;
	}
	var submitData = {
		api:ApiParamUtil.APPID_WEIKE_COMMENT_SAVE,
		param:JSON.stringify({
			dataid : dataid,
			userid : userid,
			orgcode : orgcode,
			campusid : campusid,
			content : $("#sendBox").find("textarea").val()
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
				$("#sendBox").addClass("hide");
				$("#sendBox").find("textarea").val("");
				queryCommentList();
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function cancel(obj){
	$(obj).parent().parent().addClass("hide");
	$("#sendBox").find("textarea").val("");
}














