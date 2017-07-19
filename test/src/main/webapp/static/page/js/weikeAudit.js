var ctx=$("#ctx").val();
var pagelength = 5;
var nowPageWaiting = 0;
var nowPagePass = 0;
var nowPageFailed = 0;
var main_userid = $("#main_userid").val();
var currentTab = "waiting-tab";

$(document).ready(function() {
	queryCampusList();
	$("#saveSubmit").click(function() {
		saveWeikeInfo();
	});
	$("#waiting-search").click(function() {
		nowPageWaiting = 0;
		queryWeikeList(WxXxWkResource.WK_STATE_PENDING_AUDIT);
	});
	$("#pass-search").click(function() {
		nowPagePass = 0;
		queryWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
	});
	$("#failed-search").click(function() {
		nowPageFailed = 0;
		queryWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
	});
	$("#waiting-campusList").change(function() {
		nowPageWaiting = 0;
		queryWeikeList(WxXxWkResource.WK_STATE_PENDING_AUDIT);
	});
	$("#pass-campusList").change(function() {
		nowPagePass = 0;
		queryWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
	});
	$("#failed-campusList").change(function() {
		nowPageFailed = 0;
		queryWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
	});
	$("#pass-btn").click(function() {
		auditWeike($("#detail-id").val(),WxXxWkResource.WK_STATE_PASS_AUDIT);
	});
	$("#failed-btn").click(function() {
		auditWeike($("#detail-id").val(),WxXxWkResource.WK_STATE_FAIL_AUDIT);
	});
});

