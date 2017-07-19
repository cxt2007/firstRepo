var currentKnowledgeId = "";
var ctx = $("#ctx").val();
var currentPage = 0;
var displayStart = 0;
var displayLength = 5;

$(document).ready(function() {
	queryCampus();
	
	$("#searchWeikeBtn").click(function(){
		currentPage = 0;
		queryWkResource();
	});
	
});


function queryCampus(){
	GHBB.prompt("正在加载~");
	var param = {};
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_CAMPUS,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			
			$("#campusList").children().remove();
			for (var i = 0; i < result.data.campusList.length; i++) {
				$("#campusList")
					.append('<li><div id="campus_'+ result.data.campusList[i].id
							+'" class="searchBtn" onclick="changeCheckedForCampus('+result.data.campusList.length+',this,'
							+ result.data.campusList[i].id +');">'
							+ result.data.campusList[i].value
							+'</div></li>');
			}
			
			var childrenObj = $("#campusList").children().find(".searchBtn");
			childrenObj.eq(0).addClass("searchBtnActive");
			queryNjsj();
			queryCourse();
		}
	});
}

function changeCheckedForCampus(length,obj,thisid){
	var childrenObj = $(obj).parent().parent().find(".searchBtn");
	for(var j = 0; j < length; j++){
		childrenObj.eq(j).removeClass("searchBtnActive");
	}
	if(!$(obj).hasClass("searchBtnActive")){
		$(obj).addClass("searchBtnActive");
	}
	currentPage = 0;
	queryNjsj();
	queryCourse();
	
}

function queryNjsj(){
	GHBB.prompt("正在加载~");
	var campusId = getCheckedIds("campusList");
	var param = {
		campusid : campusId,
		userid : main_userid
	};
	var submitData = {
		api : ApiParamUtil.COMMON_QUERY_GRADE,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			GHBB.hide();
			$("#njList").children().remove();
			if(result.data.njList.length > 0 ){
				$("#njList")
				.append('<li><div id="njid_0" class="searchBtn searchBtnActive" onclick="changeChecked(2,this,0);">全部年级</div></li>');
				for (var i = 0; i < result.data.njList.length; i++) {
					$("#njList")
						.append('<li><div id="njid_'+ result.data.njList[i].id 
								+'" class="searchBtn searchBtnActive" onclick="changeChecked(2,this,'
								+ result.data.njList[i].id +');">'
								+ result.data.njList[i].njmc
								+'</div></li>');
				}
			}else{
				$("#njList")
				.append('<li><div>暂无年级数据</div></li>');
			}
		}
	});
}

function queryCourse(){
	GHBB.prompt("正在加载~");
	var campusId = getCheckedIds("campusList");
	var param = {
		campusid : campusId,
		userid : main_userid
	};
	var submitData = {
		api : ApiParamUtil.SYS_MANAGE_SCHOOL_COURSE_LIST,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		if(result.ret.code == 200){
			$("#courseList").children().remove();
			if(result.data.courseList.length>0){
				$("#courseList")
				.append('<li><div id="courseid_0" class="searchBtn searchBtnActive" onclick="changeChecked(3,this,0);">全部科目</div></li>');
				for (var i = 0; i < result.data.courseList.length; i++) {
					$("#courseList")
						.append('<li><div id="courseid_'+ result.data.courseList[i].courseid 
								+'" class="searchBtn searchBtnActive" onclick="changeChecked(3,this,'
								+ result.data.courseList[i].courseid +');">'
								+ result.data.courseList[i].coursename
								+'</div></li>');
				}
			}else{
				$("#courseList")
				.append('<li><div>暂无科目数据</div></li>');
			}
			loading_knowledge_tree();
		}
	});
}


function changeChecked(type,obj,thisid){
	if(thisid == 0){
		if($(obj).hasClass("searchBtnActive")){
			$(obj).parent().parent().find(".searchBtn").removeClass("searchBtnActive");
		}else{
			$(obj).parent().parent().find(".searchBtn").addClass("searchBtnActive");
		}
	}else{
		var activeObj = $(obj).parent().parent().find(".searchBtnActive");
		var childrenObj = $(obj).parent().parent().find(".searchBtn");
		if($(obj).hasClass("searchBtnActive")){
			if(activeObj.length == childrenObj.length != 0){
				childrenObj.eq(0).removeClass("searchBtnActive");
			}
			$(obj).removeClass("searchBtnActive");
		}else{
			if(activeObj.length == (childrenObj.length - 2) && childrenObj.length != 0){
				childrenObj.eq(0).addClass("searchBtnActive");
			}
			$(obj).addClass("searchBtnActive");
		}
	}
	
	if(type == 3){
		loading_knowledge_tree();
	}else{
		currentPage = 0;
		queryWkResource();
	}
	
}

