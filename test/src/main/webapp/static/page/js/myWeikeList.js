var ctx=$("#ctx").val();
var pagelength = 5;
var nowPageMyupload = 0;
var nowPageUploading = 0;
var nowPageFailed = 0;
var nowPageCollection = 0;
var main_userid = $("#main_userid").val();
var currentTab = "myupload-tab";

$(document).ready(function() {
	queryCampusList();
	$("#saveSubmit").click(function() {
		saveWeikeInfo();
	});
	$("#myupload-search").click(function() {
		nowPageMyupload = 0;
		queryMyWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
	});
	$("#uploading-search").click(function() {
		nowPageUploading = 0;
		queryMyWeikeList(WxXxWkResource.WK_STATE_LOADING+","+WxXxWkResource.WK_STATE_TRANSCODING+","+WxXxWkResource.WK_STATE_PENDING_AUDIT);
	});
	$("#failed-search").click(function() {
		nowPageFailed = 0;
		queryMyWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
	});
	$("#myupload-campusList").change(function() {
		nowPageMyupload = 0;
		queryMyWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
	});
	$("#uploading-campusList").change(function() {
		nowPageUploading = 0;
		queryMyWeikeList(WxXxWkResource.WK_STATE_LOADING+","+WxXxWkResource.WK_STATE_TRANSCODING+","+WxXxWkResource.WK_STATE_PENDING_AUDIT);
	});
	$("#failed-campusList").change(function() {
		nowPageFailed = 0;
		queryMyWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
	});
	
	$("#collection-search").click(function() {
		nowPageCollection = 0;
		queryStoreList();
	});
	$("#collection-campusList").change(function() {
		nowPageCollection = 0;
		queryStoreList();
	});
	$("#detail-courselist").change(function() {
		loading_knowledge_list();
	});
	$("#uploadShow").click(function() {
		$("#filePicker").find("input[type='file']").click();
	});
	
	initWebUploader();
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
	$("#myupload-campusList").html(option);
	$("#myupload-campusList").trigger("chosen:updated");
	$("#uploading-campusList").html(option);
	$("#uploading-campusList").trigger("chosen:updated");
	$("#failed-campusList").html(option);
	$("#failed-campusList").trigger("chosen:updated");
	$("#collection-campusList").html(option);
	$("#collection-campusList").trigger("chosen:updated");
	queryMyWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
	queryMyWeikeList(WxXxWkResource.WK_STATE_LOADING+","+WxXxWkResource.WK_STATE_TRANSCODING+","+WxXxWkResource.WK_STATE_PENDING_AUDIT);
	queryMyWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
	queryStoreList();
}

function queryStoreList(){
	GHBB.prompt("正在加载~");
	var pagestart = nowPageCollection * pagelength;
	var submitData = {
		api:ApiParamUtil.APPID_WEIKE_MYWK_STORE_LIST,
		param:JSON.stringify({
			campusid : $("#myupload-campusList").val(),
			pagelength : pagelength,
			pagestart : pagestart,
			title : $("#collection-title").val(),
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
				createStoreList(result.data.myweikeList);
				createPageList(result.data.total,"");
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createStoreList(data){
	var str = "";
	if(data != null && data.length > 0){
		for ( var i = 0; i < data.length; i++) {
			str += '<div class="myWeikeBox">'
				+  '	<div class="l"><input type="checkbox" name="collection-checkbox" value="'+data[i].id+'" /></div>'
				+  '	<div class="m">'
				+  '		<div class="headerImg">'
				+  '			<img alt="" src="'+data[i].picpath+'" />'
				+  '		</div>'
				+  '		<div class="infoBox">'
				+  '			<div class="info-title"><a href="'+ctx+'/base/func/'+ApiParamUtil.APPID_WEIKE_VIEW_JUMP+'?campusid='+data[i].campusid+'&orgcode='+main_orgcode+'&userid='
														+main_userid+'&dataid='+data[i].id+'" target="view_window">'+data[i].title+'</a></div>'
				+  '			<div class="info-time">'+data[i].publishdate+'</div>'
				+  '			<div class="info-count">'
				+  '				<span>浏览数：'+data[i].readcount+'</span>'
				+  '				<span>评论数：'+data[i].commentcount+'</span>'
				+  '			</div>'
				+  '		</div>'
				+  '	</div>'
				+  '	<div class="r">'
				+  '		<a class="btn btn-sm btn-default" data-dismiss="modal" onclick="removeMyWeike(\''+data[i].id+'\')">移&nbsp;&nbsp;除</a>'
				+  '	</div>'
				+  '</div>';
		}
		$("#store-myWeikeList").parent().find(".lineBox").removeClass("hide");
	}else{
		str = '<div class="noData">暂无数据</div>';
		$("#store-myWeikeList").parent().find(".lineBox").addClass("hide");
	}
	$("#store-myWeikeList").html(str);
}

function queryMyWeikeList(state){
	GHBB.prompt("正在加载~");
	var campusid = "";
	var title = "";
	var pagestart = 0;
	if(state == WxXxWkResource.WK_STATE_PASS_AUDIT){
		campusid = $("#myupload-campusList").val();
		title = $("#myupload-title").val();
		pagestart = nowPageMyupload * pagelength;
	}else if(state == WxXxWkResource.WK_STATE_FAIL_AUDIT){
		campusid = $("#failed-campusList").val();
		title = $("#failed-title").val();
		pagestart = nowPageFailed * pagelength;
	}else{
		campusid = $("#uploading-campusList").val();
		title = $("#uploading-title").val();
		pagestart = nowPageUploading * pagelength;
	}
	var submitData = {
		api:ApiParamUtil.APPID_WEIKE_MYWK_LIST,
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
				createMyWeikeList(result.data.myweikeList,state);
				createPageList(result.data.total,state);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createMyWeikeList(data,state){
	var str = "";
	if(data != null && data.length > 0){
		for ( var i = 0; i < data.length; i++) {
			var headerStr = '<img alt="" src="'+data[i].picpath+'" />';
			var checkBoxName = "";
			var countStr = "";
			if(data[i].state == WxXxWkResource.WK_STATE_PASS_AUDIT){
				$("#myupload-myWeikeList").parent().find(".lineBox").removeClass("hide");
				checkBoxName = "myupload-checkbox";
				countStr = '<span>浏览数：'+data[i].readcount+'</span><span>评论数：'+data[i].commentcount+'</span>';
			}else if(data[i].state == WxXxWkResource.WK_STATE_FAIL_AUDIT){
				$("#failed-myWeikeList").parent().find(".lineBox").removeClass("hide");
				checkBoxName = "failed-checkbox";
				headerStr = '<div class="failedHeader"></div>';
			}else{
				$("#uploading-myWeikeList").parent().find(".lineBox").removeClass("hide");
				checkBoxName = "uploading-checkbox";
				if(data[i].state == WxXxWkResource.WK_STATE_TRANSCODING){
					headerStr = '<div class="handleHeader"></div>';
					countStr = '<div class="transcoding"></div>';
				}else if(data[i].state == WxXxWkResource.WK_STATE_PENDING_AUDIT){
					countStr = '<div class="pending"></div>';
				}
			};
			str += '<div class="myWeikeBox">'
				+  '	<div class="l"><input type="checkbox" name="'+checkBoxName+'" value="'+data[i].id+'" /></div>'
				+  '	<div class="m">'
				+  '		<div class="headerImg">'
				+				headerStr
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
				+  '		<a class="btn btn-sm btn-default" data-dismiss="modal" onclick="editMyWeike(\''+data[i].id+'\')">编&nbsp;&nbsp;辑</a>'
				+  '		<a class="btn btn-sm btn-default" data-dismiss="modal" onclick="delMyWeike(\''+data[i].id+'\')">删&nbsp;&nbsp;除</a>'
				+  '	</div>'
				+  '</div>';
		};
	}else{
		str = '<div class="noData">暂无数据</div>';
		if(state == WxXxWkResource.WK_STATE_PASS_AUDIT){
			$("#myupload-myWeikeList").parent().find(".lineBox").addClass("hide");
		}else if(state == WxXxWkResource.WK_STATE_FAIL_AUDIT){
			$("#failed-myWeikeList").parent().find(".lineBox").addClass("hide");
		}else{
			$("#uploading-myWeikeList").parent().find(".lineBox").addClass("hide");
		}
	}
	
	if(state == WxXxWkResource.WK_STATE_PASS_AUDIT){
		$("#myupload-myWeikeList").html(str);
	}else if(state == WxXxWkResource.WK_STATE_FAIL_AUDIT){
		$("#failed-myWeikeList").html(str);
	}else{
		$("#uploading-myWeikeList").html(str);
	}
}

function editMyWeike(dataid){
	GHBB.prompt("正在加载~")
	cleanInfo();
	var campusid = "";
	if(currentTab == "myupload-tab"){
		campusid = $("#myupload-campusList").val();
	}else if(currentTab == "failed-tab"){
		campusid = $("#failed-campusList").val();
	}else{
		campusid = $("#uploading-campusList").val();
	}
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
	$("#detail-id").val(data.id);
	$("#detail-state").val(data.state);
    $("#detail-picpath").attr("src",data.picpath);
	
	$("#detail-title").val(data.title);
	queryDetailNjList(data.gradeid);
	queryDetailCourseList(data.courseid);
	$("#detail-knowledge-id").val(data.knowledgeid);
	$("#detail-knowledge-name").val(data.knowledgename);
	$("#detail-knowledge").html(data.knowledgename);
	var li = "";
	var enclosurename = "";
	var enclosurepath = "";
	if(data.enclosure != null && data.enclosure.length > 0){
		for ( var i = 0; i < data.enclosure.length; i++) {
			li += '<div class="fileItem">'
				+ '<span class="" filename="' + data.enclosure[i].name + '" fileurl="' + data.enclosure[i].url + '">'
				+ data.enclosure[i].name
				+ '</span>'
				+ '<a onclick="removeFile(this)" class="btn btn-sm btn-alt btn-primary" data-toggle="tooltip" title="删除">'
				+ '<i class="fa fa-times"></i>'
				+ '</a>'
				+ '</div>';
		}
//		enclosurename = enclosurename.substring(0, enclosurename.length - 1);
//		enclosurepath = enclosurepath.substring(0, enclosurepath.length - 1);
	}
//	$("#enclosurename").val(enclosurename);
//	$("#enclosurepath").val(enclosurepath);
//	li += '<li><a href="javascript:void(0);">上传附件</a></li>';
	$("#fileList").prepend(li);
	$("#detail-content").val(data.content);
}

function queryDetailNjList(gradeid){
	var campusid = "";
	if(currentTab == "myupload-tab"){
		campusid = $("#myupload-campusList").val();
	}else if(currentTab == "failed-tab"){
		campusid = $("#failed-campusList").val();
	}else{
		campusid = $("#uploading-campusList").val();
	}
	var submitData = {
		api:ApiParamUtil.COMMON_QUERY_GRADE,
		param:JSON.stringify({
			campusid : campusid,
			userid : main_userid
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
				createDetailNjList(result.data.njList,gradeid);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createDetailNjList(data,gradeid){
	var option = "";
	if(data != null && data != ""){
		for ( var i = 0; i < data.length; i++) {
			var select = '';
			if(data[i].id == gradeid){
				select = " selected=selected";
			}
			option += '<option '+select+' value="'+data[i].id+'">'+data[i].njmc+'</option>';
		}
		$("#detail-njlist").html(option);
		$("#detail-njlist").trigger("chosen:updated");
	}
}

function queryDetailCourseList(courseid){
	GHBB.prompt("正在加载~");
	var campusid = "";
	if(currentTab == "myupload-tab"){
		campusid = $("#myupload-campusList").val();
	}else if(currentTab == "failed-tab"){
		campusid = $("#failed-campusList").val();
	}else{
		campusid = $("#uploading-campusList").val();
	}
	var submitData = {
		api:ApiParamUtil.SYS_MANAGE_SCHOOL_COURSE_LIST,
		param:JSON.stringify({
			campusid : campusid,
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
				createDetailCourseList(result.data.courseList,courseid);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createDetailCourseList(data,courseid){
	var option = "";
	if(data != null && data != ""){
		for ( var i = 0; i < data.length; i++) {
			var select = '';
			if(data[i].courseid == courseid){
				select = " selected=selected";
			}
			option += '<option '+select+' value="'+data[i].courseid+'">'+data[i].coursename+'</option>';
		}
		$("#detail-courselist").html(option);
		$("#detail-courselist").trigger("chosen:updated");
	}
}

function saveWeikeInfo(){
	var state = "";
	if(currentTab == "myupload-tab"){
		state = WxXxWkResource.WK_STATE_PASS_AUDIT;
	}else if(currentTab == "failed-tab"){
		state = WxXxWkResource.WK_STATE_FAIL_AUDIT;
	}else{
		state = WxXxWkResource.WK_STATE_LOADING+","+WxXxWkResource.WK_STATE_TRANSCODING+","+WxXxWkResource.WK_STATE_PENDING_AUDIT;
	}
	
	if($("#detail-knowledge").find("li").length > 0 && ($("#now-nodeid").val() == "" || $("#now-nodeid").val() == null)){
		alert("请选择知识点目录！");
		return;
	}
	
	$("#saveSubmit").attr("disabled","disabled");
	GHBB.prompt("数据保存中~");
	var fileList = $("#fileList").find(".fileItem");
	var filenames = '';
	var fileurls = '';
	
	if(fileList.length > 0) {
		for (var j = 0; j < fileList.length; j++) {
			if(fileList.eq(j).find("span").attr("fileurl") != "" && fileList.eq(j).find("img").length == 0){
				filenames += fileList.eq(j).find("span").attr("filename") + "|";
				fileurls += fileList.eq(j).find("span").attr("fileurl") + "|";
			}
		}
		filenames = filenames.substring(0, filenames.length - 1);
		fileurls = fileurls.substring(0, fileurls.length - 1);
	}
	
	var param = {
			content:$("#detail-content").val(),
			courseid:$("#detail-courselist").val(),
			coursename:$("#detail-courselist").find("option:selected").text(),
			enclosurename:filenames,
			enclosurepath:fileurls,
			id:$("#detail-id").val(),
			state:$("#detail-state").val(),
			knowledgeid:$("#detail-knowledge-id").val(),
			knowledgename:$("#detail-knowledge-name").val(),
			njid:$('#detail-njlist').val(),
			njmc:$("#detail-njlist").find("option:selected").text(),
			picpath:$("#detail-picpath").attr("src"),
			title:$('#detail-title').val()
		};
	console.log(param);
	var submitData = {
		api:ApiParamUtil.APPID_WEIKE_MYWK_UPDATE,
		param:JSON.stringify(param)
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		async:false,
		data: submitData,
		success: function(datas){
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				$('#modal-weike-detail').modal('hide');
				$("#saveSubmit").removeAttr("disabled");
				PromptBox.alert('保存成功！');
				queryMyWeikeList(state);
				cleanInfo();
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function delMyWeike(resource_id){
	if(currentTab == "myupload-tab"){
		state = WxXxWkResource.WK_STATE_PASS_AUDIT;
	}else if(currentTab == "failed-tab"){
		state = WxXxWkResource.WK_STATE_FAIL_AUDIT;
	}else{
		state = WxXxWkResource.WK_STATE_LOADING+","+WxXxWkResource.WK_STATE_TRANSCODING+","+WxXxWkResource.WK_STATE_PENDING_AUDIT;
	}
	if(confirm("确认删除？")){
		GHBB.prompt("数据保存中~");
		var param = {
				id:resource_id
			};
		console.log(param);
		var submitData = {
			api:ApiParamUtil.APPID_WEIKE_MYWK_DELETE,
			param:JSON.stringify(param)
		};
		$.ajax({
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			async:false,
			data: submitData,
			success: function(datas){
				GHBB.hide();
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code==="200"){
					PromptBox.alert('删除成功！');
					queryMyWeikeList(state);
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
	}
}

function removeMyWeike(id){
	if(confirm("确认移除？")){
		GHBB.prompt("数据保存中~");
		var param = {
			id:id
		};
		console.log(param);
		var submitData = {
			api:ApiParamUtil.APPID_WEIKE_MYWK_STORE_DELETE,
			param:JSON.stringify(param)
		};
		$.ajax({
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			async:false,
			data: submitData,
			success: function(datas){
				GHBB.hide();
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code==="200"){
					queryStoreList();
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
	}
}

function checkAll(obj){
	var checknames = $(obj).attr("name").substring(0,$(obj).attr("name").length - 4);
	$('input[name=\''+checknames+'\']').prop("checked",$(obj).is(':checked'));
}

function removeAll(obj){
	var checknames = $(obj).parent().find("input[type='checkbox']").attr("name").substring(0,$(obj).parent().find("input[type='checkbox']").attr("name").length - 4);
	var checkedids = "";
	 $('input:checkbox[name=\''+checknames+'\']:checked').each(function(i){
		 checkedids += $(this).val() + ",";
	});
	checkedids = checkedids.substring(0, checkedids.length - 1);
	var state = "";
	if(currentTab == "collection-tab"){
		removeMyWeike(checkedids);
	}else{
		delMyWeike(checkedids);
	}
}

function createPageList(total,state){
	var currentPage = 0;
	if(state == WxXxWkResource.WK_STATE_PASS_AUDIT){
		currentPage = nowPageMyupload;
	}else if(state == WxXxWkResource.WK_STATE_LOADING+","+WxXxWkResource.WK_STATE_TRANSCODING+","+WxXxWkResource.WK_STATE_PENDING_AUDIT){
		currentPage = nowPageUploading;
	}else if(state == WxXxWkResource.WK_STATE_FAIL_AUDIT){
		currentPage = nowPageFailed;
	}else{
		currentPage = nowPageCollection;
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
		$("#myupload-page").html(li);
	}else if(state == WxXxWkResource.WK_STATE_FAIL_AUDIT){
		$("#failed-page").html(li);
	}else if(state == WxXxWkResource.WK_STATE_LOADING+","+WxXxWkResource.WK_STATE_TRANSCODING+","+WxXxWkResource.WK_STATE_PENDING_AUDIT){
		$("#uploading-page").html(li);
	}else{
		$("#store-page").html(li);
	}
}

function query_page(num){
	if(currentTab == "myupload-tab"){
		nowPageMyupload = num;
		queryMyWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
	}else if(currentTab == "failed-tab"){
		nowPageFailed = num;
		queryMyWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
	}else if(currentTab == "uploading-tab"){
		nowPageUploading = num;
		queryMyWeikeList(WxXxWkResource.WK_STATE_LOADING+","+WxXxWkResource.WK_STATE_TRANSCODING+","+WxXxWkResource.WK_STATE_PENDING_AUDIT);
	}else{
		nowPageCollection = num;
		queryStoreList();
	}
}

function previousQuery(){
	if(currentTab == "myupload-tab"){
		if(nowPageMyupload > 0){
			nowPageMyupload = nowPageMyupload - 1;
		}
		queryMyWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
	}else if(currentTab == "failed-tab"){
		if(nowPageFailed > 0){
			nowPageFailed = nowPageFailed - 1;
		}
		queryMyWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
	}else if(currentTab == "uploading-tab"){
		if(nowPageUploading > 0){
			nowPageUploading = nowPageUploading - 1;
		}
		queryMyWeikeList(WxXxWkResource.WK_STATE_LOADING+","+WxXxWkResource.WK_STATE_TRANSCODING+","+WxXxWkResource.WK_STATE_PENDING_AUDIT);
	}else{
		if(nowPageCollection > 0){
			nowPageCollection = nowPageCollection - 1;
		}
		queryStoreList();
	}
}

function nextQuery(pageCount){
	if(currentTab == "myupload-tab"){
		if(nowPageMyupload < (pageCount - 1)){
			nowPageMyupload++;
		}
		queryMyWeikeList(WxXxWkResource.WK_STATE_PASS_AUDIT);
	}else if(currentTab == "failed-tab"){
		if(nowPageFailed < (pageCount - 1)){
			nowPageFailed++;
		}
		queryMyWeikeList(WxXxWkResource.WK_STATE_FAIL_AUDIT);
	}else if(currentTab == "uploading-tab"){
		if(nowPageUploading < (pageCount - 1)){
			nowPageUploading++;
		}
		queryMyWeikeList(WxXxWkResource.WK_STATE_LOADING+","+WxXxWkResource.WK_STATE_TRANSCODING+","+WxXxWkResource.WK_STATE_PENDING_AUDIT);
	}else{
		if(nowPageCollection < (pageCount - 1)){
			nowPageCollection++;
		}
		queryStoreList();
	}
}

function removeFile(obj) {
	$(obj).parent().remove();
}

function changeCurrentTab(id){
	currentTab = id;
}

function cleanInfo(){
	$("#detail-picpath").attr("src","");
	$("#detail-title").val("");
	$("#now-nodeid").val("");
	$("#detail-knowledge-id").val("");
	$("#detail-knowledge-name").val("");
	$("#detail-content").val("");
	$("#detail-knowledge").html("");
	$("#fileList").find(".fileItem").remove();
}

function loading_knowledge_list() {
	GHBB.prompt("正在加载~");
	var campusid = "";
	if(currentTab == "myupload-tab"){
		campusid = $("#myupload-campusList").val();
	}else if(currentTab == "failed-tab"){
		campusid = $("#failed-campusList").val();
	}else{
		campusid = $("#uploading-campusList").val();
	}
	var param = {
		campusid: campusid,
		courseid: $("#detail-courselist").val()
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
				$('#detail-knowledge').tree({
					data: result.data.nodeList,
					loadFilter: function(data){
						return convert(data);
				    },
					onClick: function(node){
						$("#now-nodeid").val(node.id);
						$("#detail-knowledge-id").val(node.id);
						$("#detail-knowledge-name").val(node.text);
					}
				});
			} else {
				console.log(result.ret.code + ":" + result.ret.msg);
			}
		}
	});
}

function convert(rows){
	function exists(rows, parentId){
		for(var i=0; i<rows.length; i++){
			if (rows[i].id == parentId) return true;
		}
		return false;
	}
	var nodes = [];
	// get the top level nodes
	for(var i=0; i<rows.length; i++){
		var row = rows[i];
		if (!exists(rows, row.parentid)){
			nodes.push({
				id:row.id,
				text:row.name
			});
		}
	}
	
	var toDo = [];
	for(var i=0; i<nodes.length; i++){
		toDo.push(nodes[i]);
	}
	while(toDo.length){
		var node = toDo.shift();	// the parent node
		// get the children nodes
		for(var i=0; i<rows.length; i++){
			var row = rows[i];
			if (row.parentid == node.id){
				var child = {id:row.id,text:row.name};
				if (node.children){
					node.children.push(child);
				} else {
					node.children = [child];
				}
				toDo.push(child);
			}
		}
	}
	return nodes;
}

function initWebUploader(){
	// 初始化Web Uploader
	var uploader = WebUploader.create({
	    // 选完文件后，是否自动上传。
	    auto: true,
	    // swf文件路径
	    swf: ctx + '/static/js/webuploader/Uploader.swf',
	    // 文件接收服务端。
	    server: ctx+"/mobile/upload_image_by_app",
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    pick: '#filePicker'
	});
	
	// 当有文件添加进来的时候
	uploader.on( 'fileQueued', function( file ) {
		var fileItemList = $(".fileItem");
		if(fileItemList.length >= 3){
			alert("最多只能上传3个附件！");
			return;
		}
		if(file.size > 10485760){
			alert("附件大小不能超过10M！");
			return;
		}
	    var $li = $(
	            '<div id="'+file.id+'" class="fileItem">' +
	            	'<img>' +
//	    			'<span id="'+file.id+'" filename="'+file.name+'">'+file.name+'</span>' +
//	    			'<a onclick="removeFile(this)" class="btn btn-sm btn-alt btn-primary" data-toggle="tooltip" title="删除"><i class="fa fa-times"></i></a>' +
	    		'</div>'
	            ),
	    $img = $li.find('img');
	    // $list为容器jQuery实例
	    $("#fileList").prepend( $li );
	    $img.attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
		var fileurl = {
			filetype : file.ext,
			url : response.data.fileurl
		};
	    $( '#'+file.id ).html(
    			'<span filename="'+file.name+'">'+file.name+'</span>' +
    			'<a onclick="removeFile(this)" class="btn btn-sm btn-alt btn-primary" data-toggle="tooltip" title="删除"><i class="fa fa-times"></i></a>'
	    );
	    $span = $( '#'+file.id ).find("span");
	    $span.attr("fileurl",JSON.stringify(fileurl));
	});
	
	// 文件上传失败，显示上传出错。
	uploader.on( 'uploadError', function( file ) {
	    var $li = $( '#'+file.id ),
	        $error = $li.find('div.error');

	    // 避免重复创建
	    if ( !$error.length ) {
	        $error = $('<div class="error"></div>').appendTo( $li );
	    }

	    $error.text('上传失败');
	});
	
	// 完成上传完了，成功或者失败，先删除进度条。
	uploader.on( 'uploadComplete', function( file ) {
	    $( '#'+file.id ).find('.progress').remove();
	});
}