function queryCampusList(){
	var submitData = {
		api:ApiParamUtil.COMMON_QUERY_CAMPUS,
		param:JSON.stringify({})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createCampusList(result.data.campusList);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createCampusList(data){
	var option = "";
	for ( var i = 0; i < data.length; i++) {
		option += '<option value="'+data[i].id+'">'+data[i].value+'</option>';
	}
	$("#waiting-campusList").html(option);
	$("#waiting-campusList").trigger("chosen:updated");
	$("#pass-campusList").html(option);
	$("#pass-campusList").trigger("chosen:updated");
	$("#failed-campusList").html(option);
	$("#failed-campusList").trigger("chosen:updated");
	queryWeikeList(WxXxWkResource.WK_STATE_PENDING_AUDIT);
	queryWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
	queryWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
}

function queryWeikeList(state){
	GHBB.prompt("正在加载~");
	var campusid = "";
	var title = "";
	var pagestart = 0;
	if(state == WxXxWkResource.WK_STATE_PASS_AUDIT){
		campusid = $("#pass-campusList").val();
		title = $("#pass-title").val();
		pagestart = nowPagePass * pagelength;
	}else if(state == WxXxWkResource.WK_STATE_FAIL_AUDIT){
		campusid = $("#failed-campusList").val();
		title = $("#failed-title").val();
		pagestart = nowPageFailed * pagelength;
	}else{
		campusid = $("#waiting-campusList").val();
		title = $("#waiting-title").val();
		pagestart = nowPageWaiting * pagelength;
	}
	var submitData = {
		api:ApiParamUtil.APPID_WEIKE_AUDIT_LIST,
		param:JSON.stringify({
			campusid : campusid,
			pagelength : pagelength,
			pagestart : pagestart,
			state : state,
			title : title,
			userid : main_userid
		})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createWeikeList(result.data.myweikeList,state);
				createPageList(result.data.total, state);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createWeikeList(data,state){
	var str = "";
	if(data != null && data.length > 0){
		for ( var i = 0; i < data.length; i++) {
			var btn = "";
			var countStr = "";
			var headerStr = '<img alt="" src="'+data[i].picpath+'" />';
			if(data[i].state == WxXxWkResource.WK_STATE_PENDING_AUDIT){
				btn = '<a class="btn btn-sm btn-default" data-dismiss="modal" onclick="showAuditBox(\''+data[i].id+'\')">审&nbsp;&nbsp;核</a>';
				countStr = '<div class="pending"></div>';
			}else if(data[i].state == WxXxWkResource.WK_STATE_PASS_AUDIT){
				countStr = '<span>浏览数：'+data[i].readcount+'</span><span>评论数：'+data[i].commentcount+'</span>';
			}else if(data[i].state == WxXxWkResource.WK_STATE_FAIL_AUDIT){
				headerStr = '<div class="failedHeader"></div>';
			}
			str += '<div class="myWeikeBox">'
				+  '	<div class="l"></div>'
				+  '	<div class="m">'
				+  '		<div class="headerImg">'
				+  				headerStr
				+  '		</div>'
				+  '		<div class="infoBox">'
				+  '			<div class="info-title"><a href="'+ctx+'/base/func/'+ApiParamUtil.APPID_WEIKE_VIEW_JUMP+'?campusid='+data[i].campusid+'&orgcode='+main_orgcode+'&userid='
																	+main_userid+'&dataid='+data[i].id+'" target="view_window">'+data[i].title+'</a></div>'
				+  '			<div class="info-time">'+data[i].publishdate+'</div>'
				+  '			<div class="info-count">'
				+  					countStr
				+  '			</div>'
				+  '		</div>'
				+  '	</div>'
				+  '	<div class="r">'
				+  			btn
				+  '	</div>'
				+  '</div>';
		};
	}else{
		str = '<div class="noData">暂无数据</div>';
	}
	if(state == WxXxWkResource.WK_STATE_PASS_AUDIT){
		$("#passList").html(str);
	}else if(state == WxXxWkResource.WK_STATE_FAIL_AUDIT){
		$("#failedList").html(str);
	}else{
		$("#waitingList").html(str);
	}
}

function showAuditBox(dataid){
	GHBB.prompt("正在加载~");
	$("#detail-id").val(dataid);
	var submitData = {
		api:ApiParamUtil.APPID_WEIKE_VIEW,
		param:JSON.stringify({
			dataid : dataid,
			campusid : $("#waiting-campusList").val()
		})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				setDetailInfo(result.data.weike);
				$("#modal-weike-detail").modal('show');
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function setDetailInfo(data){
	$("#detail-title").html(data.title);
	$("#detail-publisher").html(data.publisher);
	$("#detail-coursename").html(data.coursename);
	$("#detail-grade").html(data.grade);
	$("#detail-publishdate").html(data.publishdate);
	$("#detail-knowledgename").html(data.knowledgename);
	$("#detail-content").html(data.content);
	$("#playBox").attr("src",data.filepath);
	createEnclosureList(data.enclosure);
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

function auditWeike(id,state){
	GHBB.prompt("数据保存中~");
	var submitData = {
		api:ApiParamUtil.APPID_WEIKE_AUDIT_UPDATE,
		param:JSON.stringify({
			id : id,
			state : state
		})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				$("#modal-weike-detail").modal('hide');
				queryWeikeList(WxXxWkResource.WK_STATE_PENDING_AUDIT);
				queryWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
				queryWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createPageList(total,state){
	var currentPage = 0;
	if(state == WxXxWkResource.WK_STATE_PASS_AUDIT){
		currentPage = nowPagePass;
	}else if(state == WxXxWkResource.WK_STATE_FAIL_AUDIT){
		currentPage = nowPageFailed;
	}else{
		currentPage = nowPageWaiting;
	}
	var li = '<li><a href="javascript:previousQuery()"><i class="fa fa-angle-left"></i></a></li>';
	var pageCount = Math.ceil(total/pagelength);
	for (var i = 0; i < pageCount; i++) {
		var active = "";
		if(i == currentPage){
			active = " class='active'";
		}else{
			active = '';
		}
		li += '<li'+active+'><a href="javascript:query_page('+ (i) +')">'+ (i+1) +'</a></li>';
	}
	li += '<li><a href="javascript:nextQuery(' + pageCount + ')"><i class="fa fa-angle-right"></i></a></li>';
	
	if(state == WxXxWkResource.WK_STATE_PASS_AUDIT){
		$("#pass-page").html(li);
	}else if(state == WxXxWkResource.WK_STATE_FAIL_AUDIT){
		$("#failed-page").html(li);
	}else{
		$("#waiting-page").html(li);
	}
}

function query_page(num){
	if(currentTab == "pass-tab"){
		nowPagePass = num;
		queryWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
	}else if(currentTab == "failed-tab"){
		nowPageFailed = num;
		queryWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
	}else{
		nowPageWaiting = num;
		queryWeikeList(WxXxWkResource.WK_STATE_PENDING_AUDIT);
	}
}

function previousQuery(){
	if(currentTab == "pass-tab"){
		if(nowPagePass > 0){
			nowPagePass = nowPagePass - 1;
		}
		queryWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
	}else if(currentTab == "failed-tab"){
		if(nowPageFailed > 0){
			nowPageFailed = nowPageFailed - 1;
		}
		queryWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
	}else{
		if(nowPageWaiting > 0){
			nowPageWaiting = nowPageWaiting - 1;
		}
		queryWeikeList(WxXxWkResource.WK_STATE_PENDING_AUDIT);
	}
}

function nextQuery(pageCount){
	if(currentTab == "pass-tab"){
		if(nowPagePass < (pageCount - 1)){
			nowPagePass++;
		}
		queryWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
	}else if(currentTab == "failed-tab"){
		if(nowPageFailed < (pageCount - 1)){
			nowPageFailed++;
		}
		queryWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
	}else{
		if(nowPageWaiting < (pageCount - 1)){
			nowPageWaiting++;
		}
		queryWeikeList(WK_STATE_PENDING_AUDIT);
	}
}

function hideRight(obj){
	if($("#introduction").hasClass("hide")){
		$("#videoBox").css("margin-right","352px");
		$(obj).attr("class","arrowRight");
		$("#introduction").removeClass("hide");
	}else{
		$("#videoBox").css("margin-right","16px");
		$(obj).attr("class","arrowLeft");
		$("#introduction").addClass("hide");
	}
}

function changeCurrentTab(id){
	currentTab = id;
}