function loading_knowledge_tree() {
	GHBB.prompt("正在加载~");
	var campusId = getCheckedIds("campusList");
	var courseid = getCheckedIds("courseList");
	var param = {
		campusid: campusId,
		courseid: courseid
	};
	var submitData = {
		api: ApiParamUtil.APPID_WEIKE_KNOWLEDGE_LIST_QUERY,
		param: JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code == "200") {
				var setting = {
					data: {
						key: {
							title:name
						},
						simpleData: {
							enable: true,
							pIdKey: "parentid"
						}
					},
					callback: {
						onClick: onClick
					}
				};
				var treeObj = $.fn.zTree.init($("#knowledgeList"), setting, result.data.nodeList);
				treeObj.expandAll(true); 
				currentPage = 0;
				queryWkResource();
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

function onClick(event, treeId, treeNode, clickFlag) {
	currentPage = 0;
    currentKnowledgeId = treeNode.id;
	queryWkResource();
}

function queryWkResource(){
	GHBB.prompt("正在加载~");
	var campusid = getCheckedIds("campusList");
	var gradeid = getCheckedIds("njList");
	var courseid = getCheckedIds("courseList");
	displayStart = currentPage * displayLength;
	var param = {
			displayStart : displayStart,
			displayLength : displayLength,
			courseid : courseid,
			campusid : campusid,
			gradeid	 : gradeid,
			knowledgeid	: currentKnowledgeId,
			title	 : $("#search_weiketile").val()
	};
	var submitData = {
		api : ApiParamUtil.APPID_WEIKE_LIST_QUERY,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(json) {
		GHBB.hide();
		var result = typeof json == "object" ? json : JSON.parse(json);
		$("#wkResourceList").children().remove();
		if(result.ret.code == 200){
			if((result.data.weikeList == null || result.data.weikeList.length == 0) && currentPage == 0){
				$("#wkResourceList").append('<li class="noData">没有查到微课信息哦！</li>');
			}else if((result.data.weikeList == null || result.data.weikeList.length == 0) && currentPage != 0){
				$("#wkResourceList").append('<li class="noData">没有更多微课信息了！</li>');
			}else{
				for (var i = 0; i < result.data.weikeList.length; i++) {
					var resourceInfo = result.data.weikeList;
					$("#wkResourceList").append(createWkResourceList(resourceInfo));
				}
			}
			$("#weikeCount").html("共"+result.data.totalcount+"个文档");
			createPageList(result.data.totalcount);
		}else{
			$("#wkResourceList").append('<li class="noData">'+ result.ret.msg +'</li>');
		}
	});
}

function createWkResourceList(data){
	var str = "";
	if(data != null && data.length > 0){
		for ( var i = 0; i < data.length; i++) {
			var picpath = "http://weixt-static.oss-cn-qingdao.aliyuncs.com/c88a5176a330f192ac213604237bd80a22940bd6.bmp";
			$("#wkResourceList").parent().find(".lineBox").removeClass("hide");
			if(data[i].picpath != null && data[i].picpath !=""){
				picpath = data[i].picpath;
			}
			var content = data[i].content;
			if(content.length > 20){
				content = data[i].content.substring(0,20)+"...";
			}
			
			var detailUrl = ctx+'/base/func/'+ApiParamUtil.APPID_WEIKE_VIEW_JUMP+'?campusid='+data[i].campusid+'&orgcode='+main_orgcode+'&userid='+main_userid+'&dataid='+data[i].id;;
			
			str += '<div class="myWeikeBox">'
				+  '	<div class="m">'
				+  '		<div class="headerImg">'
				+  '			<img alt="" src="'+picpath+'" />'
				+  '		</div>'
				+  '		<div class="infoBox">'
				+  '			<div class="info-title"><a href="'+detailUrl+'" target="view_window">'+data[i].title+'</a></div>'
				+  '			<div class="info-publisher">上传者：'+data[i].publisher+'</div>'
				+  '			<div class="info-wkinfo">上传时间：'+data[i].publishdate+'</div>'
				+  '			<div class="info-wkinfo">知识点：'+data[i].knowledgename+'</div>'
				+  '			<div class="info-wkinfo">内容简介：'+content+' <a href="'+detailUrl+'" target="view_window">[详细]</a></div>'
				+  '		</div>'
				+  '	</div>'
				+  '	<div class="r">'
				+  '		<span class="readCount">已阅读'+data[i].readcount+'次</span>'
				+  '		<span class="praiseNum">'+data[i].praisenum+'人点赞</span>'
				+  '		<span class="commentNum">'+data[i].commentcount+'人评价</span>'
				+  '	</div>'
				+  '</div>';
		};
	}else{
		str = '<div class="noData">暂无数据</div>';
		$("#wkResourceList").parent().find(".lineBox").addClass("hide");

	}
	
	$("#wkResourceList").html(str);

}

function getCheckedIds(boxID){
	var searchIds = "";
	var searchList = $("#"+boxID).find(".searchBtnActive");
	if(searchList.length > 0){
		for (var i = 0; i < searchList.length; i++) {
			if(i == searchList.length - 1){
				searchIds += searchList.eq(i).attr("id").split("_")[1];
			}else{
				searchIds += searchList.eq(i).attr("id").split("_")[1] + ",";
			}
		}
	}
	return searchIds;
}

function createPageList(total){
	var li = '<li><a href="javascript:previousQuery()"><i class="fa fa-angle-left"></i></a></li>';
	var pageCount = Math.ceil(total/displayLength);
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
	$("#pagination").html(li);
}

function query_page(num){
	currentPage = num;
	queryWkResource();
}

function previousQuery(){
	if(currentPage > 0){
		currentPage = currentPage - 1;
	}
	queryWkResource();
}

function nextQuery(pageCount){
	if(currentPage < (pageCount - 1)){
		currentPage++;
	}
	queryWkResource();
}